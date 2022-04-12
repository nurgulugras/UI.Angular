import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Application } from '../../../../../../models/entity/Application';
import { NotifyConfirmType } from '../../../../../../models/enums/NotifyConfirmType.enum';
import { ResultType } from '../../../../../../models/enums/ResultType.enum';
import { LanguageKeys } from '../../../../../../models/internal/language-keys';
import { ComponentBase } from '../../../../../../shared/components/component-base';
import { ApplicationsService } from '../../../../../../shared/services/applications.service';
import * as _ from "lodash";
import { Organization } from '../../../../../../models/entity/Organization';
import { PageModeType } from '../../../../../../models/enums/PageModeType.enum';
import { CompaniesService } from '../../../../../../shared/services/companies.service';
import { Company } from '../../../../../../models/entity/Company';


@Component({
  selector: 'alms-company-add-or-update',
  templateUrl: './company-add-or-update.component.html',
  styleUrls: ['./company-add-or-update.component.scss']
})
export class CompanyAddOrUpdateComponent extends ComponentBase
implements OnInit
{
//  #region [ Fields ]
@Output() onUpdateApplication: EventEmitter<Application> = new EventEmitter();
@ViewChild('form') form: any;
formGroup: FormGroup;
selectedOrganization: Organization;
formState:PageModeType=PageModeType.None;
company:Company;
// #endregion

//  #region [ Initialize ]
constructor(
  public injector: Injector,
  private companyService:CompaniesService,
) {
  super(injector);
  this.initCompany();
  this.initFormGroup();
  companyService.onSelectedCompanyChanged.subscribe((company:Company)=>{
  this.company= company ? _.cloneDeep(company) :this.initCompany();
  this.setDataToForm(this.formGroup, this.company);
  this.formState=company && company.id>0 ? PageModeType.Edit : PageModeType.None;
  })
}
ngOnInit() {}
// #endregion

//  #region [ Entity ]
updateCompanyFromAPI(company: Company) {
  this.companyService
    .updateCompany(this.selectedOrganization.id,company)
    .subscribe((response) => {
      if (response.resultType == ResultType.Success) {
        this._notifyService.success(LanguageKeys.ROW_UPDATED);
        this.companyService.onCompanyDataSourceChanged.emit();
        this.closeForm();
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    });
}
saveCompanyFromAPI(company: Company) {
  company.organizationId = this.selectedOrganization.id;
  this.companyService
    .createCompany(this.selectedOrganization.id,company)
    .subscribe((response) => {
      if (response.resultType == ResultType.Success) {
        this.companyService.onCompanyDataSourceChanged.emit();
        this.closeForm();
        this._notifyService.success(LanguageKeys.ROW_INSERTED);
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    });
}
// #endregion

//  #region [ UI Tools ]
onSelectedOrganizationChanged(organization:Organization){
  this.selectedOrganization=organization;
  this.clearForm();
  }
public update(): void {
  this.setModelFromForm(this.formGroup, this.company);

  // form valid ?
  if (!this.isValidForm()) {
    this._notifyService.error(LanguageKeys.FORM_INVALID_MESSAGE);
    return;
  }

  // emin misin?
  var modal = this._modalService.confirmYesNo(
    "Şirket Güncelleme",
    "Şirketi güncellemek istediğinize emin misiniz?"
  );

  modal.onClosed.subscribe((reply) => {
    if (reply == NotifyConfirmType.Yes) {
      this.updateCompanyFromAPI(this.company);
    }
  });
}
public create(): void {
  this.setModelFromForm(this.formGroup, this.company);


  // form valid ?
  if (!this.isValidForm()) {
    this._notifyService.error(LanguageKeys.FORM_INVALID_MESSAGE);
    return;
  }

  // emin misin?
  var modal = this._modalService.confirmYesNo(
    "Şirket Ekle",
    "Şirketi eklemek istediğinize emin misiniz?"
  );

  modal.onClosed.subscribe((reply) => {
    if (reply == NotifyConfirmType.Yes) {
      this.saveCompanyFromAPI(this.company);
    }
  });
}
  setFormStateToNewMode():void{
   this.formState=PageModeType.New;
 }
 closeForm(){
  this.initCompany();
  this.formState=PageModeType.None;
  this.clearForm();
}
// #endregion

//  #region [ Validations ]
isValidForm(): boolean {
  return this.formGroup.valid;
}
isEditMode(): boolean {
return this.formState==PageModeType.Edit;
}
isNewMode(): boolean {
  return this.formState==PageModeType.New;
}
isInitMode():boolean{
  return this.formState==PageModeType.None;
}
// #endregion

//  #region [ Internal ]
initFormGroup() {
  this.formGroup = new FormGroup({
    id: new FormControl(this.company.id),
    createDate: new FormControl(this.company.createDate),
    createUserName: new FormControl(this.company.createUserName),
    name: new FormControl(this.company.name, [
      Validators.required,
      this.noWhitespaceValidator,
    ]),
    isActive: new FormControl(this.company.isActive),
  });
}

initCompany():Company{
  this.company=new Company();
  return this.company;
}
clearForm(){
  if(this.form)
  this.form.reset();
}

// #endregion
}