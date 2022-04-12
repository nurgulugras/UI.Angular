import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemLogsComponent } from './system-logs.component';
import { NgxLoadingModule } from 'ngx-loading';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { NotifyModalModule } from '../../shared/components/notify-modal/notify-modal.module';
import { DynamicModalModule } from '../../shared/components/dynamic-modal/dynamic-modal.module';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { SystemLogListComponent, SystemLogListFilterComponent } from './.';
import { SystemLogRoutingModule } from './system-log-routing.module';

const MODULES = [
  SystemLogRoutingModule,
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
  SystemLogsComponent,
  SystemLogListComponent,
  SystemLogListFilterComponent
]

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
  providers: [BsModalService]
})
export class SystemLogsModule { }
