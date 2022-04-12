import { Injectable, Injector } from '@angular/core';
import { BaseService } from './BaseService';
import { Observable } from 'rxjs';
import { ApiResponseParameter } from '../../models/api/ApiResponseParameter';
import { LocalUser } from '../../models/entity/LocalUser';
import { CreationLocalUserParameter } from '../../models/parameters/CreationLocalUserParameter';
import { DeleteLocalUserParameter } from '../../models/parameters/DeleteLocalUserParameter';
import { ChangeLocalUserParameter } from '../../models/parameters/ChangeLocalUserParameter';

@Injectable({
  providedIn: 'root'
})
export class LocalUsersService extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }
  public getLocalUsers(): Observable<ApiResponseParameter<LocalUser[]>> {
    var uri = `/v1/users/local`;
    return this.getBase(uri);
  }
  public createLocalUser(user: CreationLocalUserParameter): Observable<ApiResponseParameter<LocalUser>> {
    var uri = `/v1/users/local`;
    return this.postBase(uri, user);
  }
  public deleteLocalUser(user: DeleteLocalUserParameter): Observable<ApiResponseParameter<boolean>> {
    var uri = `/v1/users/local`;
    return this.deleteBase(uri, user);
  }
  public changeLocalUserPass(user: ChangeLocalUserParameter): Observable<ApiResponseParameter<boolean>> {
    var uri = `/v1/users/local/change-password`;
    return this.patchBase(uri, user);
  }
}