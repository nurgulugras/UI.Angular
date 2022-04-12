import { EventEmitter, Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseParameter } from '../../models/api/ApiResponseParameter';
import { Organization } from '../../models/entity/Organization';
import { BaseService } from './BaseService';

@Injectable({
  providedIn: 'root'
})
export class OrganizationsService extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }
  public getOrganizationById(organizationId:number): Observable<ApiResponseParameter<Organization>> {
    var uri = `/v1/organizations/${organizationId}`;
    return this.getBase(uri);
  }

  public getOrganizations(): Observable<ApiResponseParameter<Organization[]>> {
    var uri = `/v1/organizations`;
    return this.getBase(uri);
  }
  public getActiveOrganizations(): Observable<
    ApiResponseParameter<Organization[]>
  > {
    var uri = `/v1/organizations/actives`;
    return this.getBase(uri);
  }
  public createOrganization(
    organization: Organization
  ): Observable<ApiResponseParameter<Organization>> {
    var uri = `/v1/organizations`;
    return this.postBase(uri, organization);
  }
  public updateOrganization(
    organization: Organization
  ): Observable<ApiResponseParameter<Organization>> {
    var uri = `/v1/organizations/` + organization.id;
    return this.putBase(uri, organization);
  }

  onSelectedOrganizatonChanged: EventEmitter<Organization> = new EventEmitter();
  
}

