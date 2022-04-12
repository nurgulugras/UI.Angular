import { Injectable, Injector } from '@angular/core';
import { BaseService } from './BaseService';
import { Observable } from 'rxjs';
import { ApiResponseParameter } from '../../models/api/ApiResponseParameter';
import { SnapshotScheduleConfig } from '../../models/entity/SnapshotScheduler/SnapshotScheduleConfig';

@Injectable({
  providedIn: 'root'
})
export class SnapshotScheduerService extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }

  public getSnapshotScheduleConfig(volume: string): Observable<ApiResponseParameter<SnapshotScheduleConfig>> {
    var uri = `/v1/cluster/volumes/snapshots/schedule/config?volume=` + volume;
    return this.getBase(uri);
  }
  public updateSnapshotScheduleConfig(volume: string, config: SnapshotScheduleConfig): Observable<ApiResponseParameter<boolean>> {
    var uri = `/v1/cluster/volumes/snapshots/schedule/config?volume=` + volume;
    return this.putBase(uri, config);
  }

}
