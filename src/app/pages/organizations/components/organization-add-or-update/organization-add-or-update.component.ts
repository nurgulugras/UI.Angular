import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Organization } from '../../../../models/entity/Organization';
import { NotifyConfirmType } from '../../../../models/enums/NotifyConfirmType.enum';
import { ResultType } from '../../../../models/enums/ResultType.enum';
import { LanguageKeys } from '../../../../models/internal/language-keys';
import { ComponentBase } from '../../../../shared/components/component-base';
import { OrganizationsService } from '../../../../shared/services/organizations.service';
import * as _ from "lodash";
import { PageModeType } from '../../../../models/enums/PageModeType.enum';


@Component({
  selector: 'alms-organization-add-or-update',
  templateUrl: './organization-add-or-update.component.html',
  styleUrls: ['./organization-add-or-update.component.scss']
})
export class OrganizationAddOrUpdateComponent extends ComponentBase
implements OnInit
{
//  #region [ Fields ]
formGroup: FormGroup;
organization: Organization = new Organization();
organizationId: number;

// #endregion

//  #region [ Initialize ]
constructor(
  public injector: Injector,
  private organizationsService: OrganizationsService
) {
  super(injector);
  this.initFormGroup();
}
ngOnInit() {}
// #endregion

//  #region [ Entity ]
saveOrganizationFromAPI(organization: Organization) {
  organization.id = this.organizationId;
  this.organizationsService
    .createOrganization(organization)
    .subscribe((response) => {
      if (response.resultType == ResultType.Success) {
        this._notifyService.success(LanguageKeys.ROW_INSERTED);
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    });
}
updateOrganizationFromAPI(organization: Organization) {
  this.organizationsService
    .updateOrganization(organization)
    .subscribe((response) => {
      if (response.resultType == ResultType.Success) {
        this._notifyService.success(LanguageKeys.ROW_UPDATED);
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    });
}
// #endregion

//  #region [ UI Tools ]
setOrganizationToEdit(organization: Organization) {
  this.organization = _.cloneDeep(organization);
  this.setDataToForm(this.formGroup, this.organization);
}
saveOrUpdateOrganization() {
  this.setModelFromForm(this.formGroup, this.organization);

  // form valid ?
  if (!this.isValidForm()) {
    this._notifyService.error(LanguageKeys.FORM_INVALID_MESSAGE);
    return;
  }

  // emin misin?
  var modal = this._modalService.confirmYesNo(
    this.isEditMode() ? "Organizasyon Güncelleme" : "Yeni Organizasyon",
    this.isEditMode()
      ? "Organizasyon güncellemek istediğinize emin misiniz?"
      : "Yeni organizasyon kaydı yapılacaktır. Onaylıyor musunuz?"
  );

  modal.onClosed.subscribe((reply) => {
    if (reply == NotifyConfirmType.Yes) {

      if (this.isEditMode()) this.updateOrganization();
      else this.saveOrganization();
    }
  });
}

// #endregion

//  #region [ Validations ]
isEditMode(): boolean {
  return this.organization && this.organization.id && this.organization.id > 0;
}
isValidForm(): boolean {
  return this.formGroup.valid;
}

// #endregion

//  #region [ Internal ]
initFormGroup() {
  this.formGroup = new FormGroup({
    id: new FormControl(this.organization.id),
    createDate: new FormControl(this.organization.createDate),
    createUserName: new FormControl(this.organization.createUserName),
    name: new FormControl(this.organization.name, [
      Validators.required,
      this.noWhitespaceValidator,
    ]),
    isActive: new FormControl(this.organization.isActive),
  });

  // koşullu validasyon.....
  // this.formGroup.get("useForVersion").valueChanges.subscribe((val) => {
  //   if (val) {
  //     this.formGroup.controls["snapshotName"].clearValidators();
  //   } else {
  //     this.formGroup.controls["snapshotName"].setValidators([
  //       Validators.required,
  //       this.noWhitespaceValidator,
  //     ]);
  //   }
  //   this.formGroup.controls["snapshotName"].updateValueAndValidity();
  // });
}
saveOrganization() {
  this.saveOrganizationFromAPI(this.organization);
}
updateOrganization() {
  this.updateOrganizationFromAPI(this.organization);
}
// #endregion
}
