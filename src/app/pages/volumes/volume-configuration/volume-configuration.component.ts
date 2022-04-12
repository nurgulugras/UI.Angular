import { EventEmitter, Injector, Output, ViewChild } from "@angular/core";
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { VolumeConfigParameter } from "../../../models/api/VolumeConfigParameter";
import { VolumeInfo } from "../../../models/entity/VolumeInfo";
import { NotifyConfirmType } from "../../../models/enums/NotifyConfirmType.enum";
import { OnOffType } from "../../../models/enums/OnOffType.enum";
import { ResultType } from "../../../models/enums/ResultType.enum";
import { VolumeInfoStatusType } from "../../../models/enums/VolumeInfoStatusType.enum";
import { ComponentBase } from "../../../shared/components/component-base";
import { VolumesService } from "../../../shared/services/volumes.service";
import * as cloneDeep from "lodash";

@Component({
  selector: "esa-volume-configuration",
  templateUrl: "./volume-configuration.component.html",
  styleUrls: ["./volume-configuration.component.scss"],
})
export class VolumeConfigurationComponent
  extends ComponentBase
  implements OnInit, OnChanges
{
  //  #region [ Fields ]
  @Input() volumeInfo: VolumeInfo = new VolumeInfo();
  @ViewChild("volumeConfig", { static: false }) volumeConfig: any;
  @ViewChild("volumeDelete", { static: false }) volumeDelete: any;
  @Output() refreshToAll: EventEmitter<any> = new EventEmitter();
  @Output() onVolumeDeleted: EventEmitter<boolean> = new EventEmitter();
  volumeConfigParameter: VolumeConfigParameter = new VolumeConfigParameter();
  public StatusType = VolumeInfoStatusType;
  public OnOffTypeUI = OnOffType;
  typingVolumeName: string;

  // formGroup: FormGroup;
  // #endregion

  //  #region [ Initialize ]
  constructor(
    public injector: Injector,
    private volumesService: VolumesService
  ) {
    super(injector);
    // this.initFormGroup();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.loadConfigParameter();
  }
  ngOnInit() {}
  // #endregion

  //  #region [ Entity ]

  private stopVolumeFromAPI(volumeName: string): void {
    this._isRunning = true;
    this.volumesService.stopVolume(volumeName).subscribe(
      (response) => {
        this._isRunning = false;
        if (response.resultType == ResultType.Success) {
          this._notifyService.success("Volume stopped");
          this.refresh();
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        }
      },
      (error) => {
        this._isRunning = false;
      }
    );
  }
  private startVolumeFromAPI(volumeName: string): void {
    this._isRunning = true;
    this.volumesService.startVolume(volumeName).subscribe(
      (response) => {
        this._isRunning = false;
        if (response.resultType == ResultType.Success) {
          this._notifyService.success("Volume started");
          this.refresh();
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        }
      },
      (error) => {
        this._isRunning = false;
      }
    );
  }
  private updateConfigurationFromAPI(
    volumeConfigParameter: VolumeConfigParameter
  ): void {
    this._isRunning = true;
    this.volumesService.updateConfiguration(volumeConfigParameter).subscribe(
      (response) => {
        this._isRunning = false;
        if (response.resultType == ResultType.Success) {
          this._notifyService.success("Volume is configured");
          this.refresh();
        } else if (response.resultType == ResultType.Fail) {
          this.loadConfigParameter();
          this._notifyService.error(response.message);
        }
      },
      (error) => {
        this._isRunning = false;
      }
    );
  }
  private deleteVolumeFromAPI(volumeName: string): void {
    this._isRunning = true;
    this.volumesService.deleteVolume(volumeName).subscribe(
      (response) => {
        this._isRunning = false;
        if (response.resultType == ResultType.Success) {
          this._notifyService.success("Volume deleted");
          this.onVolumeDeleted.emit();
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        }
      },
      (error) => {
        this._isRunning = false;
      }
    );
  }
  // #endregion

  //  #region [ UI Tools ]
  onCheckboxChange(a) {
    var isChecked = a.target.checked;
    this.volumeConfigParameter.worm.status = isChecked
      ? OnOffType.On
      : OnOffType.Off;
  }

  onCheckboxChangeToVersioning(a) {
    var isChecked = a.target.checked;
    this.volumeConfigParameter.versioning = isChecked
      ? OnOffType.On
      : OnOffType.Off;
  }

  onSubmitToDeleteVolume(): void {
    if (!this.isValidFormToDelete()) return;
    this.volumeDelete.hide();
    this.deleteVolumeFromAPI(this.volumeInfo.name);
  }
  onSubmitUI(): void {
    this.typingVolumeName = null;
    if (!this.isValidForm()) return;
    this.volumeConfig.show();
  }

  getQuestion(): string {
    return this.volumeInfo.worm.status == OnOffType.Off &&
      this.volumeConfigParameter.worm.status == OnOffType.On
      ? "<br>-This change is <strong>irreversible</strong>. <br> -Enabling this will make data inaccessible for a short period of time<br>-Snapshot restore feature will be disabled<br><br>"
      : "The volume will be configured.";
  }

  onSubmit() {
    if (!this.isValidForm()) return false;
    if (
      this.volumeInfo.worm.status == OnOffType.Off &&
      this.volumeConfigParameter.worm.status == OnOffType.On
    ) {
      if (!this.isValidFormToImmutable()) return false;
    }
    this.volumeConfig.hide();
    this.updateConfigurationFromAPI(this.volumeConfigParameter);
  }
  stopVolume(): void {
    if (!this.isValidForm()) return;
    var modal = this._modalService.confirmYesNo(
      "Stop to Volume",
      `Stopping volume will make its data inaccessible. Do you want to continue?`
    );
    modal.onClosed.subscribe((replyType) => {
      if (replyType == NotifyConfirmType.Yes) {
        this.stopVolumeFromAPI(this.volumeInfo.name);
      }
    });
  }
  startVolume(): void {
    if (!this.isValidForm()) return;
    var modal = this._modalService.confirmYesNo(
      "Start to Volume",
      `Are you sure you want to start the volume named ${this.volumeInfo.name}?`
    );
    modal.onClosed.subscribe((replyType) => {
      if (replyType == NotifyConfirmType.Yes) {
        this.startVolumeFromAPI(this.volumeInfo.name);
      }
    });
  }
  deleteVolume(): void {
    this.typingVolumeName = null;
    // if (!this.isValidForm()) return;
    this.volumeDelete.show();
  }
  // #endregion

  //  #region [ Validations ]
  // isValidForm(): boolean {
  //   return this.volumeInfo && this.volumeInfo.volumeName != undefined;
  // }

  isValidForm(showMessage: boolean = true): boolean {
    if (!this.volumeConfigParameter) return false;
    if (!this.volumeConfigParameter.volumeName) return false;
    // if (
    //   this.volumeConfigParameter.worm &&
    //   this.volumeConfigParameter.worm.begin == 0
    // ) {
    //   if (showMessage)
    //     this._notifyService.error(
    //       "Retention Period is required when selected Immutable Volume option"
    //     );
    //   return false;
    // }
    return true;
  }
  isValidFormToDelete(): boolean {
    if (!this.isValidForm()) return false;
    if (!this.volumeInfo) return false;
    if (this.typingVolumeName != this.volumeInfo.name) return false;
    return true;
  }
  isValidFormToImmutable(): boolean {
    if (!this.isValidForm()) return false;
    if (!this.volumeInfo) return false;
    if (this.typingVolumeName != this.volumeInfo.name) return false;
    return true;
  }
  // #endregion

  //  #region [ Internal ]
  refresh() {
    this.refreshToAll.emit();
  }
  loadConfigParameter(): void {
    var volumeConfigParameter = new VolumeConfigParameter();
    volumeConfigParameter.worm.status = OnOffType.Off;
    volumeConfigParameter.worm.begins = 0;
    volumeConfigParameter.worm.duration = 0;
    volumeConfigParameter.versioning = OnOffType.Off;

    if (this.volumeInfo && this.volumeInfo.name) {
      volumeConfigParameter.volumeName = this.volumeInfo.name;
      volumeConfigParameter.worm = JSON.parse(
        JSON.stringify(this.volumeInfo.worm)
      );
      volumeConfigParameter.versioning = this.volumeInfo.versioning;
    }
    this.volumeConfigParameter = volumeConfigParameter;
    // this.formGroup.patchValue(this.volumeConfigParameter);
  }
  // initFormGroup() {

  //   this.formGroup = new FormGroup({
  //     userServiceableSnaphost: new FormControl(this.volumeConfigParameter.userServiceableSnaphost),
  //     worm: new FormControl(this.volumeConfigParameter.worm),
  //     retentionPeriod: new FormControl(this.volumeConfigParameter.retentionPeriod, [Validators.minLength(1)]),
  //   });

  //   this.formGroup.get('worm').valueChanges.subscribe(val => {
  //     // debugger
  //     // if (val) {
  //     //     this.formGroup.controls['retentionPeriod'].setValidators([Validators.required, Validators.minLength(1)]);
  //     //   } else {
  //     //     this.formGroup.controls['retentionPeriod'].clearValidators();
  //     //   }
  //   });

  // }
  // #endregion
}
