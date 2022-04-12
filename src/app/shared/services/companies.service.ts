import { EventEmitter, Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseParameter } from '../../models/api/ApiResponseParameter';
import { Company } from '../../models/entity/Company';
import { BaseService } from './BaseService';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService  extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }
  public getCompanyById(companyId:number): Observable<ApiResponseParameter<Company>> {
    var uri = `/v1/companies/${companyId}`;
    return this.getBase(uri);
  }

  public getCompanies(organizationId:number): Observable<ApiResponseParameter<Company[]>> {
    var uri = `/v1/organizations/${organizationId}/companies`;
    return this.getBase(uri);
  }
  public getActiveCompaniesOfOrganization(organizationId:number): Observable<
    ApiResponseParameter<Company[]>> {
    var uri = `/v1/organizations/${organizationId}/companies/actives`;
    return this.getBase(uri);
  }
  public getActiveCompanies(): Observable<
    ApiResponseParameter<Company[]>> {
    var uri = `/v1/organizations/companies/actives`;
    return this.getBase(uri);
  }
  public createCompany(
    organizationId:number,
    company: Company
  ): Observable<ApiResponseParameter<Company>> {
    var uri = `/v1/organizations/${organizationId}/companies`;
    return this.postBase(uri, company);
  }
  public updateCompany(
    organizationId:number,
    company: Company
  ): Observable<ApiResponseParameter<Company>> {
    var uri = `/v1/organizations/${organizationId}/companies/`+company.id;
    return this.putBase(uri, company);
  }
  onSelectedCompanyChanged:EventEmitter<Company>=new EventEmitter();
    
  onCompanyDataSourceChanged:EventEmitter<any>=new EventEmitter();
  
  
}

