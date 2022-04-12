import {
  Component,
  Input,
  OnInit,
  ViewChild,
  OnChanges,
  Injector,
  Output,
  EventEmitter,
} from "@angular/core";
import { SnapshotListComponent } from "../snapshots/snapshot-list/snapshot-list.component";
import { VolumeInfoComponent } from "../volume-info/volume-info.component";
import { SnapshotSchedulerComponent } from "../snapshots/snapshot-scheduler/snapshot-scheduler.component";
import { SimpleChanges } from "@angular/core";
import { ComponentBase } from "../../../shared/components/component-base";
import { VolumesService } from "../../../shared/services/volumes.service";
import { ResultType } from "../../../models/enums/ResultType.enum";
import { VolumeInfo } from "../../../models/entity/VolumeInfo";

@Component({
  selector: "esa-volume-overview",
  templateUrl: "./volume-overview.component.html",
  styleUrls: ["./volume-overview.component.scss"],
})
export class VolumeOverviewComponent
  extends ComponentBase
  implements OnInit, OnChanges
{
  //  #region [ Fields ]
  @ViewChild(VolumeInfoComponent, { static: false })
  volumeInfoComponent: VolumeInfoComponent;
  @ViewChild(SnapshotListComponent, { static: false })
  snapshotListComponent: SnapshotListComponent;
  @ViewChild(SnapshotSchedulerComponent, { static: false })
  snapshotSchedulerComponent: SnapshotSchedulerComponent;
  @Input() selectedVolume: string;
  @Output() onVolumeDeleted: EventEmitter<boolean> = new EventEmitter();
  volumeInfo: VolumeInfo;
  // #endregion

  //  #region [ Initialize ]
  constructor(
    public injector: Injector,
    private volumesService: VolumesService
  ) {
    super(injector);
  }
  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isValidForm()) this.getVolumeInfo();

    this.volumeInfo = new VolumeInfo();
  }
  // #endregion

  //  #region [ Entity ]
  private getVolumeInfoFromAPI(volume: string): void {
    this._isRunning = true;
    this.volumesService.getVolumeInfo(this.selectedVolume).subscribe(
      (response) => {
        this._isRunning = false;
        if (response.resultType == ResultType.Success) {
          this.volumeInfo = response.dataModel;
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        } else {
          this._notifyService.info("No volume info is available");
        }
      },
      (error) => {
        this._isRunning = false;
      }
    );
  }
  // #endregion

  //  #region [ UI Tools ]
  volumeDeleted(): void {
    this.onVolumeDeleted.emit();
  }
  refresh() {
    this.getVolumeInfo();

    if (this.snapshotListComponent) this.snapshotListComponent.refresh();
    if (this.snapshotSchedulerComponent)
      this.snapshotSchedulerComponent.refresh();
  }
  getTitle(): string {
    return this.selectedVolume ? " / " + this.selectedVolume : "";
  }
  // #endregion

  //  #region [ Validations ]
  isValidForm(): boolean {
    return this.selectedVolume && this.selectedVolume.length > 0;
  }
  // #endregion

  //  #region [ Internal ]
  getVolumeInfo() {
    this.volumeInfo = new VolumeInfo();
    if (!this.isValidForm()) {
      this._notifyService.error(
        "No volume have been selected. Select a volume before continuing."
      );
      return;
    }
    this.getVolumeInfoFromAPI(this.selectedVolume);
  }
  // #endregion
}
