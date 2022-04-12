import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseParameter } from '../../models/api/ApiResponseParameter';
import { SnapshotCreationParameter } from '../../models/api/SnapshotCreationParameter';
import { Snapshot } from '../../models/entity/Snapshot';
import { BaseService } from './BaseService';
import { SnapshotRestoreParameter } from '../../models/api/SnapshotRestoreParameter';
import { PagedResponse } from '../../models/api/PagedResponse';
import { ResultType } from '../../models/enums/ResultType.enum';
import { tap } from 'rxjs/operators';
import { SnapshotParameters } from '../../models/parameters/SnapshotParameters';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnapshotsService extends BaseService {

  private _parameterApiResponse: ApiResponseParameter<SnapshotParameters>;
  constructor(protected injector: Injector) {
    super(injector);
  }
  public getSnapshotsOfVolume(volume: string, pageNumber: number = 0, pageSize: number = 0): Observable<ApiResponseParameter<PagedResponse<Snapshot[]>>> {
    var uri = `/v1/cluster/volumes/snapshots/details?volume=` + volume;
    if (pageNumber > 0 && pageSize > 0) {
      uri = uri + `&pageNumber=${pageNumber}&pageSize=${pageSize}`;
    }
    return this.getBase(uri).pipe(
      tap(response => {
        var apiResponse: ApiResponseParameter<PagedResponse<Snapshot[]>> = response;
        if (apiResponse.resultType == ResultType.Success) {
          apiResponse.dataModel.data.sort(this.orderByDesc);
        }
      }
      ));
  }
  public createSnapshot(snapshotCreationParameter: SnapshotCreationParameter): Observable<ApiResponseParameter<boolean>> {
    var uri = `/v1/cluster/volumes/snapshots`;
    return this.postBase(uri, snapshotCreationParameter);
  }
  public deleteSnapshotByName(snapshot: string): Observable<ApiResponseParameter<boolean>> {
    var uri = `/v1/cluster/volumes/snapshots/by-name?snapshot=` + snapshot;
    return this.deleteBase(uri);
  }
  public deleteAllSnapshotsOfVolume(volume: string): Observable<ApiResponseParameter<boolean>> {
    var uri = `/v1/cluster/volumes/snapshots/by-volume?volume=` + volume;
    return this.deleteBase(uri);
  }
  public restoreSnapshot(volume: string, snapshot: string): Observable<ApiResponseParameter<boolean>> {
    var parameter = new SnapshotRestoreParameter(volume, snapshot);
    var uri = `/v1/cluster/volumes/snapshots/restore`;
    return this.postBase(uri, parameter);
  }

  public getSnapshotParameters(): Observable<ApiResponseParameter<SnapshotParameters>> {
    return this._parameterApiResponse ? of(this._parameterApiResponse) : this.getBase("/v1/cluster/volumes/snapshots/parameters").pipe(
      tap(response => {
        var apiResponse: ApiResponseParameter<SnapshotParameters> = response;
        if (apiResponse.resultType == ResultType.Success)
          this._parameterApiResponse = response;
      })
    );
  }
  orderByDesc(item1: Snapshot, item2: Snapshot) {
    return +item2.createDate - +item1.createDate;
  }

}
