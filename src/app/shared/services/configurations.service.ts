import { Injector } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseParameter } from '../../models/api/ApiResponseParameter';
import { AuthsConfig } from '../../models/api/AuthsConfig';
import { GlobalConfig } from '../../models/entity/GlobalConfig';
import { BaseService } from './BaseService';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }

  public testApp(): Observable<ApiResponseParameter<boolean>> {
    var uri = `/v1/configurations/general/service/test`;
    return this.getBase(uri);
  }

  public getAuthsConfigs(): Observable<ApiResponseParameter<AuthsConfig>> {
    var uri = `/v1/configurations/auths`;
    return this.getBase(uri);
  }
  public saveOrUpdateAuthConfig(authsConfig: AuthsConfig): Observable<ApiResponseParameter<AuthsConfig>> {
    var uri = `/v1/configurations/auths`;
    return this.postBase(uri, authsConfig);
  }
  public getGlobalConfigs(): Observable<ApiResponseParameter<GlobalConfig>> {
    var uri = `/v1/configurations/global`;
    return this.getBase(uri);
  }
  public saveOrUpdateGlobalConfig(globalConfig: GlobalConfig): Observable<ApiResponseParameter<GlobalConfig>> {
    var uri = `/v1/configurations/global`;
    return this.postBase(uri, globalConfig);
  }
}