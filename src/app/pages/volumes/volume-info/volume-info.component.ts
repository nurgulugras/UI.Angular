import { Injector, OnChanges, SimpleChanges } from "@angular/core";
import { Component, Inject, Input, OnInit } from "@angular/core";
import * as moment from "moment";
import * as pretty from "pretty-time";
import { VolumeInfo } from "../../../models/entity/VolumeInfo";
import { OnOffType } from "../../../models/enums/OnOffType.enum";
import { VolumeInfoStatusType } from "../../../models/enums/VolumeInfoStatusType.enum";

@Component({
  selector: "esa-volume-info",
  templateUrl: "./volume-info.component.html",
  styleUrls: ["./volume-info.component.scss"],
})
export class VolumeInfoComponent implements OnInit, OnChanges {
  //  #region [ Fields ]
  // @Input() selectedVolume: string;
  @Input() volumeInfo: VolumeInfo = new VolumeInfo();
  statusTypeUI = VolumeInfoStatusType;
  onOffTypeUI = OnOffType;
  // #endregion

  //  #region [ Initialize ]
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    // if (this.isValidForm())
    //   this.getVolumeInfo();
  }
  ngOnInit() {
    this.volumeInfo = new VolumeInfo();
  }
  // #endregion

  //  #region [ Entity ]
  // private getVolumeInfoFromAPI(volume: string): void {
  //   this._isRunning = true;
  //   this.volumesService.getVolumeInfo(this.selectedVolume).subscribe(response => {
  //     this._isRunning = false;
  //     this.initModel();
  //     if (response.resultType == ResultType.Success) {
  //       this.volumeInfo = response.dataModel;
  //     } else if (response.resultType == ResultType.Fail) {
  //       this._notifyService.error(response.message);
  //     } else {
  //       this._notifyService.info("No volume info is available");
  //     }
  //   });
  // }
  // #endregion

  //  #region [ UI Tools ]

  timeFormatToAgo(second: number) {
    if (!second) return "";
    return pretty(second * 1000000000, "s");
    // return  + " - " + second;
  }
  // #endregion

  //  #region [ Validations ]

  // #endregion

  //  #region [ Internal ]
  // #endregion
}
