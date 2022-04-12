import { Component, OnInit, ViewChild } from '@angular/core';
import { VolumeListComponent } from '.';

@Component({
  selector: 'esa-volumes',
  templateUrl: './volumes.component.html',
  styleUrls: ['./volumes.component.scss']
})
export class VolumesComponent implements OnInit {

  //  #region [ Fields ]
  selectedVolume: string;
  @ViewChild(VolumeListComponent, { static: true }) volumeListComponent: VolumeListComponent

  // #endregion

  //  #region [ Initialize ]
  constructor() { }
  ngOnInit() {
  }
  // #endregion

  //  #region [ Entity ]
  // #endregion

  //  #region [ UI Tools ]

  onSelectedVolumeChanged(volume: string) {
    this.selectedVolume = volume;
  }
  onVolumeDeleted() {
    this.onSelectedVolumeChanged(null);
    this.volumeListComponent.refresh();
  }
  // #endregion

  //  #region [ Validations ]
  // #endregion

  //  #region [ Internal ]
  // #endregion
}