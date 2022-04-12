import { Injectable, Injector } from '@angular/core';
import { BaseService } from './BaseService';
import { Observable } from 'rxjs';
import { ApiResponseParameter } from '../../models/api/ApiResponseParameter';
import { NotificationSeverityConfig } from '../../models/entity/NotificationSeverityConfig';

@Injectable({
  providedIn: 'root'
})
export class NotifySettingsService extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }

  public getNotificationSeverityConfigs(): Observable<ApiResponseParameter<NotificationSeverityConfig[]>> {
    var uri = `/v1/notify-settings`;
    return this.getBase(uri);
  }
  public createNotificationSeverityConfig(notificationSeverityConfig: NotificationSeverityConfig): Observable<ApiResponseParameter<NotificationSeverityConfig>> {
    var uri = `/v1/notify-settings`;
    return this.postBase(uri, notificationSeverityConfig);
  }
  public updateNotificationSeverityConfig(notificationSeverityConfig: NotificationSeverityConfig): Observable<ApiResponseParameter<NotificationSeverityConfig>> {
    var uri = `/v1/notify-settings/` + notificationSeverityConfig.id;
    return this.putBase(uri, notificationSeverityConfig);
  }
  public deleteNotificationSeverityConfig(notificationSeverityConfig: NotificationSeverityConfig): Observable<ApiResponseParameter<boolean>> {
    var uri = `/v1/notify-settings/` + notificationSeverityConfig.id;
    return this.deleteBase(uri);
  }
}