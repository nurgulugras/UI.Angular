import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ResultType } from '../../../../models/enums/ResultType.enum';
import { ComponentBase } from '../../../../shared/components/component-base';
import { SnapshotsService } from '../../../../shared/services/snapshots.service';
import { LanguageKeys } from '../../../../models/internal/language-keys';
import { NotifyConfirmType } from '../../../../models/enums/NotifyConfirmType.enum';
import { SnapshotCreationParameter } from '../../../../models/api/SnapshotCreationParameter';
import { PopupTool } from '../../../../models/internal/PopupTool';
import { SnapshotParameters } from '../../../../models/parameters/SnapshotParameters';

@Component({
  selector: 'esa-snapshot-create',
  templateUrl: './snapshot-create.component.html',
  styleUrls: ['./snapshot-create.component.scss']
})
export class SnapshotCreateComponent extends ComponentBase implements OnInit {

  //  #region [ Fields ]
  volume: string;
  snapshotCreationParameter: SnapshotCreationParameter = new SnapshotCreationParameter;
  formGroup: FormGroup;
  popupTool: PopupTool;
  snapshotParameters: SnapshotParameters;
  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector, private snapshotsService: SnapshotsService) {
    super(injector);
    this.initFormGroup();
    this.onSubmit = this.onSubmit.bind(this);
  }
  ngOnInit() {
    this.initModel();
    this.setModelFromForm();
    this.snapshotCreationParameter.useForVersion = true;
    this.getSnapshotParametersFromAPI();
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
  private getSnapshotParametersFromAPI(): void {
    this._isRunning = true;
    this.snapshotsService.getSnapshotParameters().subscribe(response => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.snapshotParameters = response.dataModel;
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
      return;
    }
    this.setModelFromForm();
    this.createSnapshot();
  }

  createSnapshot() {
    var message = "";
    if (!this.snapshotCreationParameter.useForVersion && this.snapshotCreationParameter.snapshotName == this.snapshotParameters.snaphotPrefix) {
      message = `- The snapshot name you enter '${this.snapshotCreationParameter.snapshotName}' <strong>will appear in previous versions</strong> as it is a default snapshot prefix.<br><br>`;
    }
    message = message + "Are you sure you want to create the snapshot?";
    var modal = this._modalService.confirmYesNo("Create to Snapshot", message);
    modal.onClosed.subscribe((replyType) => {
      if (replyType == NotifyConfirmType.Yes) {
        this.createSnapshotFromAPI(this.snapshotCreationParameter);
      }
    });
  }
  cancelForm() {
    this.closePopup();
  }
  // #endregion

  //  #region [ Validations ]
  canTypeSnapshotName(): boolean {
    return this.formGroup.value.useForVersion;
  }
  isValidForm(): boolean {
    if (!this.volume)
      return false;
    if (this.formGroup.invalid)
      return false;
    return true;
  }
  // #endregion

  //  #region [ Internal ]
  setModelFromForm() {
    if (!this.snapshotCreationParameter)
      this.initModel();
    this.snapshotCreationParameter = Object.assign(this.snapshotCreationParameter, this.formGroup.value);
    this.snapshotCreationParameter.volume = this.volume;
    this.snapshotCreationParameter.snapshotName = this.snapshotCreationParameter.snapshotName ? this.snapshotCreationParameter.snapshotName.trim() : null;
  }
  initFormGroup() {

    this.formGroup = new FormGroup({
      snapshotName: new FormControl(this.snapshotCreationParameter.snapshotName, [Validators.required, this.noWhitespaceValidator]),
      description: new FormControl(this.snapshotCreationParameter.description),
      useForVersion: new FormControl(this.snapshotCreationParameter.useForVersion),
    });

    this.formGroup.get('useForVersion').valueChanges.subscribe(val => {
      if (val) {
        this.formGroup.controls['snapshotName'].clearValidators();
      } else {
        this.formGroup.controls['snapshotName'].setValidators([Validators.required, this.noWhitespaceValidator]);
      }
      this.formGroup.controls['snapshotName'].updateValueAndValidity();
    });

  }
  initModel() {
    this.snapshotCreationParameter = new SnapshotCreationParameter;
    this.snapshotCreationParameter.useForVersion = true;
  }
  closePopup(data: any = null) {
    this.popupTool.closeMe(data);
  }

  // #endregion
}