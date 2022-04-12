import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LicenceManagementComponent } from './licence-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxLoadingModule } from 'ngx-loading';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { DynamicModalModule } from '../../shared/components/dynamic-modal/dynamic-modal.module';
import { NotifyModalModule } from '../../shared/components/notify-modal/notify-modal.module';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { OrganizationListComponent, OrganizationAddOrUpdateComponent } from '../organizations/components';
import { CompaniesModule } from '../organizations/modules/companies/companies.module';
import { OrganizationsComponent } from '../organizations/organizations.component';
import { OrganizationsRoutes } from '../organizations/organizations.routing';
import { LicenceAddOrUpdateComponent, LicenceFormComponent, LicenceListComponent, LicenceListFilterPanelComponent, SessionListComponent } from './components';
import { LicenceManagementRoutes } from './licence-management.routing';

const MODULES=[
  CommonModule,
  NgxLoadingModule.forRoot({}),
  PopoverModule,
  ModalModule.forRoot(),
  NotifyModalModule,
  DynamicModalModule,
  FormsModule,
  ReactiveFormsModule,
  DirectivesModule,
  TabsModule,
  TableModule,
  CalendarModule,
  DropdownModule,
  CompaniesModule,
  CompaniesModule,
  LicenceManagementRoutes
];

const COMPONENTS =[
  LicenceListComponent,
  LicenceManagementComponent,
  LicenceListFilterPanelComponent,
  LicenceAddOrUpdateComponent,
  LicenceFormComponent,
  SessionListComponent
];

@NgModule({
  imports: MODULES,
  declarations: COMPONENTS,
})
export class LicenceManagementModule { }
