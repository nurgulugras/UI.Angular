import { Injectable, Injector } from '@angular/core';
import { BaseService } from './BaseService';
import { AuditFilterParameter } from '../../models/api/AuditFilterParameter';
import { Observable } from 'rxjs';
import { ApiResponseParameter } from '../../models/api/ApiResponseParameter';
import { PagedResponse } from '../../models/api/PagedResponse';
import { AuditLog } from '../../models/entity/AuditLog';

@Injectable({
  providedIn: 'root'
})
export class AuditLogsService extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }

  public getAuditLogs(auditFilterParameter: AuditFilterParameter, pageNumber: number = 0, pageSize: number = 0, orderBy: string[] = null): Observable<ApiResponseParameter<PagedResponse<AuditLog[]>>> {
    var uri = `/v1/logs/audits`;
    if (pageNumber > 0 && pageSize > 0) {
      uri = uri + `?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    }
    if (orderBy && orderBy.length > 0) {
      uri = uri + `${uri.includes("?") ? '&' : '?'}orderBy=${orderBy[0]}`;
    }
    return this.postBase(uri, auditFilterParameter);
  }
  public getUsernamesToAuditLog(): Observable<ApiResponseParameter<string[]>> {
    var uri = `/v1/logs/audits/definitions/usernames`;
    return this.getBase(uri);
  }
  public getFilesToAuditLog(): Observable<ApiResponseParameter<string[]>> {
    var uri = `/v1/logs/audits/definitions/files`;
    return this.getBase(uri);
  }
  public getOperationsToAuditLog(): Observable<ApiResponseParameter<string[]>> {
    var uri = `/v1/logs/audits/definitions/operations`;
    return this.getBase(uri);
  }
}
