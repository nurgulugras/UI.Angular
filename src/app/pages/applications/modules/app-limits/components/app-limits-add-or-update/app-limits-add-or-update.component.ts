import { Component, Injector, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AppLimit } from "../../../../../../models/entity/AppLimit";
import { NotifyConfirmType } from "../../../../../../models/enums/NotifyConfirmType.enum";
import { ResultType } from "../../../../../../models/enums/ResultType.enum";
import { LanguageKeys } from "../../../../../../models/internal/language-keys";
import { ComponentBase } from "../../../../../../shared/components/component-base";
import { AppLimitsService } from "../../../../../../shared/services/app-limits.service";
import * as _ from "lodash";

@Component({
  selector: "alms-app-limits-add-or-update",
  templateUrl: "./app-limits-add-or-update.component.html",
  styleUrls: ["./app-limits-add-or-update.component.scss"],
})
export class AppLimitsAddOrUpdateComponent
  extends ComponentBase
  implements OnInit
{
  //  #region [ Fields ]
  formGroup: FormGroup;
  appLimit: AppLimit = new AppLimit();
  applicationId: number;
  // #endregion

  //  #region [ Initialize ]
  constructor(
    public injector: Injector,
    private appLimitsService: AppLimitsService
  ) {
    super(injector);
    this.initFormGroup();
  }
  ngOnInit() {}
  // #endregion

  //  #region [ Entity ]
  saveApplicationFromAPI(appLimit: AppLimit) {
    appLimit.appId = this.applicationId;
    this.appLimitsService
      .createAppLimit(this.applicationId, appLimit)
      .subscribe((response) => {
        if (response.resultType == ResultType.Success) {
          this._notifyService.success(LanguageKeys.ROW_INSERTED);
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        }
      });
  }
  updateApplicationFromAPI(appLimit: AppLimit) {
    this.appLimitsService
      .updateAppLimit(this.applicationId, appLimit)
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
  setAppLimitToEdit(appLimit: AppLimit) {
    this.appLimit = _.cloneDeep(appLimit);
    this.setDataToForm(this.formGroup, this.appLimit);
  }
  saveOrUpdateAppLimit() {
    this.setModelFromForm(this.formGroup, this.appLimit);

    // form valid ?
    if (!this.isValidForm()) {
      this._notifyService.error(LanguageKeys.FORM_INVALID_MESSAGE);
      return;
    }

    // emin misin?
    var modal = this._modalService.confirmYesNo(
      this.isEditMode() ? "Ürün Güncelleme" : "Yeni Ürün",
      this.isEditMode()
        ? "Ürün güncellemek istediğinize emin misiniz?"
        : "Yeni ürün kaydı yapılacaktır. Onaylıyor musunuz?"
    );

    modal.onClosed.subscribe((reply) => {
      if (reply == NotifyConfirmType.Yes) {

        if (this.isEditMode()) this.updateAppLimit();
        else this.saveAppLimit();
      }
    });
  }
  // #endregion

  //  #region [ Validations ]
  isEditMode(): boolean {
    return this.appLimit && this.appLimit.id && this.appLimit.id > 0;
  }
  isValidForm(): boolean {
    return this.formGroup.valid;
  }

  // #endregion

  //  #region [ Internal ]
  initFormGroup() {
    this.formGroup = new FormGroup({
      id: new FormControl(this.appLimit.id),
      createDate: new FormControl(this.appLimit.createDate),
      createUserName: new FormControl(this.appLimit.createUserName),
      limitName: new FormControl(this.appLimit.limitName, [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
      description: new FormControl(this.appLimit.description),
      isActive: new FormControl(this.appLimit.isActive),
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
  saveAppLimit() {
    this.saveApplicationFromAPI(this.appLimit);
  }
  updateAppLimit() {
    this.updateApplicationFromAPI(this.appLimit);
  }
  // #endregion
}
