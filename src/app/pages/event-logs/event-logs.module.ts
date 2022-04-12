import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventLogsComponent } from './event-logs.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { NgxLoadingModule } from 'ngx-loading';
import { TableModule } from 'primeng/table';
import { DynamicModalModule } from '../../shared/components/dynamic-modal/dynamic-modal.module';
import { NotifyModalModule } from '../../shared/components/notify-modal/notify-modal.module';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { EventLogsRoutingModule } from './event-logs-routing.module';
import { EventLogListComponent, EventLogDetailComponent } from '.';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';

const MODULES = [
  CommonModule,
  EventLogsRoutingModule,
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
  CalendarModule
]
const COMPONENTS = [
  EventLogsComponent,
  EventLogListComponent,
  EventLogDetailComponent
]

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
  providers: [BsModalService]
})
export class EventLogsModule { }
