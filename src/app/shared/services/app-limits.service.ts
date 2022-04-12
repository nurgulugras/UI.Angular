import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponseParameter } from "../../models/api/ApiResponseParameter";
import { AppLimit } from "../../models/entity/AppLimit";
import { BaseService } from "./BaseService";

@Injectable({
  providedIn: "root",
})
export class AppLimitsService extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }

  public getAppLimits(
    appId: number
  ): Observable<ApiResponseParameter<AppLimit[]>> {
    var uri = `/v1/apps/${appId}/limits`;
    return this.getBase(uri);
  }
  public getActiveAppLimits(
    appId: number
  ): Observable<ApiResponseParameter<AppLimit[]>> {
    var uri = `/v1/apps/${appId}/limits/actives`;
    return this.getBase(uri);
  }
  public createAppLimit(
    appId: number,
    appLimit: AppLimit
  ): Observable<ApiResponseParameter<AppLimit>> {
    var uri = `/v1/apps/${appId}/limits`;
    return this.postBase(uri, appLimit);
  }
  public updateAppLimit(
    appId: number,
    appLimit: AppLimit
  ): Observable<ApiResponseParameter<AppLimit>> {
    var uri = `/v1/apps/${appId}/limits/` + appLimit.id;
    return this.putBase(uri, appLimit);
  }
}
