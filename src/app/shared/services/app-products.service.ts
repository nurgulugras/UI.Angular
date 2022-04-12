import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponseParameter } from "../../models/api/ApiResponseParameter";
import { AppProduct } from "../../models/entity/AppProduct";
import { BaseService } from "./BaseService";

@Injectable({
  providedIn: "root",
})
export class AppProductsService extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }

  public getAppProducts(
    appId: number
  ): Observable<ApiResponseParameter<AppProduct[]>> {
    var uri = `/v1/apps/${appId}/products`;
    return this.getBase(uri);
  }
  public getActiveAppProducts(
    appId: number
  ): Observable<ApiResponseParameter<AppProduct[]>> {
    var uri = `/v1/apps/${appId}/products/actives`;
    return this.getBase(uri);
  }
  public createAppProduct(
    appId: number,
    appProduct: AppProduct
  ): Observable<ApiResponseParameter<AppProduct>> {
    var uri = `/v1/apps/${appId}/products`;
    return this.postBase(uri, appProduct);
  }
  public updateAppProduct(
    appId: number,
    appProduct: AppProduct
  ): Observable<ApiResponseParameter<AppProduct>> {
    var uri = `/v1/apps/${appId}/products/` + appProduct.id;
    return this.putBase(uri, appProduct);
  }
}
