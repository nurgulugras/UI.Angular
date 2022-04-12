import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { NgxLoadingModule } from 'ngx-loading';
import { TableModule } from 'primeng/table';
import { DynamicModalModule } from '../../shared/components/dynamic-modal/dynamic-modal.module';
import { NotifyModalModule } from '../../shared/components/notify-modal/notify-modal.module';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { AuditRoutingModule } from './audit-routing.module';
import { AuditLogsComponent } from './audit-logs.component';
import { AuditLogListFilterComponent, AuditLogListComponent } from '.';
import { PipesModule } from '../../shared/pipes/pipes.module';

const MODULES = [
  AuditRoutingModule,
  CommonModule,
  NgxLoadingModule.forRoot({}),
  DirectivesModule,
  ModalModule.forRoot(),
  NotifyModalModule,
  DynamicModalModule,
  ProgressbarModule,
  PopoverModule,
  TableModule,
  FormsModule,
  ReactiveFormsModule,
  MultiSelectModule,
  CalendarModule,
  PipesModule
]
const COMPONENTS = [
  AuditLogsComponent,
  AuditLogListFilterComponent,
  AuditLogListComponent
]

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
  providers: [BsModalService]
})
export class AuditLogsModule { }
