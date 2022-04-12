import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationSettingComponent } from './authentication-setting/authentication-setting.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { MailAccountSettingComponent } from './mail-account-setting/mail-account-setting.component';
import { SettingsComponent } from './settings.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    data: {
      title: 'Settings'
    },
    children: [
      {
        path: '',
        redirectTo: 'notification',
        pathMatch: 'full'
      },
      // {
      //   path: 'settings',
      //   component: GeneralSettingsComponent,
      //   data: {
      //     title: 'Generals'
      //   }
      // },
      {
        path: 'notification',
        component: NotificationSettingsComponent,
        data: {
          title: 'Notifications'
        }
      },
      {
        path: 'auth',
        component: AuthenticationSettingComponent,
        data: {
          title: 'Auths'
        }
      },
      {
        path: 'mail',
        component: MailAccountSettingComponent,
        data: {
          title: 'Mail Account'
        }
      },

    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
