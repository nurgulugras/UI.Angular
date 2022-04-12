import { Injectable, Injector } from "@angular/core";
import { SignalrHubBase } from "./signalr-hub-base.service";
import { Observable } from "rxjs";
import { NodeStatusChangesMessage } from "../../../models/hub-messages/NodeStatusChangesMessage";

@Injectable({
  providedIn: "root",
})
export class SignalrNodeStatusChangesHubService extends SignalrHubBase {
  private channelAddress: string = "node-status-changes";

  constructor(protected injector: Injector) {
    super(injector);
    this.startConnection();
  }
  private startConnection() {
    this.baseStartConnection(this.channelAddress, true);
  }
  getNodeStatusChanges(): Observable<NodeStatusChangesMessage> {
    const observable = new Observable<NodeStatusChangesMessage>((observer) => {
      this.hubConnection.on("getNodeStatusChanges", (data) => {
        return observer.next(data);
      });
    });
    return observable;
  }
}
