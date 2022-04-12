import { Injector } from "@angular/core";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponseParameter } from "../../models/api/ApiResponseParameter";
import { VolumeConfigParameter } from "../../models/api/VolumeConfigParameter";
import { VolumeStartStopParameter } from "../../models/api/VolumeStartStopParameter";
import { VolumeInfo } from "../../models/entity/VolumeInfo";
import { BaseService } from "./BaseService";
import { VolumeDeleteParameters } from "../../models/api/VolumeDeleteParameters";

@Injectable({
  providedIn: "root",
})
export class VolumesService extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }
  public getVolumes(): Observable<ApiResponseParameter<string[]>> {
    var uri = `/v1/cluster/volumes`;
    return this.getBase(uri);
  }
  public getVolumesWithDetails(): Observable<
    ApiResponseParameter<VolumeInfo[]>
  > {
    var uri = `/v1/cluster/volumes/details`;
    return this.getBase(uri);
  }
  public getVolumeInfo(
    volume: string
  ): Observable<ApiResponseParameter<VolumeInfo>> {
    var uri = `/v1/cluster/volumes/info?volume=` + volume;
    return this.getBase(uri);
  }

  public startVolume(
    volume: string
  ): Observable<ApiResponseParameter<boolean>> {
    var parameter = new VolumeStartStopParameter(volume);
    var uri = "/v1/cluster/volumes/start";
    return this.patchBase(uri, parameter);
  }
  public stopVolume(volume: string): Observable<ApiResponseParameter<boolean>> {
    var parameter = new VolumeStartStopParameter(volume);
    var uri = "/v1/cluster/volumes/stop";
    return this.patchBase(uri, parameter);
  }
  public deleteVolume(
    volume: string
  ): Observable<ApiResponseParameter<boolean>> {
    var parameter = new VolumeDeleteParameters(volume);
    var uri = "/v1/cluster/volumes";
    return this.deleteBase(uri, parameter);
  }
  public updateConfiguration(
    volumeConfigParameter: VolumeConfigParameter
  ): Observable<ApiResponseParameter<boolean>> {
    var uri = "/v1/cluster/volumes/configurations";
    return this.putBase(uri, volumeConfigParameter);
  }
}
