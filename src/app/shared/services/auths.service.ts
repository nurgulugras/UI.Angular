import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiResponseParameter } from '../../models/api/ApiResponseParameter';
import { LoginRequestModel } from '../../models/api/LoginRequestModel';
import { LoginResponseModel } from '../../models/api/LoginResponseModel';
import { User } from '../../models/entity/User';
import { ResultType } from '../../models/enums/ResultType.enum';
import { AuthToolService } from '../AuthToolService';
import { BaseService } from './BaseService';

@Injectable({
  providedIn: 'root'
})
export class AuthsService extends BaseService {
  constructor(protected injector: Injector, private authToolService: AuthToolService
    ) {
    super(injector);
  }

  public login(loginRequestModel: LoginRequestModel): Observable<ApiResponseParameter<string>> {
    var uri = '/v1/auths/login';
    return this.postBase(uri, loginRequestModel).pipe(
      tap(response => {
        var apiResponse: ApiResponseParameter<string> = response;
        if (apiResponse.resultType == ResultType.Success) {
          this.authToolService.setToken(apiResponse.dataModel);
        }
      })
    );
  }

}
