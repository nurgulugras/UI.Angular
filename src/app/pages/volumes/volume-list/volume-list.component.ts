import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { ResultType } from '../../../models/enums/ResultType.enum';
import { ComponentBase } from '../../../shared/components/component-base';
import { VolumesService } from '../../../shared/services/volumes.service';

@Component({
  selector: 'esa-volume-list',
  templateUrl: './volume-list.component.html',
  styleUrls: ['./volume-list.component.scss']
})
export class VolumeListComponent extends ComponentBase implements OnInit {

  //  #region [ Fields ]
  volumes: string[];
  @Output() onSelectedVolumeChanged: EventEmitter<string> = new EventEmitter();
  selectedVolume: string;
  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector, private volumesService: VolumesService) {
    super(injector)
  }
  ngOnInit() {
    this.getVolumes();
  }
  // #endregion

  //  #region [ Entity ]
  private getVolumesFromAPI(): void {
    this._isRunning = true;
    this.volumesService.getVolumes().subscribe(response => {
      this._isRunning = false;
      this.volumes = [];
      if (response.resultType == ResultType.Success) {
        this.volumes = response.dataModel;
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      } else {
        this._notifyService.info("No volume is available");
      }
    }, error => {
      this._isRunning = false;
    });
  }
  // #endregion

  //  #region [ UI Tools ]
  selectedVolumeChanged(volume: string) {
    this.selectedVolume = volume;
    this.onSelectedVolumeChanged.emit(volume);
  }
  refresh() {
    this.getVolumes();
  }
  // #endregion

  //  #region [ Validations ]
  // #endregion

  //  #region [ Internal ]
  getVolumes() {
    this.getVolumesFromAPI();
  }
  // #endregion
}
