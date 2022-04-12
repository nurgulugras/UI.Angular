import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Company } from '../../../../../../models/entity/Company';
import { Organization } from '../../../../../../models/entity/Organization';
import { PageModeType } from '../../../../../../models/enums/PageModeType.enum';
import { ResultType } from '../../../../../../models/enums/ResultType.enum';
import { ExporterOptions } from '../../../../../../models/internal/exporter-options';
import { ExportPropertyInfo } from '../../../../../../models/internal/ExportPropertyInfo';
import { ComponentBase } from '../../../../../../shared/components/component-base';
import { CompaniesService } from '../../../../../../shared/services/companies.service';
import { DynamicModalService } from '../../../../../../shared/services/dynamic-modal.service';
import { OrganizationsService } from '../../../../../../shared/services/organizations.service';
import { CompanyAddOrUpdateComponent } from '../company-add-or-update/company-add-or-update.component';

@Component({
  selector: 'alms-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent  extends ComponentBase
implements OnInit
{
//  #region [ Fields ]
selectedCompany: Company;
companies: Company[] = [];
selectedOrganization: Organization;


// #endregion

//  #region [ Initialize ]
constructor(
  public injector: Injector,
  private companiesService: CompaniesService,
  private dynamicModalService: DynamicModalService,
) {
  super(injector);
  companiesService.onCompanyDataSourceChanged.subscribe(() =>{
    this.refresh();
  })
 
}
ngOnInit() {}
// #endregion

//  #region [ Entity ]
getCompaniesFromAPI(organizationId: number) {
  this._isRunning = true;
  this.companiesService.getCompanies(organizationId).subscribe((response) => {
    this._isRunning = false;
    if (response.resultType == ResultType.Success) {
      this.companies = response.dataModel;
    } else if (response.resultType == ResultType.Fail) {
      this._notifyService.error(response.message);
    }
  });
}
// #endregion

//  #region [ UI Tools ]
onSelectedOrganizationChanged(organization:Organization){
this.selectedOrganization=organization;
this.getCompaniesFromAPI(organization.id);
this.companiesService.onSelectedCompanyChanged.emit(null);
}
// createNewCompany() {
//   this.openCreateOrUpdateCompanyComponent(null);
// }
updateCompany(company: Company) {
  // this.openCreateOrUpdateCompanyComponent(company);
}

// openCreateOrUpdateCompanyComponent(company: Company) {
//   const popup = this.dynamicModalService.open<CompanyAddOrUpdateComponent>(
//     CompanyAddOrUpdateComponent,
//     company == null ? "Yeni Şirker Oluştur" : "Ürün Güncelleme",
//     true,
//     true,
//     true
//   );
//   popup.instance.companyId = this.selectedCompany.id;
//   if (company != null) popup.instance.setCompanyToEdit(company);
//   popup.onClosed().subscribe((response) => {
//     this.refresh();
//   });
// }

refresh() {
  if (this.selectedOrganization && this.selectedOrganization.id > 0)
    this.getCompanyList(this.selectedOrganization.id);
}
exportToExcel() {
  if (this.companies && this.companies.length > 0) {
    var opt = new ExporterOptions();
    opt.fileName = `şirket-listesi`;
    opt.headers = [
      new ExportPropertyInfo("name", "Şirket Adı"),
      new ExportPropertyInfo("isActive", "Aktif Mi?"),
    ];
    opt.isAutoColumn = true;
    opt.skipHeader = false;
    this._exporterService.exportToExcelFromJson(this.companies, opt);
  }
}
setSelectedCompany(company:Company):void{
this.selectedCompany=company;
this.companiesService.onSelectedCompanyChanged.emit(this.selectedCompany);
}
// #endregion

//  #region [ Validations ]
isSelectedAnyOrganization():boolean{
  return this.selectedOrganization &&  this.selectedOrganization.id>0;
}
// #endregion

//  #region [ Internal ]
getCompanyList(organizationId: number) {
  this.clearDataSource();
  this.getCompaniesFromAPI(organizationId);
}
clearDataSource() {
  this.companies = [];
}
// #endregion
}

