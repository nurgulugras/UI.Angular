import { HubConnection } from "./HubConnection";
import { Convertible } from "./Convertible";
export class AppConfig extends Convertible {
  production: boolean;
  name: string;
  appTitle: string;
  appTitleLong: string;
  companyTitle: string;
  apiEndpoint: string;
  appUrl: string;
  hubConnection: HubConnection;
}
