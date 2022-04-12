import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationsComponent } from './organizations.component';
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
import { ApplicationsRoutingModule } from '../applications/applications-routing.module';
import { OrganizationAddOrUpdateComponent, OrganizationListComponent } from './components';
import { CompaniesModule } from './modules/companies/companies.module';
import { OrganizationsRoutes } from './organizations.routing';

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
  OrganizationsRoutes,
  CompaniesModule
];

const COMPONENTS =[
  OrganizationsComponent,
  OrganizationListComponent,
  OrganizationAddOrUpdateComponent,
];




@NgModule({
  imports: MODULES,
  declarations: COMPONENTS,
})
export class OrganizationsModule { }
