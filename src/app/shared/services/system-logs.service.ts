import { Injectable, Injector } from '@angular/core';
import { BaseService } from './BaseService';
import { Observable } from 'rxjs';
import { ApiResponseParameter } from '../../models/api/ApiResponseParameter';
import { PagedResponse } from '../../models/api/PagedResponse';
import { ActivityLog } from '../../models/entity/ActivityLog';
import { SystemLogFilterParameter } from '../../models/api/SystemLogFilterParameter';

@Injectable({
  providedIn: 'root'
})
export class SystemLogsService extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }

  public getActivityLogs(systemLogFilterParameter: SystemLogFilterParameter, pageNumber: number = 0, pageSize: number = 0, orderBy: string[] = null): Observable<ApiResponseParameter<PagedResponse<ActivityLog[]>>> {
    var uri = `/v1/logs/system-logs`;
    if (pageNumber > 0 && pageSize > 0) {
      uri = uri + `?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    }
    if (orderBy && orderBy.length > 0) {
      uri = uri + `${uri.includes("?") ? '&' : '?'}orderBy=${orderBy[0]}`;
    }
    return this.postBase(uri, systemLogFilterParameter);
  }
}
