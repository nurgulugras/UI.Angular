import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseParameter } from '../../models/api/ApiResponseParameter';
import { Session } from '../../models/entity/Session';
import { BaseService } from './BaseService';

@Injectable({
  providedIn: 'root'
})
export class SessionService extends BaseService {

constructor(protected injector: Injector) {
  super(injector);
}
public getSessions(licenseId:number): Observable<ApiResponseParameter<Session[]>> {
  var uri = `/v1/licenses/${licenseId}/sessions`;
  return this.getBase(uri);
}
public deleteSession(
  licenseId: number,
): Observable<ApiResponseParameter<Session>> {
  var uri = `/v1/licenses/${licenseId}/sessions/close/all`;
  return this.deleteBase(uri);
}

}
