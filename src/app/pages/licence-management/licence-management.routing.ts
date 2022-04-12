import { Routes, RouterModule } from '@angular/router';
import { LicenceManagementComponent } from './licence-management.component';

const routes: Routes = [
  { 
    path: "",
    component: LicenceManagementComponent,
    data: {
      title: "Lisans Yönetimi",
    },
   },
];
export const LicenceManagementRoutes = RouterModule.forChild(routes);
