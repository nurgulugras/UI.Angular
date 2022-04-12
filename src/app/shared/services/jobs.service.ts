import { Injectable, Injector } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { ApiResponseParameter } from '../../models/api/ApiResponseParameter';
import { Job } from '../../models/entity/Job';
import { BaseService } from './BaseService';

@Injectable({
  providedIn: 'root'
})
export class JobsService extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }

  public getJobs(): Observable<ApiResponseParameter<Job[]>> {
    var uri = `/v1/jobs`;
    return this.getBase(uri);
  }
  public pauseJob(jobUid: Guid): Observable<ApiResponseParameter<boolean>> {
    var uri = `/v1/jobs/pause?jobUid=` + jobUid.toString();
    return this.patchBase(uri);
  }
  public resumeJob(jobUid: Guid): Observable<ApiResponseParameter<boolean>> {
    var uri = `/v1/jobs/resume?jobUid=` + jobUid.toString();
    return this.patchBase(uri);
  }
}