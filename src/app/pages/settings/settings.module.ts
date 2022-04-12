import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxLoadingModule } from 'ngx-loading';
import { DynamicModalModule } from '../../shared/components/dynamic-modal/dynamic-modal.module';
import { NotifyModalModule } from '../../shared/components/notify-modal/notify-modal.module';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { AuthenticationSettingComponent, BasicAuthConfigurationsComponent, LdapAuthConfigurationsComponent, MailAccountSettingComponent, GeneralSettingsComponent, NodeEntityCrudComponent, NotificationSettingsComponent, MailAccountTestComponent } from './.';
import { CheckboxModule } from 'primeng/checkbox';

const MODULES = [
  CommonModule,
  SettingsRoutingModule,
  NgxLoadingModule.forRoot({}),
  DirectivesModule,
  ModalModule.forRoot(),
  NotifyModalModule,
  FormsModule,
  ReactiveFormsModule,
  // DataTableModule,
  DynamicModalModule,
  ProgressbarModule,
  PopoverModule,
  TabsModule,
  CheckboxModule
]
const COMPONENTS = [
  SettingsComponent,
  AuthenticationSettingComponent,
  BasicAuthConfigurationsComponent,
  LdapAuthConfigurationsComponent,
  MailAccountSettingComponent,
  GeneralSettingsComponent,
  NodeEntityCrudComponent,
  NotificationSettingsComponent,
  MailAccountTestComponent
]

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS]
})
export class SettingsModule { }
