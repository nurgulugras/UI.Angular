import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseParameter } from '../../models/api/ApiResponseParameter';
import { EventLog } from '../../models/entity/EventLog';
import { BaseService } from './BaseService';

@Injectable({
  providedIn: 'root'
})
export class EventLogsService extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }
  public getEventLogs(): Observable<ApiResponseParameter<EventLog[]>> {
    var uri = `/v1/event-logs`;
    return this.getBase(uri);
  }
}
