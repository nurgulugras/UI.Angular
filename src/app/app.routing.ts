import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Import Containers
import { DefaultLayoutComponent } from "./containers";
import { ProfileComponent } from "./pages/user-profile/profile/profile.component";
import { AuthGuardService } from "./shared/guards/auth-guard.service";

import { P404Component } from "./views/error/404.component";
import { P500Component } from "./views/error/500.component";
import { RegisterComponent } from "./views/register/register.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "404",
    component: P404Component,
    data: {
      title: "Page 404",
    },
  },
  {
    path: "500",
    component: P500Component,
    data: {
      title: "Page 500",
    },
  },
  // {
  //   path: 'login',
  //   component: LoginComponent,
  //   data: {
  //     title: 'Login Page'
  //   }
  // },
  {
    path: "register",
    component: RegisterComponent,
    data: {
      title: "Register Page",
    },
  },
  {
    path: "auths",
    loadChildren: () =>
      import("./auths/auths.module").then((m) => m.AuthsModule),
  },
  {
    path: "",
    component: DefaultLayoutComponent,
    data: {
      title: "Home",
    },
    // canActivate: [AuthGuardService],
    children: [
      {
        path: "base",
        loadChildren: () =>
          import("./views/base/base.module").then((m) => m.BaseModule),
      },
      {
        path: "buttons",
        loadChildren: () =>
          import("./views/buttons/buttons.module").then((m) => m.ButtonsModule),
      },
      {
        path: "applications",
        loadChildren: () =>
          import("./pages/applications/applications.module").then(
            (m) => m.ApplicationsModule
          ),
      },
      {
        path: "organizations",
        loadChildren: () =>
          import("./pages/organizations/organizations.module").then(
            (m) => m.OrganizationsModule
          ),
      },
      {
        path: "licences",
        loadChildren: () =>
          import("./pages/licence-management/licence-management.module").then(
            (m) => m.LicenceManagementModule
          ),
      },
      {
        path: "charts",
        loadChildren: () =>
          import("./views/chartjs/chartjs.module").then((m) => m.ChartJSModule),
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./views/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: "icons",
        loadChildren: () =>
          import("./views/icons/icons.module").then((m) => m.IconsModule),
      },
      {
        path: "notifications",
        loadChildren: () =>
          import("./views/notifications/notifications.module").then(
            (m) => m.NotificationsModule
          ),
      },
      {
        path: "theme",
        loadChildren: () =>
          import("./views/theme/theme.module").then((m) => m.ThemeModule),
      },
      {
        path: "widgets",
        loadChildren: () =>
          import("./views/widgets/widgets.module").then((m) => m.WidgetsModule),
      },
      {
        path: "nodes",
        loadChildren: () =>
          import("./pages/nodes/nodes.module").then((m) => m.NodesModule),
      },
      {
        path: "volumes",
        loadChildren: () =>
          import("./pages/volumes/volumes.module").then((m) => m.VolumesModule),
      },
      {
        path: "shares",
        loadChildren: () =>
          import("./pages/shared-folders/shared-folders.module").then(
            (m) => m.SharedFoldersModule
          ),
      },
      {
        path: "users",
        loadChildren: () =>
          import("./pages/users/users.module").then((m) => m.UsersModule),
      },
      {
        path: "settings",
        loadChildren: () =>
          import("./pages/settings/settings.module").then(
            (m) => m.SettingsModule
          ),
      },
      {
        path: "user/profile",
        component: ProfileComponent,
        data: {
          title: "Profile",
        },
      },
      {
        path: "jobs",
        loadChildren: () =>
          import("./pages/jobs/jobs.module").then((m) => m.JobsModule),
      },
      {
        path: "event-logs",
        loadChildren: () =>
          import("./pages/event-logs/event-logs.module").then(
            (m) => m.EventLogsModule
          ),
      },
      {
        path: "audit-logs",
        loadChildren: () =>
          import("./pages/audit-logs/audit-logs.module").then(
            (m) => m.AuditLogsModule
          ),
      },
      {
        path: "system-logs",
        loadChildren: () =>
          import("./pages/system-logs/system-logs.module").then(
            (m) => m.SystemLogsModule
          ),
      },
    ],
  },
  { path: "**", component: P404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
