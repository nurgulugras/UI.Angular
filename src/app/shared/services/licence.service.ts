import { EventEmitter, Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseParameter } from '../../models/api/ApiResponseParameter';
import { LicenceFilterCriteriaParametters } from '../../models/api/LicenceFilterCriteriaParametters';
import { Company } from '../../models/entity/Company';
import { Licence } from '../../models/entity/Licence';
import { BaseService } from './BaseService';

@Injectable({
  providedIn: 'root'
})
export class LicenceService  extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }
  public getLicenceById(licenceId:number): Observable<ApiResponseParameter<Licence>> {
    var uri = `/v1/licenses/${licenceId}`;
    return this.getBase(uri);
  }

  public getAppLicences(appId:number): Observable<ApiResponseParameter<Licence[]>> {
    var uri = `/v1/licenses/apps/${appId}`;
    return this.getBase(uri);
  }
  public getlicencesByFilter(filter:LicenceFilterCriteriaParametters): Observable<ApiResponseParameter<Licence[]>> {
    var uri = `/v1/licenses/get-by-filter`;
    return this.postBase(uri,filter);
  }
  public getGenerateLicence(): Observable<
    ApiResponseParameter<Licence>> {
    var uri = `/v1/licenses/generate-license-key`;
    return this.getBase(uri);
  }
  public createLicence(
    licence: Licence
  ): Observable<ApiResponseParameter<Licence>> {
    var uri = `/v1/licenses`;
    return this.postBase(uri, licence);
  }
  public updateLicence(
    licence: Licence
  ): Observable<ApiResponseParameter<Licence>> {
    var uri = `/v1/licenses/` + licence.id;
    return this.putBase(uri, licence);
  }
  public registrationsLicence(
    licence: Licence
  ): Observable<ApiResponseParameter<Licence>> {
    var uri = `/v1/licenses/` + licence.id/ + 'registrations/start-workflow';
    return this.postBase(uri, licence);
  }
  onSelectedLicenceChanged: EventEmitter<Licence> = new EventEmitter();
  onLicenceDataSourceChanged:EventEmitter<any>=new EventEmitter();
  
}