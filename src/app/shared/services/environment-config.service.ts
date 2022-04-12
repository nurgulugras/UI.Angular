import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../models/internal/Config/AppConfig';
import { environment } from '../../../environments/environment';
import { Observable, empty, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import 'rxjs/add/observable/throw';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentConfigService {
  private _configFileFolder: string = "/assets/environments/";
  private config: AppConfig = null;
  constructor(private http: HttpClient) { }

  public getConfig(): AppConfig {
    return this.config;
  }

  public loadConfig() {
    let environmentFile = this._configFileFolder + "env." + environment.name + '.json';
    return this.getEnvironmentFile(environmentFile)
      .pipe(
        catchError(err => {
          var message = err.status && err.status == 404 ? `Config file not found: ${environmentFile}` : err.message;
          return Observable.throw(message);
        })
      );
  }
  private getEnvironmentFile(environmentFile: string): Observable<any> {
    return this.http.get(environmentFile)
      .pipe(
        map((response) => {
          if (response == null) {
            console.error('Error reading ' + environmentFile + ' configuration file');
            return;
          }
          this.config = new AppConfig();
          this.config.convert(response);
        })
      );
  }
}