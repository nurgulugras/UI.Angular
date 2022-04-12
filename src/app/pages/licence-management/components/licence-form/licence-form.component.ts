import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Licence } from '../../../../models/entity/Licence';
import { ComponentBase } from '../../../../shared/components/component-base';
import { DynamicModalService } from '../../../../shared/services/dynamic-modal.service';
import { LicenceService } from '../../../../shared/services/licence.service';
import { LicenceAddOrUpdateComponent } from '../licence-add-or-update/licence-add-or-update.component';
import { SessionListComponent } from '../session-list/session-list.component';

@Component({
  selector: 'alms-licence-form',
  templateUrl: './licence-form.component.html',
  styleUrls: ['./licence-form.component.scss']
})
export class LicenceFormComponent extends ComponentBase implements OnInit  {

  //  #region [ Fields ]
selectedLicence: Licence;
@ViewChild(LicenceAddOrUpdateComponent) formComponent:LicenceAddOrUpdateComponent;

  // #endregion

  //  #region [ Initialize ]
  constructor(injector:Injector,private licenceService: LicenceService,private dynamicModalService:DynamicModalService ) {
    super(injector);
    this.listenOnLicenceChanges();
  }
  ngOnInit() {
   
  }
  // #endregion

  //  #region [ Entity ]
  // #endregion

  //  #region [ UI Tools ]
  getTitle(): string {
    // return this.isEditMode() ? this.selectedApplication.name : "Uygulama";
    return this.selectedLicence ? this.selectedLicence.name : "";
  }

  setFormStateToNewMode():void{
    this.formComponent.setFormStateToNewMode();
    this.formComponent.getGenerate();
  }
  setFormStateToEditMode():void{
    this.formComponent.setFormStateToEditMode();
  }
  closeFormComponent(){
    this.formComponent.closeForm();
  }
  updateLicenceOnComponent(){
    this.formComponent.update();
  }
  createLicenceOnComponent(){
    this.formComponent.create();
  }
  openAppKeyInfoComponent() {
    const popup = this.dynamicModalService.open<SessionListComponent>(
      SessionListComponent,
     "Oturum Bilgisi",
      true,
      true,
      true
    );
    popup.instance.selectedLicense = this.selectedLicence;
  }

  // #endregion

  //  #region [ Validations ]
 isSelectedLicence():boolean{
  return this.selectedLicence && this.selectedLicence.id>0 ? true : false;
}
 showNewLicenceButton():boolean{
  return this.formComponent && this.formComponent.showNewLicenceButton();
 }
 showSaveLicenceButton():boolean{
  return this.formComponent && this.formComponent.showSaveLicenceButton();
 }
showUpdateLicenceButton():boolean{
  return this.formComponent && this.formComponent.showUpdateLicenceButton();
 }
 showSessionButton():boolean{
  return this.formComponent && this.formComponent.showSessionButton();
 }
 showEditLicenceButton():boolean{
  return this.formComponent && this.formComponent.showEditLicenceButton();
 }
 isShowCloseButton():boolean{
  return this.formComponent && this.formComponent.showCancelButton();
 }

 
  // #endregion

  //  #region [ Internal ]
  listenOnLicenceChanges()
  {
   this.licenceService.onSelectedLicenceChanged.subscribe((licence)=>{
      this.selectedLicence = licence;
      this.pushLicenceChanges();
    });
  }
  pushLicenceChanges(){
    this.formComponent.onSelectedLicenceChanged(this.selectedLicence);
  }
  // #endregion
  

}
