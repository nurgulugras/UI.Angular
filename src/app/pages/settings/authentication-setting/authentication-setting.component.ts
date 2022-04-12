import { Injector, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../../../shared/components/component-base';
import { ConfigurationsService } from '../../../shared/services/configurations.service';
import { AuthsConfig } from '../../../models/api/AuthsConfig';
import { ResultType } from '../../../models/enums/ResultType.enum';
import { NotifyConfirmType } from '../../../models/enums/NotifyConfirmType.enum';
import { LanguageKeys } from '../../../models/internal/language-keys';
import { BasicAuthConfigurationsComponent } from './basic-auth-configurations/basic-auth-configurations.component';
import { LdapAuthConfigurationsComponent } from './ldap-auth-configurations/ldap-auth-configurations.component';

@Component({
  selector: 'esa-authentication-setting',
  templateUrl: './authentication-setting.component.html',
  styleUrls: ['./authentication-setting.component.scss']
})
export class AuthenticationSettingComponent extends ComponentBase implements OnInit {

  //  #region [ Fields ]
  @ViewChild(BasicAuthConfigurationsComponent, { static: false }) basicAuthComponent: BasicAuthConfigurationsComponent;
  @ViewChild(LdapAuthConfigurationsComponent, { static: false }) ldapAuthComponent: LdapAuthConfigurationsComponent;
  authsConfig: AuthsConfig = new AuthsConfig();
  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector, private configurationsService: ConfigurationsService) {
    super(injector);
  }
  ngOnInit() {
    this.getConfigs();
  }
  // #endregion

  //  #region [ Entity ]

  private getConfigsFromAPI(): void {
    this._isRunning = true;
    this.configurationsService.getAuthsConfigs().subscribe(response => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.authsConfig = response.dataModel;
      } else {
        this._notifyService.error(response.message);
      }
    },
      error => {
        this._isRunning = false;
      });
  }
  private saveOrUpdateConfigsFromAPI(authsConfig: AuthsConfig): void {
    this._isRunning = true;
    this.configurationsService.saveOrUpdateAuthConfig(authsConfig).subscribe(response => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this._notifyService.success(LanguageKeys.ROW_UPDATED)
        this.authsConfig = response.dataModel;
      } else {
        this._notifyService.error(response.message);
      }
    },
      error => {
        this._isRunning = false;
      });
  }
  // #endregion

  //  #region [ UI Tools ]

  public refresh() {
    this.getConfigs();
  }
  // #endregion

  //  #region [ Validations ]
  isValid(authsConfig: AuthsConfig, showMessage: boolean): boolean {
    if (!authsConfig.basicAuthConfig && !authsConfig.ldapAuthConfig) {
      if (showMessage)
        this._notifyService.error("No config found!");
      return false;
    }
    if (!this.basicAuthComponent.isValidForm()) {
      if (showMessage)
        this._notifyService.error("There are errors in form 'Basic Authtentication'");
      return false;
    }
    if (!this.ldapAuthComponent.isValidForm()) {
      if (showMessage)
        this._notifyService.error("There are errors in form 'LDAP Configuration'");
      return false;
    }
    return true;
  }
  // #endregion

  //  #region [ Internal ]


  getAuthsConfigData(): AuthsConfig {
    var authsConfig = new AuthsConfig();

    this.basicAuthComponent.setModelFromForm();
    this.ldapAuthComponent.setModelFromForm();
    authsConfig.basicAuthConfig = this.basicAuthComponent.basicAuthConfig;
    authsConfig.ldapAuthConfig = this.ldapAuthComponent.ldapAuthConfig;

    return authsConfig;
  }

  public saveOrUpdateConfigs() {
    var authsConfig = this.getAuthsConfigData();

    if (!this.isValid(authsConfig, true)) {
      return
    };

    var modal = this._modalService.confirmYesNo("Update to Auths Configurations", `Are you sure you want to update the auths configuration?`);
    modal.onClosed.subscribe((replyType) => {
      if (replyType == NotifyConfirmType.Yes) {
        this.saveOrUpdateConfigsFromAPI(authsConfig);
      }
    });
  }
  private getConfigs() {
    this.getConfigsFromAPI();
  }
  // #endregion

}
