import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseParameter } from '../../models/api/ApiResponseParameter';
import { LoginRequestModel } from '../../models/api/LoginRequestModel';
import { UserPassChangeModel } from '../../models/api/UserPassChangeModel';
import { User} from '../../models/entity/User';
import { BaseService } from './BaseService';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }

  public getMyUser(): Observable<ApiResponseParameter<User>> {
    var uri = `/v1/users/me`;
    return this.getBase(uri);
  }

  public getUsers(): Observable<ApiResponseParameter<User[]>> {
    var uri = `/v1/users`;
    return this.getBase(uri);
  }
  public getActiveUsers(): Observable<ApiResponseParameter<User[]>> {
    var uri = `/v1/users/actives`;
    return this.getBase(uri);
  }
  public createUser(user: User): Observable<ApiResponseParameter<User>> {
    var uri = `/v1/users`;
    return this.postBase(uri, user);
  }
  public updateUser(user: User): Observable<ApiResponseParameter<boolean>> {
    var uri = `/v1/users/` + user.id;
    return this.putBase(uri, user);
  }
  public resetUserPassword(user: User): Observable<ApiResponseParameter<boolean>> {
    var uri = `/v1/users/${user.id}/generate-password`;
    return this.patchBase(uri, user);
  }
  public changeUserPassword(userPassChangeModel: UserPassChangeModel): Observable<ApiResponseParameter<boolean>> {
    var uri = `/v1/users/me/change-password`;
    return this.putBase(uri, userPassChangeModel);
  }
}
