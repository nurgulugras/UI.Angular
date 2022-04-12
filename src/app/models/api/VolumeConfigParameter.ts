import { OnOffType } from "../enums/OnOffType.enum";
import { Worm } from "./Worm";

export class VolumeConfigParameter {
  constructor() {
    this.worm = new Worm();
  }
  volumeName: string;
  versioning: OnOffType;
  worm: Worm;
}
