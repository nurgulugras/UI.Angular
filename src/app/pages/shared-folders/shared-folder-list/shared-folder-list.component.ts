import { Component, Injector, OnInit, ViewChild } from "@angular/core";
import { Sharing } from "../../../models/entity/Sharing";
import { NotifyConfirmType } from "../../../models/enums/NotifyConfirmType.enum";
import { ResultType } from "../../../models/enums/ResultType.enum";
import { ComponentBase } from "../../../shared/components/component-base";
import { DynamicModalService } from "../../../shared/services/dynamic-modal.service";
import { SharesService } from "../../../shared/services/shares.service";
import { SharedFolderCrudComponent } from "../shared-folder-crud/shared-folder-crud.component";
import { DeleteSharingParameter } from "../../../models/api/DeleteSharingParameter";
import { SharingParameters } from "../../../models/parameters/SharingParameters";
import { FileBrowserComponent } from "../file-browser/file-browser.component";
import { ExporterOptions } from "../../../models/internal/exporter-options";
import { ExportPropertyInfo } from "../../../models/internal/ExportPropertyInfo";
import { VolumesService } from "../../../shared/services/volumes.service";

@Component({
  selector: "esa-shared-folder-list",
  templateUrl: "./shared-folder-list.component.html",
  styleUrls: ["./shared-folder-list.component.scss"],
})
export class SharedFolderListComponent extends ComponentBase implements OnInit {
  //  #region [ Fields ]
  @ViewChild("myModal", { static: false }) myModal: any;
  sharingList: Sharing[] = [];
  // selectedSharing: Sharing;
  typingSharingName: string;
  isDeletePhysicalFolder: boolean;
  deleteSharingParameter: DeleteSharingParameter;
  parameters: SharingParameters;

  html: string;

  // #endregion

  //  #region [ Initialize ]
  constructor(
    public injector: Injector,
    private dynamicModalService: DynamicModalService,
    private sharesService: SharesService,
    private volumesService: VolumesService
  ) {
    super(injector);
  }
  ngOnInit() {
    this.getSharingList();
    this.getSharingParametersFromAPI();
  }
  // #endregion

  //  #region [ Entity ]
  getSharingListFromAPI() {
    this._isRunning = true;
    this.sharesService.getSharingList().subscribe(
      (response) => {
        this.sharingList = [];
        this._isRunning = false;
        if (response.resultType == ResultType.Success) {
          this.sharingList = response.dataModel;
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        }
      },
      (error) => {
        this._isRunning = false;
      }
    );
  }
  getSharingParametersFromAPI() {
    this._isRunning = true;
    this.sharesService.getSharingParameters().subscribe(
      (response) => {
        this._isRunning = false;
        if (response.resultType == ResultType.Success) {
          this.parameters = response.dataModel;
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(
            "Error on Share parameters: " + response.message
          );
        }
      },
      (error) => {
        this._isRunning = false;
      }
    );
  }

  deleteSharingFromAPI(deleteSharingParameter: DeleteSharingParameter) {
    this._isRunning = true;
    this.sharesService.deleteSharing(deleteSharingParameter).subscribe(
      (response) => {
        this.sharingList = [];
        this._isRunning = false;
        if (response.resultType == ResultType.Success) {
          this._notifyService.success("Share deleted successfully");
          this.closeModal();
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        }
        this.refresh();
      },
      (error) => {
        this._isRunning = false;
      }
    );
  }

  // #endregion

  //  #region [ UI Tools ]

  exportToExcel() {
    if (this.sharingList && this.sharingList.length > 0) {
      var opt = new ExporterOptions();
      opt.fileName = "share-list";
      opt.headers = [
        new ExportPropertyInfo("volume", "Volume"),
        new ExportPropertyInfo("folderName", "Share Name"),
        new ExportPropertyInfo("comment", "Comment"),
        new ExportPropertyInfo(
          "windowsPreviousVersions",
          "Windows Previous Versions"
        ),
        new ExportPropertyInfo("hideUnreadable", "Hide Unreadable Objects"),
        new ExportPropertyInfo("guestOk", "Allow Guest"),
        new ExportPropertyInfo("readOnly", "Readonly"),
      ];
      opt.isAutoColumn = true;
      opt.skipHeader = false;
      this._exporterService.exportToExcelFromJson(this.sharingList, opt);
    }
  }
  onSubmitToDeleteSharing() {
    if (!this.isValidDeleteSharingParameter()) return;
    this.deleteSharingFromAPI(this.deleteSharingParameter);
  }
  onChangeToIsDeletePhysicalFolder(isSelected: boolean) {
    if (isSelected) {
      var modal = this._modalService.confirmYesNo(
        "Confirm to Delete Folder",
        "<br>If you choose this option, the folder it is linked to will be permanently deleted. <br><br> <strong> Are you sure you want to do this?<strong><br>"
      );
      modal.onClosed.subscribe((replyType) => {
        if (replyType != NotifyConfirmType.Yes) {
          this.deleteSharingParameter.isDeletePhysicalFolder = false;
          this._notifyService.info("Selection canceled");
        }
      });
    }
  }
  deleteSharing(sharing: Sharing) {
    this.typingSharingName = null;

    var deleteSharingParameter = new DeleteSharingParameter();
    deleteSharingParameter.folderName = sharing.folderName;
    deleteSharingParameter.volume = sharing.volume;

    this.deleteSharingParameter = deleteSharingParameter;

    this.openModal();
  }
  editSharing(sharing: Sharing) {
    this.openSharedFolderCrudComponent(sharing);
  }
  getSharingList() {
    this.getSharingListFromAPI();
  }
  refresh() {
    this.getSharingList();
  }
  createNewSharedFolder() {
    this.openSharedFolderCrudComponent();
  }

  openSharedFolderCrudComponent(sharing: Sharing = null) {
    const popup = this.dynamicModalService.open<SharedFolderCrudComponent>(
      SharedFolderCrudComponent,
      null,
      false,
      true,
      true
    );
    if (sharing) popup.instance.loadExistsSharingData(sharing);
    popup.instance.parameters = this.parameters;
    popup.onClosed().subscribe((response) => {
      this.refresh();
    });
  }
  openFileBrowser(sharing: Sharing = null) {
    const popup = this.dynamicModalService.open<FileBrowserComponent>(
      FileBrowserComponent,
      `File Browser | ${sharing.folderName}`,
      true,
      true,
      true
    );
    popup.instance.loadExistsSharingData(sharing);
  }

  closeModal(): void {
    this.myModal.hide();
    this.deleteSharingParameter = null;
  }
  openModal(): void {
    // this.myModal.config.ignoreBackdropClick = true
    this.myModal.show();
  }
  // #endregion

  //  #region [ Validations ]
  isValidDeleteSharingParameter(): boolean {
    if (!this.deleteSharingParameter) return false;
    if (!this.deleteSharingParameter.folderName) return false;
    if (!this.deleteSharingParameter.volume) return false;
    if (this.deleteSharingParameter.folderName != this.typingSharingName)
      return false;
    return true;
  }
  // #endregion

  //  #region [ Internal ]

  // #endregion
}
