import {
  ElementRef,
  Injector,
  Input,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Sharing } from "../../../models/entity/Sharing";
import { VolumeInfo } from "../../../models/entity/VolumeInfo";
import { NotifyConfirmType } from "../../../models/enums/NotifyConfirmType.enum";
import { OnOffType } from "../../../models/enums/OnOffType.enum";
import { ResultType } from "../../../models/enums/ResultType.enum";
import { PopupTool } from "../../../models/internal/PopupTool";
import { ComponentBase } from "../../../shared/components/component-base";
import { SharesService } from "../../../shared/services/shares.service";
import { VolumesService } from "../../../shared/services/volumes.service";
import { SharingParameters } from "../../../models/parameters/SharingParameters";
import { LocalUsersService } from "../../../shared/services/local-users.service";
import { LocalUser } from "../../../models/entity/LocalUser";
import { EnumHelper } from "../../../shared/EnumHelper";
import { ShareOwnerType } from "../../../models/enums/ShareOwnerType.enum";
import { ADUser } from "../../../models/entity/ADUser";

@Component({
  selector: "esa-shared-folder-crud",
  templateUrl: "./shared-folder-crud.component.html",
  styleUrls: ["./shared-folder-crud.component.scss"],
})
export class SharedFolderCrudComponent
  extends ComponentBase
  implements OnInit, AfterViewInit
{
  //  #region [ Fields ]
  @ViewChild("windowsPreviousVersions")
  windowsPreviousVersionsInput: ElementRef;
  public parameters: SharingParameters;
  formGroup: FormGroup;
  volumes: VolumeInfo[] = [];
  sharing: Sharing;
  popupTool: PopupTool;
  isEditMode: boolean;
  ownerTypes: string[] = []; // = ["AD User", "Local User"];
  selectedOwnerType: string = ShareOwnerType.ADUser;
  localUsers: LocalUser[] = [];
  adUsers: ADUser[] = [];
  shareOwnerTypeUI = ShareOwnerType;
  isActiveADService: boolean = false;
  // #endregion

  //  #region [ Initialize ]
  constructor(
    public injector: Injector,
    private volumesService: VolumesService,
    private sharesService: SharesService,
    private localUserService: LocalUsersService,
  ) {
    super(injector);
    this.loadTypes();
    this.initModel();
    this.initFormGroup();
  }
  ngOnInit() {
    // if (!this.isEditMode)
    this.getVolumesFromAPI();
    this.getADUsersFromAPI();
    this.getLocalUsersFromAPI();
  }
  ngAfterViewInit(): void {
    this.setWindowsPreviousVersionsOfVolume(null);
  }
  // #endregion

  //  #region [ Entity ]
  private getVolumesFromAPI(): void {
    this._isRunning = true;
    this.volumesService.getVolumesWithDetails().subscribe(
      (response) => {
        this._isRunning = false;
        this.volumes = [];
        if (response.resultType == ResultType.Success) {
          this.volumes = response.dataModel;
          if (this.isEditMode) {
            var volumeInfo = this.getVolumeInfoByVolumeName(
              this.sharing.volume
            );
            this.setWindowsPreviousVersionsOfVolume(volumeInfo);
          }
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        } else {
          this._notifyService.info("No volume is available");
        }
      },
      (error) => {
        this._isRunning = false;
      }
    );
  }
  private getADUsersFromAPI(): void {
    if (!this.isActiveADService) return;
    this._isRunning = true;
    this.localUserService.getLocalUsers().subscribe(
      (response) => {
        this.adUsers = [];
        this._isRunning = false;
        if (response.resultType == ResultType.Success) {
          this.adUsers = response.dataModel;
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        }
      },
      (error) => {
        this._isRunning = false;
      }
    );
  }
  private getLocalUsersFromAPI(): void {
    this._isRunning = true;
    this.localUserService.getLocalUsers().subscribe(
      (response) => {
        this.localUsers = [];
        this._isRunning = false;
        if (response.resultType == ResultType.Success) {
          this.localUsers = response.dataModel;
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        }
      },
      (error) => {
        this._isRunning = false;
      }
    );
  }
  private createSharingFromAPI(sharing: Sharing): void {
    this._isRunning = true;
    this.sharesService.createSharing(sharing).subscribe(
      (response) => {
        this._isRunning = false;
        if (response.resultType == ResultType.Success) {
          // this.sharing = response.dataModel;
          this._notifyService.success("Share created successfully");
          this.cancelForm();
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        }
      },
      (error) => {
        this._isRunning = false;
      }
    );
  }
  private updateSharingFromAPI(sharing: Sharing): void {
    this._isRunning = true;
    this.sharesService.updateSharing(sharing).subscribe(
      (response) => {
        this._isRunning = false;
        if (response.resultType == ResultType.Success) {
          this._notifyService.success("Share updated successfully");
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        }
      },
      (error) => {
        this._isRunning = false;
      }
    );
  }
  private getVolumeInfoByVolumeName(volumeName: string): VolumeInfo {
    var volumeList = this.volumes;
    if (!volumeList) return null;
    return volumeList.find((x) => x.name == volumeName);
  }
  private getValueByNameFromLocal(volumeName: string): VolumeInfo {
    if (!this.volumes) return null;
    return this.volumes.find((x) => x.name == volumeName);
  }
  // #endregion

  //  #region [ UI Tools ]
  onSubmit() {
    this.setSharingModel();
    if (!this.isValidForm()) return;
    if (this.isEditMode) {
      var modal = this._modalService.confirmYesNo(
        "Update to Sharing",
        `Are you sure you want to update the sharing folder config?`
      );
      modal.onClosed.subscribe((replyType) => {
        if (replyType == NotifyConfirmType.Yes) {
          this.updateSharingFromAPI(this.sharing);
        }
      });
    } else {
      var modal = this._modalService.confirmYesNo(
        "Create to Share",
        `Are you sure you want to create the share folder?`
      );
      modal.onClosed.subscribe((replyType) => {
        if (replyType == NotifyConfirmType.Yes) {
          this.createSharingFromAPI(this.sharing);
        }
      });
    }
  }
  setSharingModel() {
    this.sharing = Object.assign(this.sharing, this.formGroup.value);
  }
  loadExistsSharingData(sharing: Sharing) {
    this.isEditMode = true;
    this.sharing = sharing;
    this.formGroup.patchValue(sharing);
    this.reorganizeFormGroupToEditMode();
  }
  cancelForm() {
    this.closePopup();
  }
  onChangeToVolume(e) {
    var volumeInfo = this.getValueByNameFromLocal(e.value);
    this.setWindowsPreviousVersionsOfVolume(volumeInfo);
  }
  // #endregion

  //  #region [ Validations ]
  isValidForm(showMessage: boolean = true) {
    var messageBase = "Form is not valid! Detail: ";
    if (!this.sharing) {
      if (showMessage)
        this._notifyService.error(messageBase + "Model is empty");
      return false;
    }
    if (!this.formGroup.valid) {
      if (showMessage) this._notifyService.error(messageBase + "Check form");
      return false;
    }

    return true;
  }
  // #endregion

  //  #region [ Internal ]
  initModel(): void {
    this.sharing = new Sharing();
    this.sharing.ownerType = ShareOwnerType.LocalUser;
  }
  closePopup(data: any = null) {
    this.popupTool.closeMe(data);
  }
  initFormGroup() {
    this.formGroup = new FormGroup({
      folderName: new FormControl(this.sharing.folderName, [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
      comment: new FormControl(this.sharing.comment),
      volume: new FormControl(this.sharing.volume, [Validators.required]),
      owner: new FormControl(this.sharing.owner, [Validators.required]),
      readOnly: new FormControl(this.sharing.readOnly),
      guestOk: new FormControl(this.sharing.guestOk),
      hideUnreadable: new FormControl(this.sharing.hideUnreadable),
      windowsPreviousVersions: new FormControl(
        this.sharing.windowsPreviousVersions
      ),
    });

    // this.formGroup.get('useForVersion').valueChanges.subscribe(val => {
    //   if (val) {
    //     this.formGroup.controls['snapshotName'].clearValidators();
    //   } else {
    //     this.formGroup.controls['snapshotName'].setValidators([Validators.required, this.noWhitespaceValidator]);
    //   }
    //   this.formGroup.controls['snapshotName'].updateValueAndValidity();
    // });
  }

  setWindowsPreviousVersionsOfVolume(volumeInfo: VolumeInfo): void {
    this.windowsPreviousVersionsInput.nativeElement.disabled =
      volumeInfo == null || volumeInfo == undefined
        ? true
        : volumeInfo.versioning == OnOffType.Off;
  }

  loadTypes(): void {
    if (this.isActiveADService)
      this.ownerTypes = EnumHelper.getEnumValues(ShareOwnerType);
    else this.ownerTypes = ["Local User"];
  }

  reorganizeFormGroupToEditMode() {
    this.formGroup.controls["folderName"].disable();
  }
  // #endregion
}
