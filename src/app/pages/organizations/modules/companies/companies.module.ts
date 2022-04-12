import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyAddOrUpdateComponent, CompanyListComponent } from './components';
import { CompaniesComponent } from './companies.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxLoadingModule } from 'ngx-loading';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { DynamicModalModule } from '../../../../shared/components/dynamic-modal/dynamic-modal.module';
import { NotifyModalModule } from '../../../../shared/components/notify-modal/notify-modal.module';
import { DirectivesModule } from '../../../../shared/directives/directives.module';

const MODULES =[
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
];

const COMPONENTS=[
CompaniesComponent,
CompanyAddOrUpdateComponent,
CompanyListComponent
];


@NgModule({
  imports: MODULES,
  declarations: COMPONENTS,
  exports:COMPONENTS,
})
export class CompaniesModule { }
