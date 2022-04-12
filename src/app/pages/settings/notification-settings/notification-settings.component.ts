import { Component, OnInit, Injector } from '@angular/core';
import { ComponentBase } from '../../../shared/components/component-base';
import { NotificationSeverityConfig } from '../../../models/entity/NotificationSeverityConfig';
import { Guid } from 'guid-typescript';
import { NotifyConfirmType } from '../../../models/enums/NotifyConfirmType.enum';
import { stringify } from 'querystring';
import { NotifySettingsService } from '../../../shared/services/notify-settings.service';
import { ResultType } from '../../../models/enums/ResultType.enum';
import { LanguageKeys } from '../../../models/internal/language-keys';
import { MailValidation } from '../../../shared/MailValidation';

@Component({
  selector: 'esa-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss']
})
export class NotificationSettingsComponent extends ComponentBase implements OnInit {

  //  #region [ Fields ]
  selectedValues: string;
  severityNotifyConfigs: NotificationSeverityConfig[] = [];
  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector, private notifySettingsService: NotifySettingsService) {
    super(injector);
  }
  ngOnInit() {
    this.loadDataList();
  }
  // #endregion

  //  #region [ Entity ]
  private getNotificationSeverityConfigsFromAPI(): void {
    this._isRunning = true;
    this.notifySettingsService.getNotificationSeverityConfigs().subscribe(response => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.setUidForExistsEntities(response.dataModel);
        this.severityNotifyConfigs = response.dataModel;
        if (this.severityNotifyConfigs && this.severityNotifyConfigs.length == 0)
          this.addNewItem();
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    },
      error => {
        this._isRunning = false;
      });
  }

  private createNotificationSeverityConfigFromAPI(notificationSeverityConfig: NotificationSeverityConfig): void {
    this._isRunning = true;
    this.notifySettingsService.createNotificationSeverityConfig(notificationSeverityConfig).subscribe(response => {
      this._isRunning = false;
      this.loadDataList();
      if (response.resultType == ResultType.Success) {
        this._notifyService.success(LanguageKeys.ROW_INSERTED);
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    },
      error => {
        this._isRunning = false;
      });
  }
  private updateNotificationSeverityConfigFromAPI(notificationSeverityConfig: NotificationSeverityConfig): void {
    this._isRunning = true;
    this.notifySettingsService.updateNotificationSeverityConfig(notificationSeverityConfig).subscribe(response => {
      this._isRunning = false;
      this.loadDataList();
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
  private deleteNotificationSeverityConfigFromAPI(notificationSeverityConfig: NotificationSeverityConfig): void {
    this._isRunning = true;
    this.notifySettingsService.deleteNotificationSeverityConfig(notificationSeverityConfig).subscribe(response => {
      this._isRunning = false;
      this.loadDataList();
      if (response.resultType == ResultType.Success) {
        this._notifyService.success(LanguageKeys.ROW_DELETED);
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    },
      error => {
        this._isRunning = false;
      });
  }
  deleteNotificationSeverityConfigFromLocal(notificationSeverityConfig: NotificationSeverityConfig): void {
    if (!notificationSeverityConfig.uid) return;
    this.severityNotifyConfigs = this.severityNotifyConfigs.filter(x => x.uid.toString() != notificationSeverityConfig.uid.toString());
  }
  // #endregion

  //  #region [ UI Tools ]

  addNewItem() {
    this.addNewEmptyModel();
  }
  saveConfig(severityNotifyConfig: NotificationSeverityConfig): void {
    if (!this.isValidConfig(severityNotifyConfig)) {
      this._notifyService.error("Form is not vaild! Please check config form.");
      return;
    }

    var modal = this._modalService.confirmYesNo("Save to Notify Config", `Are you sure you want to save the notify config?`);
    modal.onClosed.subscribe((replyType) => {
      if (replyType == NotifyConfirmType.Yes) {
        this.createNotificationSeverityConfigFromAPI(severityNotifyConfig);
      }
    });
  }
  updateConfig(severityNotifyConfig: NotificationSeverityConfig): void {
    if (!this.isValidConfig(severityNotifyConfig)) {
      this._notifyService.error("Form is not vaild! Please check config form.");
      return;
    }
    if (!this.isEditConfigState(severityNotifyConfig)) return;

    var modal = this._modalService.confirmYesNo("Update to Notify Config", `Are you sure you want to update the notify config?`);
    modal.onClosed.subscribe((replyType) => {
      if (replyType == NotifyConfirmType.Yes) {
        this.updateNotificationSeverityConfigFromAPI(severityNotifyConfig);
      }
    });
  }
  deleteNewItem(severityNotifyConfig: NotificationSeverityConfig) {

    if (!severityNotifyConfig) return;
    if (this.isInitModel(severityNotifyConfig)) {
      this.deleteNotificationSeverityConfigFromLocal(severityNotifyConfig);
      return;
    }
    else {
      var modal = this._modalService.confirmYesNo("Delete to Notify Config", `Are you sure you want to delete the notify config?`);
      modal.onClosed.subscribe((replyType) => {

        if (replyType == NotifyConfirmType.Yes) {

          if (this.isEditConfigState(severityNotifyConfig)) {
            this.deleteNotificationSeverityConfigFromAPI(severityNotifyConfig);
          } else {
            this.deleteNotificationSeverityConfigFromLocal(severityNotifyConfig);
          }

        }
      });
    }
  }
  loadDataList(): void {
    this.getNotificationSeverityConfigsFromAPI();
  }

  // #endregion

  //  #region [ Validations ]
  isSelectedAnySeverityType(severityNotifyConfig: NotificationSeverityConfig): boolean {
    if (!severityNotifyConfig) return false;
    return (severityNotifyConfig.isSelectedSeverityCritical == true || severityNotifyConfig.isSelectedSeverityError == true || severityNotifyConfig.isSelectedSeverityInfo == true || severityNotifyConfig.isSelectedSeverityWarning == true) ? true : false;
  }
  isInitModel(severityNotifyConfig: NotificationSeverityConfig): boolean {
    return (!severityNotifyConfig.id && !severityNotifyConfig.userMails && !severityNotifyConfig.isSelectedSeverityCritical && !severityNotifyConfig.isSelectedSeverityError && !severityNotifyConfig.isSelectedSeverityInfo && !severityNotifyConfig.isSelectedSeverityWarning) ? true : false;
  }
  isValidConfig(severityNotifyConfig: NotificationSeverityConfig): boolean {
    if (!severityNotifyConfig) return false;
    if (!(severityNotifyConfig.userMails && severityNotifyConfig.userMails.length > 0))
      return false;
    if (!this.isSelectedAnySeverityType(severityNotifyConfig)) return false;
    if (!this.isValidEmails(severityNotifyConfig)) return false;
    return true;
  }
  isValidEmails(severityNotifyConfig: NotificationSeverityConfig): boolean {
    if (!severityNotifyConfig) return false;
    if (!(severityNotifyConfig.userMails && severityNotifyConfig.userMails.length > 0))
      return false;
    var emails = severityNotifyConfig.userMails.split(";");

    var hasInvalidMail: boolean = false;

    for (let index = 0; index < emails.length; index++) {
      const email = emails[index].trim();
      if (!MailValidation.isValidEMail(email)) {
        hasInvalidMail = true;
        break;
      }
    }
    return !hasInvalidMail;
  }
  isEditConfigState(severityNotifyConfig: NotificationSeverityConfig): boolean {
    return severityNotifyConfig && severityNotifyConfig.id && severityNotifyConfig.id > 0;
  }
  // #endregion

  //  #region [ Internal ]
  addNewEmptyModel(): void {
    if (!this.severityNotifyConfigs)
      this.severityNotifyConfigs = [];
    var config = new NotificationSeverityConfig();
    config.uid = Guid.create();
    config.userMails = null;
    config.isSelectedSeverityInfo = false;
    config.isSelectedSeverityWarning = false;
    config.isSelectedSeverityError = false;
    config.isSelectedSeverityCritical = false;
    this.severityNotifyConfigs.push(config);
  }
  setUidForExistsEntities(severityNotifyConfigs: NotificationSeverityConfig[]): void {
    if (!severityNotifyConfigs) return;
    if (severityNotifyConfigs.length == 0) return;
    for (let index = 0; index < severityNotifyConfigs.length; index++) {
      const severityNotifyConfig = severityNotifyConfigs[index];
      severityNotifyConfig.uid = Guid.create();
    }
  }
  // #endregion
}
