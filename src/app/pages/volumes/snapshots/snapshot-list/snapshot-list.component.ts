import {
  Injector,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { Snapshot } from "../../../../models/entity/Snapshot";
import { ResultType } from "../../../../models/enums/ResultType.enum";
import { ComponentBase } from "../../../../shared/components/component-base";
import { SnapshotsService } from "../../../../shared/services/snapshots.service";
import { NotifyConfirmType } from "../../../../models/enums/NotifyConfirmType.enum";
import { LanguageKeys } from "../../../../models/internal/language-keys";
import { DynamicModalService } from "../../../../shared/services/dynamic-modal.service";
import { SnapshotCreateComponent } from "../snapshot-create/snapshot-create.component";
import { LazyLoadEvent } from "primeng/api";
import { VolumeInfo } from "../../../../models/entity/VolumeInfo";
import { OnOffType } from "../../../../models/enums/OnOffType.enum";
import { ExporterOptions } from "../../../../models/internal/exporter-options";
import { ExportPropertyInfo } from "../../../../models/internal/ExportPropertyInfo";

@Component({
  selector: "esa-snapshot-list",
  templateUrl: "./snapshot-list.component.html",
  styleUrls: ["./snapshot-list.component.scss"],
})
export class SnapshotListComponent
  extends ComponentBase
  implements OnInit, OnChanges
{
  //  #region [ Fields ]
  @Input() selectedVolume: string;
  @Input() volumeInfo: VolumeInfo = new VolumeInfo();
  snapshots: Snapshot[] = [];
  @Output() refreshToAll: EventEmitter<any> = new EventEmitter();
  listType: string[] = [];
  isLoadedEntities: boolean;
  loading: boolean;
  rows: number = 5;
  totalRecords: number;

  // #endregion

  //  #region [ Initialize ]
  constructor(
    public injector: Injector,
    private snapshotsService: SnapshotsService,
    private dynamicModalService: DynamicModalService
  ) {
    super(injector);
  }
  ngOnInit() {}
  ngOnChanges(): void {
    this.isLoadedEntities = false;
    // if (this.isValidForm() && this.isLoadedEntities)
    //   this.getSnapshotsOfVolume();
  }
  // #endregion

  //  #region [ Entity ]
  private getSnapshotsOfVolumeFromAPI(
    volume: string,
    pageNumber: number = 0,
    pageSize: number = 0
  ): void {
    this._isRunning = true;
    this.snapshotsService
      .getSnapshotsOfVolume(volume, pageNumber, pageSize)
      .subscribe(
        (response) => {
          this._isRunning = false;
          this.loading = false;
          this.snapshots = [];
          if (response.resultType == ResultType.Success) {
            this.snapshots = response.dataModel.data;
            this.totalRecords = response.dataModel.totalRecords;
          } else if (response.resultType == ResultType.Fail) {
            this._notifyService.error(response.message);
          } else {
            this._notifyService.info("No snapshot is available");
          }
        },
        (error) => {
          this._isRunning = false;
        }
      );
  }
  private deleteSnapshotByNameFromAPI(snapshotName: string) {
    this._isRunning = true;
    this.snapshotsService.deleteSnapshotByName(snapshotName).subscribe(
      (response) => {
        this._isRunning = false;
        if (response.resultType == ResultType.Success) {
          this._notifyService.success(LanguageKeys.ROW_DELETED);
          this.refreshAll();
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        } else {
          this._notifyService.info("No snapshot is available");
        }
      },
      (error) => {
        this._isRunning = false;
      }
    );
  }
  private deleteAllSnapshotOfVolumeFromAPI(volume: string) {
    this._isRunning = true;
    this.snapshotsService.deleteAllSnapshotsOfVolume(volume).subscribe(
      (response) => {
        this._isRunning = false;
        if (response.resultType == ResultType.Success) {
          this._notifyService.success(LanguageKeys.ROW_DELETED);
          this.refreshAll();
        } else {
          this._notifyService.error(response.message);
        }
      },
      (error) => {
        this._isRunning = false;
      }
    );
  }

  private restoreSnapshotByNameFromAPI(
    volumeName: string,
    snapshotName: string
  ) {
    this._isRunning = true;
    this.snapshotsService.restoreSnapshot(volumeName, snapshotName).subscribe(
      (response) => {
        this._isRunning = false;
        if (response.resultType == ResultType.Success) {
          this._notifyService.success(LanguageKeys.ROW_UPDATED);
          this.refreshAll();
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
  exportToExcel() {
    if (this.snapshots && this.snapshots.length > 0) {
      var opt = new ExporterOptions();
      opt.fileName = `${this.volumeInfo.name}-snpashot-list`;
      opt.headers = [
        new ExportPropertyInfo("createDate", "Create Date"),
        new ExportPropertyInfo("createUserName", "Create User"),
        new ExportPropertyInfo("volume", "Volume"),
        new ExportPropertyInfo("name", "Name"),
        new ExportPropertyInfo("description", "Description"),
        new ExportPropertyInfo("useForVersion", "Use For Version"),
        new ExportPropertyInfo("isSchedule", "Is Schedule"),
      ];
      opt.isAutoColumn = true;
      opt.skipHeader = false;
      this._exporterService.exportToExcelFromJson(this.snapshots, opt);
    }
  }
  isUseForVersion(snapshot: Snapshot): boolean {
    return snapshot.useForVersion && snapshot.useForVersion == true;
  }

  deleteAllSnapshotsOfVolume() {
    if (!this.isValidForm()) {
      this._notifyService.error(
        "No volume have been selected. Select a volume before continuing."
      );
      return;
    }
    var modal = this._modalService.confirmYesNo(
      "Delete to Snapshots",
      `Are you sure you want to <strong>delete all snapshots of volume</strong>?`
    );
    modal.onClosed.subscribe((replyType) => {
      if (replyType == NotifyConfirmType.Yes) {
        this.deleteAllSnapshotOfVolumeFromAPI(this.selectedVolume);
      }
    });
  }
  deleteSnapshot(snapshot: Snapshot) {
    var modal = this._modalService.confirmYesNo(
      "Delete to Snapshot",
      `Are you sure you want to delete the snapshot named <strong>${snapshot.name}</strong>?`
    );
    modal.onClosed.subscribe((replyType) => {
      if (replyType == NotifyConfirmType.Yes) {
        this.deleteSnapshotByNameFromAPI(snapshot.name);
      }
    });
  }
  restoreSnapshot(snapshot: Snapshot) {
    if (this.isImmutableVolume()) {
      this._notifyService.error(
        "Snapshot cannot be restored while volume is immutable"
      );
      return;
    }
    var modal = this._modalService.confirmYesNo(
      "Restore to Snapshot",
      `Are you sure you want to restore the snapshot named <strong>${snapshot.name}</strong>?`
    );
    modal.onClosed.subscribe((replyType) => {
      if (replyType == NotifyConfirmType.Yes) {
        this.restoreSnapshotByNameFromAPI(this.selectedVolume, snapshot.name);
      }
    });
  }
  createSnapshot() {
    if (!this.isValidForm()) {
      this._notifyService.error(
        "No volume have been selected. Select a volume before continuing."
      );
      return;
    }

    const popup = this.dynamicModalService.open<SnapshotCreateComponent>(
      SnapshotCreateComponent,
      null,
      false,
      true,
      true
    );
    popup.instance.volume = this.selectedVolume;
    popup.onClosed().subscribe((response) => {
      if (response) this.refreshAll();
    });
  }
  refresh() {
    this.getSnapshotsOfVolume();
  }
  refreshAll() {
    this.refreshToAll.emit();
  }

  loadEntities() {
    this.isLoadedEntities = true;
    this.refresh();
  }
  // #endregion

  //  #region [ Validations ]
  public isImmutableVolume(): boolean {
    return (
      this.volumeInfo &&
      this.volumeInfo.worm &&
      this.volumeInfo.worm.status == OnOffType.On
    );
  }
  private isValidForm(): boolean {
    return this.selectedVolume && this.selectedVolume.length > 0;
  }
  // #endregionSnapshot Count

  //  #region [ Internal ]
  loadCustomers(event: LazyLoadEvent) {
    this.loading = true;
    var pageSize: number = event.rows;
    var pageNumber = event.first == 0 ? 1 : event.first / event.rows + 1;

    this.loadSnapshotList(pageNumber, pageSize);

    // //imitate db connection over a network
    // setTimeout(() => {

    //   // if (this.datasource) {
    //   //   this.customers = this.datasource.slice(
    //   //     event.first,
    //   //     event.first + event.rows
    //   //   );
    //   //   this.loading = false;
    //   // }
    // }, 1000);
  }
  getSnapshotsOfVolume() {
    if (!this.isLoadedEntities) return;
    if (!this.isValidForm()) {
      this._notifyService.error(
        "No volume have been selected. Select a volume before continuing."
      );
      return;
    }
    this.loadSnapshotList(1, this.rows);
  }
  loadSnapshotList(pageNumber: number, pageSize: number) {
    this.getSnapshotsOfVolumeFromAPI(this.selectedVolume);
  }
  loadDaysOfWeek() {
    if (!this.listType) this.listType = [];
    this.listType.push("All");
    this.listType.push("Manuels");
    this.listType.push("Schedules");
  }
  // #endregion
}
