import { Component, Injector, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UserPassChangeModel } from '../../../models/api/UserPassChangeModel';
import { NotifyConfirmType } from '../../../models/enums/NotifyConfirmType.enum';
import { ResultType } from '../../../models/enums/ResultType.enum';
import { PopupTool } from '../../../models/internal/PopupTool';
import { ComponentBase } from '../../../shared/components/component-base';
import { UsersService } from '../../../shared/services/users.service';
import { AuthToolService } from '../../../shared/AuthToolService';

@Component({
  selector: 'esa-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent extends ComponentBase implements OnInit {
  //  #region [ Fields ]
  formGroup: FormGroup;
  popupTool: PopupTool;
  userPassChangeModel: UserPassChangeModel = new UserPassChangeModel();
  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector, private usersService: UsersService, private authToolService: AuthToolService) {
    super(injector);
    this.initFormGroup();
    this.onSubmit = this.onSubmit.bind(this);
  }

  ngOnInit() {
  }
  // #endregion

  //  #region [ Entity ]

  private changePassFromAPI(userPassChangeModel: UserPassChangeModel): void {
    this._isRunning = true;
    this.usersService.changeUserPassword(userPassChangeModel).subscribe(response => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {

        var modal = this._modalService.confirmOk("Değiştirme Başarılı", `Şifre güncellemesi başarılı oldu. Devam etmeden önce oturumu yenilemeniz gerekir. 'Tamam' düğmesine tıkladıktan sonra oturumunuz sonlandırılacaktır.`);
        modal.onClosed.subscribe(() => {
          this.authToolService.logout();
          this.closePopup();
        });
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    },
    error => {
      this._isRunning = false;
    });
  }
  changeUserPassword
  // #endregion

  //  #region [ UI Tools ]
  onSubmit() {
    this.changePass();
  }
  // #endregion

  //  #region [ Validations ]
  isValidForm(): boolean {
    return this.formGroup.valid;
  }
  // #endregion

  //  #region [ Internal ]
  setModelFromForm() {
    if (!this.userPassChangeModel)
      this.initModel();
    this.userPassChangeModel = Object.assign(this.userPassChangeModel, this.formGroup.value);
  }
  initFormGroup() {
    this.formGroup = new FormGroup({
      oldPassword: new FormControl(this.userPassChangeModel.oldPassword, [Validators.required, this.noWhitespaceValidator]),
      newPassword: new FormControl(this.userPassChangeModel.newPassword, [Validators.required, this.noWhitespaceValidator]),
      confirmPassword: new FormControl("", [Validators.required, this.confirmEquals()])
    });
  }
  confirmEquals(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      control.value?.toLowerCase() === this.passwordValue.toLowerCase()
        ? null : { noMatch: true };
  }
  get passwordValue() {
    if (!this.formGroup) return "";
    var newPassword = this.formGroup.value.newPassword;
    return newPassword ? newPassword : "";
  }

  initModel() {
    this.userPassChangeModel = new UserPassChangeModel();
  }
  closePopup(data: any = null) {
    this.popupTool.closeMe(data);
  }
  changePass() {
    if (!this.isValidForm()) {
      this._notifyService.warning("Form geçerli değil. Lütfen Formu Kontrol Edin.");
      return;
    }

    this.setModelFromForm();

    var modal = this._modalService.confirmYesNo("Şifre Değiştir", `Şifrenizi değiştirmek istediğinizden emin misiniz?`);
    modal.onClosed.subscribe((replyType) => {
      if (replyType == NotifyConfirmType.Yes) {
        this.changePassFromAPI(this.userPassChangeModel);
      }
    });
  }
  // #endregion
}