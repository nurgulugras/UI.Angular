import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';
import { NgxLoadingModule } from 'ngx-loading';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent,
  NodeListStatusChangesComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NotifierSettings } from './shared/notify-config';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UserProfileModule } from './pages/user-profile/user-profile.module';
import { HttpConfigInterceptor } from './shared/interceptor/httpconfig.interceptor';
import { EnvironmentConfigService } from './shared/services/environment-config.service';
import { InitConfigsService } from './shared/services/init-configs.service';
import { NodeListStatusChangesComponent } from './containers/node-list-status-changes/node-list-status-changes.component';

// const environmentConfigInitializerFn = (environmentConfigService: EnvironmentConfigService) => {
//   return () => {
//     return environmentConfigService.loadConfig();
//   };
// };
const configInitializerFn = (initConfigsService: InitConfigsService) => {
  return () => {
    return initConfigsService.load();
  };
};


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    IconModule,
    ModalModule.forRoot(),
    IconSetModule.forRoot(),
    HttpClientModule,
    NotifierModule.withConfig(
      NotifierSettings.config
    ),
    NgxLoadingModule.forRoot({}),
    UserProfileModule,
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent
  ],
  providers: [
    // InitConfigsService,
    EnvironmentConfigService,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: environmentConfigInitializerFn,
    //   multi: true,
    //   deps: [EnvironmentConfigService]
    // },
    {
      provide: APP_INITIALIZER,
      useFactory: configInitializerFn,
      multi: true,
      deps: [InitConfigsService]
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true
    },
    IconSetService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
