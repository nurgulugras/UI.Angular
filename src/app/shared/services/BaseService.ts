import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injector } from "@angular/core";
import { Router, Params } from "@angular/router";
import { Observable, of } from "rxjs";
import { AppConfigService } from "../../models/internal/AppConfigService";
import { QueryableParameters } from "../../models/api/QueryableParameters";
import { AuthToolService } from "../AuthToolService";

export class BaseService {
  private readonly baseUrl: string;
  protected http: HttpClient;
  protected router: Router;
  constructor(protected injector: Injector) {
    this.http = injector.get(HttpClient);
    this.router = injector.get(Router);
    var appConfigService = injector.get(AppConfigService);
    this.baseUrl = appConfigService.apiEndPoint + "/api";
  }
  protected getBase<TEntity>(
    uriPath: string,
    isAuthroized: boolean = true,
    queryableParameters: QueryableParameters = null,
    customHeaders: HttpHeaders = null
  ): Observable<any> {
    var newUrl = this.baseUrl + uriPath;
    var httpOptions: any;

    var headers = new HttpHeaders();
    headers = headers.append("Accept", "application/json");

    if (isAuthroized) {
      headers = headers.append("Authorization", "Bearer " + this.token);
    }
    if (customHeaders) {
      var customHeaderKeys = customHeaders.keys();
      for (var i = 0; i < customHeaderKeys.length; i++) {
        var key = customHeaderKeys[i];
        var value = customHeaders.get(key);
        headers = headers.append(key, value);
      }
    }

    // if (queryableParameters) {
    //   if (queryableParameters.skip > 0)
    //     headers = headers.append("skip", queryableParameters.skip.toString());
    //   if (queryableParameters.take > 0)
    //     headers = headers.append("take", queryableParameters.take.toString());
    //   if (queryableParameters.sortMultiple && queryableParameters.sortMultiple.length > 0) {
    //     headers = headers.append("sort", queryableParameters.sortMultiple);
    //   }
    // }

    httpOptions = {
      headers: headers
    };
    return this.http.get<TEntity>(newUrl, httpOptions);
  }
  protected postBase<TEntity>(
    uriPath: string,
    parameters: any,
    isAuthroized: boolean = true,
    customHeaders: HttpHeaders = null
  ): Observable<any> {
    var newUrl = this.baseUrl + uriPath;
    var httpOptions: any;
    var headers = new HttpHeaders();
    headers = headers.append("Accept", "application/json");

    if (isAuthroized) {
      headers = headers.append("Authorization", "Bearer " + this.token);
    }
    if (customHeaders) {
      var customHeaderKeys = customHeaders.keys();
      for (var i = 0; i < customHeaderKeys.length; i++) {
        var key = customHeaderKeys[i];
        var value = customHeaders.get(key);
        headers = headers.append(key, value);
      }
    }

    httpOptions = {
      headers: headers
    };

    return this.http.post<TEntity>(newUrl, parameters, httpOptions);
  }

  protected postBaseForFileUpload(
    uriPath: string,
    parameters: any,
    isAuthroized: boolean = true
  ): Observable<any> {
    var newUrl = this.baseUrl + uriPath;
    var httpOptions: any;
    var headers = new HttpHeaders();
    headers = headers.append("Accept", "application/json");

    if (isAuthroized) {
      headers = headers.append("Authorization", "Bearer " + this.token);
    }

    httpOptions = {
      headers: headers,
      reportProgress: true,
      observe: "events"
    };

    return this.http.post(newUrl, parameters, httpOptions);
  }
  protected getBaseForFileDownload(
    uriPath: string,
    isAuthroized: boolean = true
  ): Observable<any> {
    var newUrl = this.baseUrl + uriPath;
    var httpOptions: any;
    var headers = new HttpHeaders();
    headers = headers.append("Accept", "application/json");

    if (isAuthroized) {
      headers = headers.append("Authorization", "Bearer " + this.token);
    }

    httpOptions = {
      headers: headers,
      observe: "response",
      responseType: "blob"
    };

    return this.http.get(newUrl, httpOptions);
  }
  protected postBaseForFileDownload(
    uriPath: string,
    parameters: any,
    isAuthroized: boolean = true
  ): Observable<any> {
    var newUrl = this.baseUrl + uriPath;
    var httpOptions: any;
    var headers = new HttpHeaders();
    headers = headers.append("Accept", "application/json");

    if (isAuthroized) {
      headers = headers.append("Authorization", "Bearer " + this.token);
    }

    httpOptions = {
      headers: headers,
      observe: "response",
      responseType: "blob"
    };

    return this.http.post(newUrl, parameters, httpOptions);
  }

  protected getBaseForPath(uriPath: string): string {
    return this.baseUrl + uriPath;
  }

  protected deleteBase<TEntity>(
    uriPath: string,
    parameters: any = null,
    isAuthroized: boolean = true,
    customHeaders: HttpHeaders = null
  ): Observable<any> {
    var newUrl = this.baseUrl + uriPath;
    var httpOptions: any;
    var headers = new HttpHeaders();
    headers = headers.append("Accept", "application/json");

    if (isAuthroized) {
      headers = headers.append("Authorization", "Bearer " + this.token);
    }
    if (customHeaders) {
      var customHeaderKeys = customHeaders.keys();
      for (var i = 0; i < customHeaderKeys.length; i++) {
        var key = customHeaderKeys[i];
        var value = customHeaders.get(key);
        headers = headers.append(key, value);
      }
    }

    httpOptions = {
      headers: headers,
    };

    if (parameters)
      httpOptions.body = parameters;

    return this.http.delete<TEntity>(newUrl, httpOptions);
  }
  protected putBase<TEntity>(
    uriPath: string,
    parameters: Params,
    isAuthroized: boolean = true,
    customHeaders: HttpHeaders = null
  ): Observable<any> {
    var newUrl = this.baseUrl + uriPath;
    var httpOptions: any;
    var headers = new HttpHeaders();
    headers = headers.append("Accept", "application/json");

    if (isAuthroized) {
      headers = headers.append("Authorization", "Bearer " + this.token);
    }
    if (customHeaders) {
      var customHeaderKeys = customHeaders.keys();
      for (var i = 0; i < customHeaderKeys.length; i++) {
        var key = customHeaderKeys[i];
        var value = customHeaders.get(key);
        headers = headers.append(key, value);
      }
    }

    httpOptions = {
      headers: headers
    };

    return this.http.put<TEntity>(newUrl, parameters, httpOptions);
  }
  protected patchBase<TEntity>(
    uriPath: string,
    parameters?: any,
    isAuthroized: boolean = true,
    customHeaders: HttpHeaders = null
  ): Observable<any> {
    var newUrl = this.baseUrl + uriPath;
    var httpOptions: any;
    var headers = new HttpHeaders();
    headers = headers.append("Accept", "application/json");

    if (isAuthroized) {
      headers = headers.append("Authorization", "Bearer " + this.token);
    }
    if (customHeaders) {
      var customHeaderKeys = customHeaders.keys();
      for (var i = 0; i < customHeaderKeys.length; i++) {
        var key = customHeaderKeys[i];
        var value = customHeaders.get(key);
        headers = headers.append(key, value);
      }
    }

    httpOptions = {
      headers: headers
    };

    return this.http.patch<TEntity>(newUrl, parameters, httpOptions);
  }

  protected get token() {
    return this.generateAuthToolService().getToken();
  }
  private generateAuthToolService(): AuthToolService {
    return this.injector.get(AuthToolService);
  }
}
