import { Injectable, EventEmitter } from "@angular/core";
import { AppConfig } from './Config/AppConfig';
import { EnvironmentConfigService } from '../../shared/services/environment-config.service';

@Injectable({
    providedIn: "root"
})
export class AppConfigService {
    constructor(private environmentConfigService: EnvironmentConfigService) { }

    public get appTitle() {
        return this.config.appTitle;
    }
    public get appLongTitle() {
        return this.config.appTitleLong;
    }
    public get companyTitle() {
        return this.config.companyTitle;
    }
    public get copyright() {
        return `Copyright © 2021 ${this.appTitle} | ${this.appLongTitle} `;
    }

    get apiEndPoint() {
        return this.config.apiEndpoint;
    }
    get config(): AppConfig {
        return this.environmentConfigService.getConfig();
    }
    isProduction() {
        return this.config.production;
    }
}