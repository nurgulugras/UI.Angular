import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifyConfirmType } from '../../../../models/enums/NotifyConfirmType.enum';
import { PageModeType } from '../../../../models/enums/PageModeType.enum';
import { ResultType } from '../../../../models/enums/ResultType.enum';
import { LanguageKeys } from '../../../../models/internal/language-keys';
import { ComponentBase } from '../../../../shared/components/component-base';
import { Licence } from '../../../../models/entity/Licence';
import { LicenceService } from '../../../../shared/services/licence.service';
import * as _ from "lodash";
import { Company } from '../../../../models/entity/Company';
import { Application } from '../../../../models/entity/Application';
import { ApplicationsService } from '../../../../shared/services/applications.service';
import { CompaniesService } from '../../../../shared/services/companies.service';
import { EnumHelper } from '../../../../shared/EnumHelper';
import { LicensePeriodType } from '../../../../models/enums/LicensePeriodType.enum';
import { AppProduct } from '../../../../models/entity/AppProduct';
import { OnOffType } from '../../../../models/enums/OnOffType.enum';
import { Sharing } from '../../../../models/entity/Sharing';
import { AppProductsService } from '../../../../shared/services/app-products.service';
import { AppLimitsService } from '../../../../shared/services/app-limits.service';
import { AppLimit } from '../../../../models/entity/AppLimit';
import { LicenseProduct } from '../../../../models/entity/LicenseProduct';
import { Guid } from 'guid-typescript';
import { LicenseLimit } from '../../../../models/entity/LicenseLimit';



@Component({
  selector: 'alms-licence-add-or-update',
  templateUrl: './licence-add-or-update.component.html',
  styleUrls: ['./licence-add-or-update.component.scss']
})
export class LicenceAddOrUpdateComponent extends ComponentBase
implements OnInit
{
//  #region [ Fields ]
// @Output() onUpdateApplication: EventEmitter<Application> = new EventEmitter();
@ViewChild('form') form: any;
formGroup: FormGroup;

selectedLicence: Licence;
windowsPreviousVersionsInput: ElementRef;
appProduct: AppProduct;
formState:PageModeType=PageModeType.None;
companies:Company[]=[];
applications:Application[]=[];
generateLicense:Licence;
periodTypes: string[]=[];
appProducts:AppProduct[]=[];
appLimits:AppLimit[]=[];
licenseProducts:LicenseProduct[]=[];
licenseLimits:LicenseLimit[]=[];
selectedApplication: number;
minSession=0;
minLimits=1;
// #endregion

//  #region [ Initialize ]
constructor(
  public injector: Injector,
  private licenceService:LicenceService,
  private companiesService:CompaniesService,
  private applicationsService:ApplicationsService,
  private appProductsService: AppProductsService,
  private appLimitsService: AppLimitsService,

) {
  super(injector);
  this.initLicence();
  this.initFormGroup();
  this.loadTypes();
  
}
ngOnInit() {
  this.getCompanies();
  this.getApplications();
}

// #endregion

//  #region [ Entity ]
updateLicenceFromAPI(licence: Licence) {
  this.licenceService
    .updateLicence(licence)
    .subscribe((response) => {
      if (response.resultType == ResultType.Success) {
        this._notifyService.success(LanguageKeys.ROW_UPDATED);
        this.licenceService.onLicenceDataSourceChanged.emit();
        this.formState=PageModeType.Detail;
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    });
}
saveLicenceFromAPI(licence: Licence) {

  this.licenceService
    .createLicence(licence)
    .subscribe((response) => {
      if (response.resultType == ResultType.Success) {
        this.licenceService.onLicenceDataSourceChanged.emit();
        this.formState=PageModeType.Detail;
        this._notifyService.success(LanguageKeys.ROW_INSERTED);
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    });
}
getCompaniesFromAPI() {
  this._isRunning = true;
  this.companiesService.getActiveCompanies().subscribe((response) => {
    this._isRunning = false;
    if (response.resultType == ResultType.Success) {
      this.companies = response.dataModel;
    } else if (response.resultType == ResultType.Fail) {
      this._notifyService.error(response.message);
    }
  });
}
getApplicationsFromAPI() {
  this._isRunning = true;
  this.applicationsService.getApplications().subscribe((response) => {
    this._isRunning = false;
    if (response.resultType == ResultType.Success) {
      this.applications = response.dataModel;
    } else if (response.resultType == ResultType.Fail) {
      this._notifyService.error(response.message);
    }
  });
}

getAppProductsFromAPI(appId: number) {
  this._isRunning = true;
  this.appProducts = []
  this.appProductsService.getAppProducts(appId).subscribe((response) => {
    this._isRunning = false;
    if (response.resultType == ResultType.Success) {
      this.appProducts = response.dataModel;
    } else if (response.resultType == ResultType.Fail) {
      this._notifyService.error(response.message);
    }
  });
}
getAppLimitsFromAPI(appId: number) {
  this._isRunning = true;
  this.appLimits = []
  this.appLimitsService.getAppLimits(appId).subscribe((response) => {
    this._isRunning = false;
    if (response.resultType == ResultType.Success) {
      this.appLimits = response.dataModel;
    } else if (response.resultType == ResultType.Fail) {
      this._notifyService.error(response.message);
    }
  });
}
getGenerateLicenceFromAPI(){
  this._isRunning = true;
  this.licenceService.getGenerateLicence().subscribe((response) => {
    this._isRunning = false;
    if (response.resultType == ResultType.Success) {
      this.generateLicense = response.dataModel;
    } else if (response.resultType == ResultType.Fail) {
      this._notifyService.error(response.message);
    }
  });

}
// #endregion

//  #region [ UI Tools ]
onSelectedLicenceChanged(licence:Licence){
  this.selectedLicence= licence ? _.cloneDeep(licence) :this.initLicence();
  this.setDataToForm(this.formGroup, this.selectedLicence);
  this.formState=licence && licence.id>0 ? PageModeType.Detail : PageModeType.None;
  this.licenseProducts=this.selectedLicence.licenseProducts;
  this.licenseLimits=this.selectedLicence.licenseLimits;
  this.onChangeToApplication({value:licence.appId })
  }
  setGenerate(generateLicense: Licence) {
    this.generateLicense = _.cloneDeep(generateLicense);
    this.setDataToForm(this.formGroup, this.generateLicense);
  }
public update(): void {
  this.setModelFromForm(this.formGroup, this.selectedLicence);
  this.selectedLicence.licenseLimits=this.licenseLimits;
  this.selectedLicence.licenseProducts=this.licenseProducts;
  
  if(!this.isValidForm()) {
    this._notifyService.error(LanguageKeys.FORM_INVALID_MESSAGE);
    return;
  }

  // emin misin?
  var modal = this._modalService.confirmYesNo(
    "Lisansı Güncelle",
    "Lisansı güncellemek istediğinize emin misiniz?"
  );

  modal.onClosed.subscribe((reply) => {
    if (reply == NotifyConfirmType.Yes) {
      this.updateLicenceFromAPI(this.selectedLicence);
    }
  });
}
public create(): void {
  this.setModelFromForm(this.formGroup, this.selectedLicence);
  this.selectedLicence.licenseLimits=this.licenseLimits;
  this.selectedLicence.licenseProducts=this.licenseProducts;

 
  if(!this.isValidForm()) {
    this._notifyService.error(LanguageKeys.FORM_INVALID_MESSAGE);
    return;
  }

  // emin misin?
  var modal = this._modalService.confirmYesNo(
    "Lisansı Ekle",
    "Lisansı eklemek istediğinize emin misiniz?"
  );

  modal.onClosed.subscribe((reply) => {
    if (reply == NotifyConfirmType.Yes) {
      this.saveLicenceFromAPI(this.selectedLicence);
      
    }
  });
}
 setFormStateToNewMode():void{
   this.formState=PageModeType.New;
   this.getGenerate();

 }
 setFormStateToEditMode():void{
  this.formState=PageModeType.Edit;


}
 closeForm(){
  this.initLicence();
  this.formState=PageModeType.None;
  this.clearForm();
}
onChangeToApplication(e) {
  this.selectedApplication =e.value;
  this.getAppNestedDataSource(this.selectedApplication);
}


addNewLicenseProductToList(){
  var licenseProduct=new LicenseProduct();
  licenseProduct.uid=Guid.create();
  this.licenseProducts.push(licenseProduct);
}
addNewLicenseLimitToList(){
 var licenseLimit=new LicenseLimit();
 licenseLimit.uid=Guid.create();
 this.licenseLimits.push(licenseLimit);
}
deleteSelectedLicenseFromList(licenseProduct:LicenseProduct){
  if (!licenseProduct.uid) return;
  this.licenseProducts = this.licenseProducts.filter(x => x.uid.toString() != licenseProduct.uid.toString());
}
deleteSelectedLicenseLimitFromList(licenseLimit:LicenseLimit){
  if (!licenseLimit.uid) return;
  this.licenseLimits = this.licenseLimits.filter(x => x.uid.toString() != licenseLimit.uid.toString());
}
// #endregion

//  #region [ Validations ]
 showNewLicenceButton():boolean{
  return this.formState==PageModeType.None
 }
 showSaveLicenceButton():boolean{
  return this.formState==PageModeType.New
 }
 showEditLicenceButton():boolean{
  return this.formState==PageModeType.Detail && !this.isRegistered();
 }
 showSessionButton():boolean{
  return this.formState==PageModeType.Detail && this.isRegistered();
 }
 showUpdateLicenceButton():boolean{
  return this.formState==PageModeType.Edit && !this.isRegistered()
 }
 showCancelButton():boolean{
   return this.formState==PageModeType.Edit || this.formState==PageModeType.New;
 }
 isEditableForm():boolean{
   return (this.formState==PageModeType.Edit || this.formState==PageModeType.New) && !this.isRegistered();
 }
 isRegistered():boolean{
   return this.selectedLicence && this.selectedLicence.id>0 && this.selectedLicence.isRegistered;
 }
 isValidProduct(licenseProduct: LicenseProduct):boolean {
  if (!licenseProduct) return false;
  if (!(licenseProduct.appProductId && licenseProduct.appProductId > 0)) 
  return false;
  return true;
}
isValidLimit(licenseLimit: LicenseLimit):boolean {
  if (!licenseLimit) return false;
  if (!((licenseLimit.appLimitId && licenseLimit.appLimitId > 0) && (licenseLimit.limit && parseInt(licenseLimit.limit) > 0 ))) return false;
  return true;
}
isValidForm():boolean{
if(!this.formGroup.valid) return false;
if(!this.isValidSelectedProducts()) return false;
if(!this.isValidSelectedLimits()) return false;
return true;
}
isValidSelectedProducts():boolean{
  if(!this.licenseProducts) return false;
  if(this.licenseProducts.length==0) return false;
  for (let index = 0; index < this.licenseProducts.length; index++) {
    const licenseProduct = this.licenseProducts[index];
    var isValidLicenseProduct=this.isValidProduct(licenseProduct);
    if(!isValidLicenseProduct) return false;
  }
   return true;
}
isValidSelectedLimits():boolean{
  if(!this.licenseLimits) return true;
  if(this.licenseLimits.length==0) return true;
  this.licenseLimits.forEach(licenseLimit=> {
    var isValidLicenseLimit=this.isValidLimit(licenseLimit);
    if(!isValidLicenseLimit) return false;
   }) 
   return true;
}




// #endregion

//  #region [ Internal ]
initFormGroup() {
  this.formGroup = new FormGroup({
    id: new FormControl(this.selectedLicence.id),
    createDate: new FormControl(this.selectedLicence.createDate),
    createUserName: new FormControl(this.selectedLicence.createUserName),
    name: new FormControl(this.selectedLicence.name, [
      Validators.required,
      this.noWhitespaceValidator,
    ]),
    appId:new FormControl(this.selectedLicence.appId,[
      Validators.required
    ]),
    companyId:new FormControl(this.selectedLicence.companyId,
      [
        Validators.required
      ]),
    licenseNo:new FormControl(this.selectedLicence.licenseNo,[
      Validators.required,
      this.noWhitespaceValidator,
    ]),
    licensePeriodType:new FormControl(this.selectedLicence.licensePeriodType,[
      Validators.required,
    ]),
    licensePeriod:new FormControl(this.selectedLicence.licensePeriod,[
      Validators.required,
    ]),
    sessionLimit:new FormControl(this.selectedLicence.sessionLimit,[
      Validators.required,
      Validators.min(this.minSession),
    ]),
    startDate:new FormControl(this.selectedLicence.startDate,[
      Validators.required,
    ]),
    endDate:new FormControl(this.selectedLicence.endDate,[
    ]),
    registeredDate:new FormControl(this.selectedLicence.registeredDate,[
    ]),
    isRegistered:new FormControl(this.selectedLicence.isRegistered,[
    ]),
  });
}

initLicence():Licence{
  this.selectedLicence=new Licence();
  return this.selectedLicence;
}
clearForm(){
  if(this.form)
  this.form.reset();
}
getCompanies(){
  this.getCompaniesFromAPI();
}
getApplications(){
  this.getApplicationsFromAPI();
}
getGenerate(){
this.getGenerateLicenceFromAPI();
}
getAppNestedDataSource(appId:number){
  this.getAppLimitsFromAPI(appId);
  this.getAppProductsFromAPI(appId);
}
loadTypes() {
  this.periodTypes = EnumHelper.getEnumValues(LicensePeriodType);
}
// #endregion
}
