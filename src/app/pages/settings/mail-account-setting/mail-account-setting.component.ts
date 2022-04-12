import { Injector } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BasicAuthConfig } from '../../../models/entity/BasicAuthConfig';
import { NotifyConfirmType } from '../../../models/enums/NotifyConfirmType.enum';
import { ResultType } from '../../../models/enums/ResultType.enum';
import { PopupTool } from '../../../models/internal/PopupTool';
import { ComponentBase } from '../../../shared/components/component-base';
import { MailProviderService } from '../../../shared/services/mail-provider.service';
import { MailProvider } from '../../../models/entity/MailProvider';
import { LanguageKeys } from '../../../models/internal/language-keys';
import { DynamicModalService } from '../../../shared/services/dynamic-modal.service';
import { MailAccountTestComponent } from '../mail-account-test/mail-account-test.component';

@Component({
  selector: 'esa-mail-account-setting',
  templateUrl: './mail-account-setting.component.html',
  styleUrls: ['./mail-account-setting.component.scss']
})
export class MailAccountSettingComponent extends ComponentBase implements OnInit {

  //  #region [ Fields ]
  mailProvider: MailProvider = new MailProvider();
  formGroup: FormGroup;
  popupTool: PopupTool;
  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector, private mailProviderService: MailProviderService, private dynamicModalService: DynamicModalService) {
    super(injector);
    this.initFormGroup();
  }
  ngOnInit() {
    this.getMailProvider();
  }
  // #endregion

  //  #region [ Entity ]
  private getMailProviderFromAPI(): void {
    this._isRunning = true;
    this.mailProviderService.getMailProvider().subscribe(response => {
      this.initModel();
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.mailProvider = response.dataModel;
        this.formGroup.patchValue(this.mailProvider);
      } else {
        this._notifyService.error(response.message);
      }
    },
      error => {
        this._isRunning = false;
      });
  }
  private saveMailProviderFromAPI(mailProvider: MailProvider): void {
    this._isRunning = true;
    this.mailProviderService.saveMailProvider(mailProvider).subscribe(response => {
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
  private updateMailProviderFromAPI(mailProvider: MailProvider): void {
    this._isRunning = true;
    this.mailProviderService.updateMailProvider(mailProvider).subscribe(response => {
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
  }
  public refresh() {
    this.getMailProvider();
  }
  saveOrUpdateMailProvider() {
    this.setModelFromForm();

    if (!this.isValidForm()) {
      this._notifyService.warning("Form is not valid. Please check form.");
      return;
    }

    var modal = this._modalService.confirmYesNo("Update Mail Account", `Are you sure you want to update?`);
    modal.onClosed.subscribe((replyType) => {
      if (replyType == NotifyConfirmType.Yes) {
        if (this.isEditMode())
          this.updateMailProviderFromAPI(this.mailProvider);
        else
          this.saveMailProviderFromAPI(this.mailProvider);
      }
    });
  }
  sendTestMail(): void {
    const popup = this.dynamicModalService.open<MailAccountTestComponent>(
      MailAccountTestComponent,
      "Mail Test",
      true,
      true,
      false
    );
    popup.onClosed().subscribe(() => { });
  }
  // #endregion

  //  #region [ Validations ]
  isEditMode(): boolean {
    return this.mailProvider && this.mailProvider.id && this.mailProvider.id > 0;
  }
  isValidForm(): boolean {
    return this.formGroup.valid;
  }
  // #endregion

  //  #region [ Internal ]
  setModelFromForm() {
    if (!this.mailProvider)
      this.initModel();
    this.mailProvider = Object.assign(this.mailProvider, this.formGroup.value);
  }
  initFormGroup() {
    this.formGroup = new FormGroup({
      host: new FormControl(this.mailProvider.host, [Validators.required, this.noWhitespaceValidator]),
      port: new FormControl(this.mailProvider.port, [Validators.required]),
      username: new FormControl(this.mailProvider.username, [Validators.required, this.noWhitespaceValidator]),
      password: new FormControl(this.mailProvider.password, [Validators.required, this.noWhitespaceValidator]),
      senderMail: new FormControl(this.mailProvider.senderMail, [Validators.required, this.noWhitespaceValidator]),
      senderDisplayName: new FormControl(this.mailProvider.senderDisplayName),
      enableSSL: new FormControl(this.mailProvider.enableSSL),
      useBasicAuthentication: new FormControl(this.mailProvider.useBasicAuthentication),
      useDefaultCredentials: new FormControl(this.mailProvider.useDefaultCredentials)
    });
  }
  initModel() {
    this.mailProvider = new MailProvider();
  }
  getMailProvider() {
    this.getMailProviderFromAPI();
  }
  // #endregion
}