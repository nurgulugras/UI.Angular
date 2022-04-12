import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobsComponent } from './jobs.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { NgxLoadingModule } from 'ngx-loading';
import { TableModule } from 'primeng/table';
import { DynamicModalModule } from '../../shared/components/dynamic-modal/dynamic-modal.module';
import { NotifyModalModule } from '../../shared/components/notify-modal/notify-modal.module';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { JobsRoutingModule } from './jobs-routing.module';
import { JobListComponent } from './.';

const MODULES = [
  CommonModule,
  JobsRoutingModule,
  NgxLoadingModule.forRoot({}),
  DirectivesModule,
  ModalModule.forRoot(),
  NotifyModalModule,
  DynamicModalModule,
  ProgressbarModule,
  PopoverModule,
  TableModule
]
const COMPONENTS = [
  JobsComponent,
  JobListComponent
]

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
  providers: [BsModalService]
})
export class JobsModule { }
