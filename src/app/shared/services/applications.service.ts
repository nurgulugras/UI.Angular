import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponseParameter } from "../../models/api/ApiResponseParameter";
import { Application } from "../../models/entity/Application";
import { BaseService } from "./BaseService";

@Injectable({
  providedIn: "root",
})
export class ApplicationsService extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }
  public getApplicationById(appId:number): Observable<ApiResponseParameter<Application>> {
    var uri = `/v1/apps/${appId}`;
    return this.getBase(uri);
  }

  public getApplications(): Observable<ApiResponseParameter<Application[]>> {
    var uri = `/v1/apps`;
    return this.getBase(uri);
  }
  public getActiveApplications(): Observable<
    ApiResponseParameter<Application[]>
  > {
    var uri = `/v1/apps/actives`;
    return this.getBase(uri);
  }
  public createApplication(
    application: Application
  ): Observable<ApiResponseParameter<Application>> {
    var uri = `/v1/apps`;
    return this.postBase(uri, application);
  }
  public updateApplication(
    application: Application
  ): Observable<ApiResponseParameter<Application>> {
    var uri = `/v1/apps/` + application.id;
    return this.putBase(uri, application);
  }
  
}
