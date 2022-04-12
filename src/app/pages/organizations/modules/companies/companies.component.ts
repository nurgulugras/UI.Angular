import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Organization } from '../../../../models/entity/Organization';
import { PageModeType } from '../../../../models/enums/PageModeType.enum';
import { ComponentBase } from '../../../../shared/components/component-base';
import { OrganizationsService } from '../../../../shared/services/organizations.service';
import { CompanyAddOrUpdateComponent, CompanyListComponent } from './components';

@Component({
  selector: 'alms-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent extends ComponentBase implements OnInit  {

  //  #region [ Fields ]
org: Organization;
@ViewChild(CompanyAddOrUpdateComponent) formComponent:CompanyAddOrUpdateComponent;
@ViewChild(CompanyListComponent) companyListComponent:CompanyListComponent;


  // #endregion

  //  #region [ Initialize ]
  constructor(injector:Injector,private organizationsService: OrganizationsService ) {
    super(injector);
    this.listenOnOrganizationChanges();
  }
  ngOnInit() {
   
  }
  // #endregion

  //  #region [ Entity ]
  // #endregion

  //  #region [ UI Tools ]
  getTitle(): string {
    // return this.isEditMode() ? this.selectedApplication.name : "Uygulama";
    return this.org ? this.org.name : "";
  }

  setFormStateToNewMode():void{
    this.formComponent.setFormStateToNewMode();
  }
  setFormStateToEditMode():void{
    // this.companyListComponent.setFormStateToEditMode();
  }
  closeFormComponent(){
    this.formComponent.closeForm();
  }
  updateCompanyOnComponent(){
    this.formComponent.update();
  }
  createCompanyOnComponent(){
    this.formComponent.create();
    
  }

  // #endregion

  //  #region [ Validations ]
isSelectedOrganization():boolean{
  return this.org && this.org.id>0 ? true : false;
}
isInitMode():boolean{
  return this.formComponent && this.formComponent.formState==PageModeType.None
 }
isNewMode():boolean{
 return this.formComponent && this.formComponent.formState==PageModeType.New
}
isEditMode():boolean{
  return this.formComponent && this.formComponent.formState==PageModeType.Edit
 }
 isShowCloseButton():boolean{
  return !this.isInitMode();
 }
  // #endregion

  //  #region [ Internal ]
  listenOnOrganizationChanges()
  {
   this.organizationsService.onSelectedOrganizatonChanged.subscribe((organizasyon)=>{
      this.org = organizasyon;
      this.pushOrganizationChanges();
    });
  }
  pushOrganizationChanges(){
    this.formComponent.onSelectedOrganizationChanged(this.org);
    this.companyListComponent.onSelectedOrganizationChanged(this.org);
  }
  // #endregion
  

  

}
