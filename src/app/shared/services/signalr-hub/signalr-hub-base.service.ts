import { Injectable, Injector } from '@angular/core';
import { AppConfigService } from '../../../models/internal/AppConfigService';
import { AuthToolService } from '../../AuthToolService';
import { environment } from '../../../../environments/environment';
import { AppConfig } from '../../../models/internal/Config/AppConfig';
import * as signalR from "@microsoft/signalr";  // or from "@microsoft/signalr" if you are using a new library

@Injectable({
  providedIn: 'root'
})
export class SignalrHubBase {
  protected baseUrl: string;
  protected userToken: string;
  protected appConfig: AppConfig;


  constructor(protected injector: Injector) {
    this.appConfig = this.getAppConfig();
    this.baseUrl = this.getBaseUrl();
    this.userToken = this.getUserToken();
  }
  private getAppConfig(): AppConfig {
    var appConfigService = this.injector.get(AppConfigService);
    return appConfigService.config;
  }
  private getBaseUrl(): string {
    return this.appConfig.apiEndpoint;
  }
  private getUserToken(): string {
    var authToolService = this.injector.get(AuthToolService);
    return authToolService.getToken();
  }
  protected hubConnection: signalR.HubConnection;

  protected baseStartConnection = (
    routeMap: string,
    withUserCredentials: boolean = false
  ) => {
    // const options: signalR.IHttpConnectionOptions = {
    //   transport: HttpTransportType.WebSockets
    // };
    var url = this.baseUrl + "/hubs/" + routeMap;
    if (withUserCredentials) {
      url = url + "?token=" + this.userToken;
    }
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(url)
      .configureLogging(signalR.LogLevel.None)
      .build();
    this.hubConnection.serverTimeoutInMilliseconds = this.appConfig.hubConnection.serverTimeoutInMilliseconds;

    this.hubConnectionStart(false);

    this.hubConnection.onclose(() => {
      this.hubConnectionStart(true);
    });
  };
  private hubConnectionStart(isReConnection: boolean = true) {
    if (this.hubConnection.state == signalR.HubConnectionState.Connected)
      return;
    this.hubConnection
      .start()
      .then(() => console.log("Connection started"))
      .catch(err => {
        console.log("Error while starting connection: " + err);
        if (isReConnection) {
          console.log("Will try again in 5 seconds");
          setTimeout(
            this.hubConnectionStart.bind(this),
            this.appConfig.hubConnection.reconnectionIntervalInMilliseconds
          );
        }
      });
  }
}
