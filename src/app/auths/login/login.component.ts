import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequestModel } from '../../models/api/LoginRequestModel';
import { ResultType } from '../../models/enums/ResultType.enum';
import { LanguageKeys } from '../../models/internal/language-keys';
import { ComponentBase } from '../../shared/components/component-base';
import { AuthsService } from '../../shared/services/auths.service';
import { AppConfigService } from '../../models/internal/AppConfigService';

@Component({
  selector: 'esa-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends ComponentBase implements OnInit {

  //  #region [ Fields ]
  loginRequestModel: LoginRequestModel = new LoginRequestModel();
  formGroup: FormGroup;
  pageTitle: string;
  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector, private authsService: AuthsService, private router: Router, private appConfigService: AppConfigService
  ) {
    super(injector);
    this.initFormGroup();
    this.onSubmit = this.onSubmit.bind(this);
    this.pageTitle = appConfigService.appLongTitle;
  }
  ngOnInit() {
  }
  // #endregion

  //  #region [ Entity ]
  private loginFromAPI(loginRequestModel: LoginRequestModel): void {
    this._isRunning = true;
    this.authsService.login(loginRequestModel).subscribe(response => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
          this._notifyService.success(LanguageKeys.SUCCESS_LOGIN);
        this.router.navigate(["/dashboard"]);
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
    if (!this.isValidForm()) {
      this._notifyService.warning("Form is not valid. Please check form.");
      return;
    }
    this.setModelFromForm();
    this.login();
  }
  // #endregion

  //  #region [ Validations ]
  isValidForm(): boolean {
    return this.formGroup.valid;
  }
  // #endregion

  //  #region [ Internal ]
  setModelFromForm() {
    if (!this.loginRequestModel)
      this.loginRequestModel = new LoginRequestModel();
    this.loginRequestModel = Object.assign(this.loginRequestModel, this.formGroup.value);
  }
  initFormGroup() {
    this.formGroup = new FormGroup({
      username: new FormControl(this.loginRequestModel.username, [Validators.required, this.noWhitespaceValidator]),
      password: new FormControl(this.loginRequestModel.password, [Validators.required, this.noWhitespaceValidator]),
    });
  }
  login() {
    this.loginFromAPI(this.loginRequestModel);
  }
  // #endregion


}
