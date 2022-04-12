import { Injectable } from "@angular/core";
import { JWTClient } from "../models/internal/JWTClient";
import { LoggedInUser } from "../models/internal/LoggedInUser";
import { Cryptography } from "./Cryptography";
import { GlobalFields } from "./GlobalFields";
import { JwtDecoder } from "./JwtDecoder";
import { ObjectConverter } from "./ObjectConverter";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthToolService {
  private _loggedInUser: LoggedInUser;
  constructor(private router: Router) {}
  public isLoggedIn(): boolean {
    return this.getToken() != null;
  }

  public getCurrentUser(): LoggedInUser {
    var user =
      this._loggedInUser == null ? this.getLoggedInUser() : this._loggedInUser;
    return user;
  }

  public setToken(token: string): void {
    var encodedUserData = Cryptography.Encode(token);
    localStorage.setItem(GlobalFields.LOGGEDIN_USER_TOKEN, encodedUserData);
  }
  public getToken(): string {
    var encodedUser = localStorage.getItem(GlobalFields.LOGGEDIN_USER_TOKEN);
    return encodedUser == null
      ? null
      : Cryptography.Decode<string>(encodedUser);
  }

  public logout(isDirectToLogin: boolean = true) {
    localStorage.removeItem(GlobalFields.LOGGEDIN_USER_TOKEN);
    if (isDirectToLogin) this.router.navigate(["/auths/login"]);
  }
  public logoutAndDirectionToLogin() {
    localStorage.removeItem(GlobalFields.LOGGEDIN_USER_TOKEN);
  }

  private getLoggedInUser(): LoggedInUser {
    var token = this.getToken();
    if (!token) return null;
    var decodedToken = JwtDecoder.decode(token);

    var jwtUserData =
      decodedToken[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata"
      ];
    var jwtUserDataObject = JSON.parse(jwtUserData);
    var jwtUser: JWTClient = ObjectConverter.cast<string, JWTClient>(
      jwtUserDataObject,
      JWTClient
    );
    this._loggedInUser = this.getLoggedInUserFromJwtToken(jwtUser);
    return this._loggedInUser;
  }

  private getLoggedInUserFromJwtToken(jwtToken: JWTClient): LoggedInUser {
    var loggedInUser = new LoggedInUser();
    loggedInUser.username = jwtToken.userClient.nu;
    loggedInUser.role = jwtToken.userClient.tu;
    return loggedInUser;
  }
}
