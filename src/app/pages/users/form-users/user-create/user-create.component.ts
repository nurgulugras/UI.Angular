import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ComponentBase } from '../../../../shared/components/component-base';
import { User } from '../../../../models/entity/User';
import { PopupTool } from '../../../../models/internal/PopupTool';
import { UserAuthType } from '../../../../models/enums/UserAuthType.enum';
import { UsersService } from '../../../../shared/services/users.service';
import { ResultType } from '../../../../models/enums/ResultType.enum';
import { LanguageKeys } from '../../../../models/internal/language-keys';
import { NotifyConfirmType } from '../../../../models/enums/NotifyConfirmType.enum';
import { EnumHelper } from '../../../../shared/EnumHelper';
import { RoleType } from '../../../../models/enums/RoleType.enum';

@Component({
  selector: 'esa-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent extends ComponentBase implements OnInit {


  //  #region [ Fields ]
  user: User = new User();
  formGroup: FormGroup;
  popupTool: PopupTool;
  userAuthTypeUI = UserAuthType;
  authenticationTypes: string[] = [];
  roleTypes: string[] = [];

  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector, private usersService: UsersService) {
    super(injector);
    this.initFormGroup();
    this.onSubmit = this.onSubmit.bind(this);
    this.loadTypes();
  }
  ngOnInit() {
  }
  // #endregion

  //  #region [ Entity ]
  private createUserFromAPI(user: User): void {
    this._isRunning = true;
    this.usersService.createUser(user).subscribe(response => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this._notifyService.success(LanguageKeys.ROW_INSERTED);
        this.user=response.dataModel;
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    },
      error => {
        this._isRunning = false;
      });
  }
  private updateUserFromAPI(user: User): void {
    this._isRunning = true;
    this.usersService.updateUser(user).subscribe(response => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this._notifyService.success(LanguageKeys.ROW_UPDATED);
        this.closePopup("ok");
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    },
      error => {
        this._isRunning = false;
      });
  }
  private resetUserPasswordFromAPI(user: User): void {
    this._isRunning = true;
    this.usersService.resetUserPassword(user).subscribe(response => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this._notifyService.success(LanguageKeys.ROW_UPDATED);
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    },
      error => {
        this._isRunning = false;
      });
  }
  // #endregion

  //  #region [ UI Tools ]
  onSubmit() {
    this.setModelFromForm();
    if (this.isEditMode())
      this.updateUser();
    else
      this.createUser();
  }

  createUser() {
    if (!this.isValidForm())
      return;

    var modal = this._modalService.confirmYesNo("Kullanıcı Kaydetme", `Kullanıcı kaydetmek istediğinize emin misiniz?`);
    modal.onClosed.subscribe((replyType) => {
      if (replyType == NotifyConfirmType.Yes) {
        this.createUserFromAPI(this.user);
      }
    });
  }

  updateUser() {
    if (!this.isValidForm())
      return;

    var modal = this._modalService.confirmYesNo("Kullanıcı Güncelleme", `Kullanıcı güncellemek istediğinize emin misiniz?`);
    modal.onClosed.subscribe((replyType) => {
      if (replyType == NotifyConfirmType.Yes) {
        this.updateUserFromAPI(this.user);
      }
    });
  }
  cancelForm() {
    this.closePopup();
  }
  resetPassword() {
    if (!this.isEditMode()) {
      this._notifyService.error("Işleme devam etmeden önce kullanıcı kaydını yapınız.");
    }
    var modal = this._modalService.confirmYesNo("Şifre Sıfırla", `Şifre sırlamak istediğinize emin misiniz?`);
    modal.onClosed.subscribe((replyType) => {
      if (replyType == NotifyConfirmType.Yes) {
        this.resetUserPasswordFromAPI(this.user);
      }
    });
  }
 // #endregion

  // #region [ Public ]
  setDataToEdit(user: User) {
    this.user = user;
    this.formGroup.patchValue(user);
    this.repaitForm();
  }

  // #endregion

  //  #region [ Validations ]
  isValidForm(): boolean {
    return this.formGroup.valid;
  }
  isEditMode(): boolean {
    return this.user && this.user.id && this.user.id > 0;
  }
  isMyUser(): boolean {
    return this.isEditMode() && this.user.email == this._loggedInUser.username;
  }
  // #endregion

  //  #region [ Internal ]
  setModelFromForm() {
    if (!this.user)
      this.initModel();
    this.user = Object.assign(this.user, this.formGroup.value);
  }
  initFormGroup() {
    this.formGroup = new FormGroup({
      id: new FormControl(this.user.id),
      name: new FormControl(this.user.name, [Validators.required, this.noWhitespaceValidator]),
      surname: new FormControl(this.user.surname, [Validators.required, this.noWhitespaceValidator]),
      email: new FormControl(this.user.email, [Validators.required, this.noWhitespaceValidator]),
      role: new FormControl(this.user.role, [Validators.required]),
      isActive: new FormControl(this.user.isActive)
    });
    this.repaitForm();
  }
  repaitForm() {
    // if (this.isEditMode())
      // this.formGroup.controls['email'].disable();
  }
  initModel() {
    this.user = new User();
  }
  closePopup(data: any = null) {
    this.popupTool.closeMe(data);
  }
  loadTypes() {
    this.roleTypes = EnumHelper.getEnumValues(RoleType);
  }
  // #endregion
}