import { Injectable } from "@angular/core";
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthToolService } from '../AuthToolService';
import { ApiResponseParameter } from '../../models/api/ApiResponseParameter';
import { NotifyService } from '../services/notify.service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    iso8601 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/;

    constructor(
        private router: Router,
        private authToolService: AuthToolService,
        private notifyService: NotifyService
    ) { }
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                // if (event instanceof HttpResponse) {
                //   const body = event.body;
                //   this.convertToDate(body);
                // }
                if (event instanceof HttpResponse) {
                    var responseParameter = event.body as ApiResponseParameter<any>;
                    if (responseParameter) {
                        if (event.body) {
                            const body = event.body;
                            this.convertToDate(body);
                        }

                        if (responseParameter.httpStatusCode == 401) {
                            //alert("Yetki hatası! Yeniden giriş yapmanız gerekiyor.");
                            // this.authService.login();
                            //this.router.navigate(["/auth/logout"]);
                        }
                    }
                    //   console.log("event--->>>", event);
                    // this.errorDialogService.openDialog(event);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                // console.log(error);
                if (error.status == 401) {
                    this.notifyService.error("Unauthorized session! Please try to login.");
                    this.authToolService.logout();
                    // this.authToolService.logoutAllFromLocal();
                    // this.notifyService.notifyError(
                    //     "Oturum",
                    //     "Oturum hatalı. Lütfen oturum açınız."
                    // );
                    // this.router.navigate(["/auth/login"]);
                    return;
                    // alert("Yetki hatası! Yeniden giriş yapmanız gerekiyor.");
                    // this.authService.login();
                }
                if (error.status == 0) {
                    this.notifyService.error("API service is not reachable.");
                    return;
                    //   return throwError(
                    //     new HttpErrorModel(error.status, "Servise erişilemiyor!", true)
                    //   );
                }
                // if (error.status == 403) {
                //   this.authService.localLogout();
                //   this.notifyService.notifyError("Yetki hatası! Lütfen giriş yapınız.");
                //   this.router.navigate(["/auth/login"]);
                //   return throwError(new HttpErrorModel(error.status, null, true));
                // }
                // if (error.status == 200 && error.error.text == "User unauthorized!") {
                //   this.authService.localLogout();
                //   this.notifyService.notifyError("Yetki hatası! Lütfen giriş yapınız.");
                //   this.router.navigate(["/auth/login"]);
                //   return throwError(new HttpErrorModel(error.status, null, true));
                // }

                // if (
                //   error.status == 200 &&
                //   error.error.text == "This session is locked!"
                // ) {
                //   this.authService.localLock();
                //   var currentUrl = this.router.url;
                //   this.notifyService.notifyError(
                //     "Oturumunuz kilitli. Lütfen giriş yapınız."
                //   );
                //   this.router.navigate(["/auth/lock", currentUrl]);
                //   return throwError(new HttpErrorModel(error.status, null, true));
                // }
                // if (
                //   error.status == 500 &&
                //   error.error.text == "Veritabanı bağlantı hatası!"
                // ) {
                //   this.notifyService.notifyError(error.error);
                //   return;
                // }
                // debugger;
                // if ((error.error.text as string).startsWith("Veritabanı bağlantı hatası!")) {
                //   this.notifyService.notifyError(error.error.text);
                //   return throwError(new HttpErrorModel(error.status, null, true));
                // }
                return throwError(error);
            })
        );
    }
    convertToDate(body) {
        if (body === null || body === undefined) {
            return body;
        }
        if (typeof body !== "object") {
            return body;
        }
        for (const key of Object.keys(body)) {
            const value = body[key];
            if (this.isIso8601(value)) {
                body[key] = new Date(value);
            } else if (typeof value === "object") {
                this.convertToDate(value);
            }
        }
    }
    isIso8601(value) {
        if (value === null || value === undefined) {
            return false;
        }

        return this.iso8601.test(value);
    }
}
