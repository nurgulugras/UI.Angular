import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BasicAuthConfig } from '../../../../models/entity/BasicAuthConfig';
import { SnapshotCreationParameter } from '../../../../models/api/SnapshotCreationParameter';
import { NotifyConfirmType } from '../../../../models/enums/NotifyConfirmType.enum';
import { ResultType } from '../../../../models/enums/ResultType.enum';
import { LanguageKeys } from '../../../../models/internal/language-keys';
import { PopupTool } from '../../../../models/internal/PopupTool';
import { ComponentBase } from '../../../../shared/components/component-base';
import { NotifyModalService } from '../../../../shared/services/notify-modal.service';
import { SnapshotsService } from '../../../../shared/services/snapshots.service';

@Component({
  selector: 'esa-basic-auth-configurations',
  templateUrl: './basic-auth-configurations.component.html',
  styleUrls: ['./basic-auth-configurations.component.scss']
})
export class BasicAuthConfigurationsComponent extends ComponentBase implements OnInit, OnChanges {

  //  #region [ Fields ]
  volume: string;
  @Input() basicAuthConfig: BasicAuthConfig = new BasicAuthConfig();
  formGroup: FormGroup;
  popupTool: PopupTool;
  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector, private snapshotsService: SnapshotsService) {
    super(injector);
    this.initFormGroup();
    this.onSubmit = this.onSubmit.bind(this);
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.formGroup.patchValue(this.basicAuthConfig);
  }
  ngOnInit() {
  }
  // #endregion

  //  #region [ Entity ]
  private createSnapshotFromAPI(snapshotCreationParameter: SnapshotCreationParameter): void {
    this._isRunning = true;
    this.snapshotsService.createSnapshot(snapshotCreationParameter).subscribe(response => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this._notifyService.success(LanguageKeys.ROW_INSERTED);
        this.closePopup("ok");
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
    this.createSnapshot();
  }

  createSnapshot() {
    if (!this.volume) {
      this._notifyService.error("The input parameter named [Volume] is empty! Contact support.");
      return;
    }
    if (this.formGroup.invalid)
      return;

    var modal = this._modalService.confirmYesNo("Update Config", `Are you sure you want to update?`);
    modal.onClosed.subscribe((replyType) => {
      if (replyType == NotifyConfirmType.Yes) {
        // this.createSnapshotFromAPI(this.snapshotCreationParameter);
      }
    });
  }
  cancelForm() {
    this.closePopup();
  }
  // #endregion

  //  #region [ Validations ]
  isValidForm(): boolean {
    return this.formGroup.valid;
  }
  // #endregion

  //  #region [ Internal ]
  setModelFromForm() {
    if (!this.basicAuthConfig)
      this.initModel();
    this.basicAuthConfig = Object.assign(this.basicAuthConfig, this.formGroup.value);
  }
  initFormGroup() {
    this.formGroup = new FormGroup({
      passPattern: new FormControl(this.basicAuthConfig.passPattern, [Validators.required, this.noWhitespaceValidator]),
      passPatternDesc: new FormControl(this.basicAuthConfig.passPatternDesc)
    });
  }
  initModel() {
    this.basicAuthConfig = new BasicAuthConfig();
  }
  closePopup(data: any = null) {
    this.popupTool.closeMe(data);
  }

  // #endregion
}