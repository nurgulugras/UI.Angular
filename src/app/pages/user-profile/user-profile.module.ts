import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent, ChangePasswordComponent } from './.';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppAsideModule, AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule } from '@coreui/angular';
import { NotifierModule } from 'angular-notifier';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxLoadingModule } from 'ngx-loading';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AppRoutingModule } from '../../app.routing';
import { NotifierSettings } from '../../shared/notify-config';
import { DynamicModalModule } from '../../shared/components/dynamic-modal/dynamic-modal.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { NotifyModalModule } from '../../shared/components/notify-modal/notify-modal.module';

const COMPONENTS = [
  ProfileComponent,
  ChangePasswordComponent
]
const MODULES = [CommonModule,
  BrowserModule,
  BrowserAnimationsModule,
  AppRoutingModule,
  AppAsideModule,
  AppBreadcrumbModule.forRoot(),
  AppFooterModule,
  FormsModule,
  ReactiveFormsModule,
  AppHeaderModule,
  AppSidebarModule,
  PerfectScrollbarModule,
  ModalModule.forRoot(),
  HttpClientModule,
  DynamicModalModule,
  NotifierModule.withConfig(
    NotifierSettings.config
  ),
  NgxLoadingModule.forRoot({}),
  NotifyModalModule
]

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS]
})
export class UserProfileModule { }
