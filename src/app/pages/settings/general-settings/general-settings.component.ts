import { Component, Injector, OnInit } from '@angular/core';
import { ComponentBase } from '../../../shared/components/component-base';
import { NodesService } from '../../../shared/services/nodes.service';
import { ResultType } from '../../../models/enums/ResultType.enum';
import { ConfigurationsService } from '../../../shared/services/configurations.service';
import { GlobalConfig } from '../../../models/entity/GlobalConfig';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifyConfirmType } from '../../../models/enums/NotifyConfirmType.enum';

@Component({
  selector: 'esa-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent extends ComponentBase implements OnInit {

  //  #region [ Fields ]
  globalConfig: GlobalConfig = new GlobalConfig();
  formGroup: FormGroup;
  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector, private configurationsService: ConfigurationsService) {
    super(injector);
    this.initFormGroup();
  }
  ngOnInit() {
    // this.getGlobaConfigsFromAPI();
  }
  // #endregion

  //  #region [ Entity ]

  private testAppFromAPI(): void {
    this._isRunning = true;
    this.configurationsService.testApp().subscribe(response => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this._notifyService.success("Test is ok");
      } else {
        this._notifyService.error(response.message);
      }
    },
      error => {
        this._isRunning = false;
      });
  }
  private getGlobaConfigsFromAPI(): void {
    this._isRunning = true;
    this.configurationsService.getGlobalConfigs().subscribe(response => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.globalConfig = response.dataModel;
        this.formGroup.patchValue(this.globalConfig);
      } else {
        this._notifyService.error(response.message);
      }
    },
      error => {
        this._isRunning = false;
      });
  }
  private saveOrUpdateGlobaConfigsFromAPI(globalConfig: GlobalConfig): void {
    this._isRunning = true;
    this.configurationsService.saveOrUpdateGlobalConfig(globalConfig).subscribe(response => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.globalConfig = response.dataModel;
        this.formGroup.patchValue(this.globalConfig);
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

  testApp(): void {
    this.testAppFromAPI();
  }
  onSubmit() {
    this.setModelFromForm();

    if (!this.isValidForm()) {
      this._notifyService.warning("Form is not valid. Please check form.");
      return;
    }

    var modal = this._modalService.confirmYesNo("Update Global Settings", `Are you sure you want to update?`);
    modal.onClosed.subscribe((replyType) => {
      if (replyType == NotifyConfirmType.Yes) {
        this.saveOrUpdateGlobaConfigsFromAPI(this.globalConfig);
      }
    });
  }

  changedWorkingMode() {
    this.setModelFromForm();
  }

  // #endregion

  //  #region [ Validations ]
  isEditMode(): boolean {
    return this.globalConfig && this.globalConfig.id && this.globalConfig.id > 0;
  }
  // #endregion

  //  #region [ Internal ]
  initFormGroup() {
    this.formGroup = new FormGroup({
      environmentType: new FormControl(this.globalConfig.environmentType, [Validators.required]),
      snaphotPrefix: new FormControl(this.globalConfig.snaphotPrefix, [Validators.required, this.noWhitespaceValidator]),
      snaphotTimestampFormat: new FormControl(this.globalConfig.snaphotTimestampFormat, [Validators.required, this.noWhitespaceValidator])
    });
  }
  setModelFromForm() {
    if (!this.globalConfig)
      this.initModel();
    this.globalConfig = Object.assign(this.globalConfig, this.formGroup.value);
  }
  initModel(): void {
    this.globalConfig = new GlobalConfig();
  }
  isValidForm(): boolean {
    return this.formGroup.valid;
  }
  // #endregion
}