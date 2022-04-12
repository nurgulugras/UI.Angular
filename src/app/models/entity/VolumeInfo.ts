import { Worm } from "../api/Worm";
import { OnOffType } from "../enums/OnOffType.enum";
import { TransportType } from "../enums/TransportType.enum";
import { VolumeInfoStatusType } from "../enums/VolumeInfoStatusType.enum";

export class VolumeInfo {
  constructor() {
    this.worm = new Worm();
  }
  name: string;
  size: number;
  snapshots: number;
  status: VolumeInfoStatusType;

  // type: string;
  // volumeId: string;
  // numberOfBricks: string;
  // transportType: TransportType;
  // bricks: string[];
  versioning: OnOffType;
  worm: Worm;
}
