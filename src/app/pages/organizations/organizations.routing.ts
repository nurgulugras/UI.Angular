import { Routes, RouterModule } from '@angular/router';
import { OrganizationsComponent } from './organizations.component';

const routes: Routes = [
  { 
    path: "",
    component: OrganizationsComponent,
    data: {
      title: "Şirketler",
    },
   },
];

export const OrganizationsRoutes = RouterModule.forChild(routes);
