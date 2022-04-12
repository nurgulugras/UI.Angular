import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolumesComponent } from './volumes.component';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { NgxLoadingModule } from 'ngx-loading';
import { VolumeListComponent, VolumeOverviewComponent, VolumeInfoComponent, SnapshotListComponent, SnapshotCreateComponent, SnapshotSchedulerComponent, VolumeConfigurationComponent } from './.';
import { VolumesRoutingModule } from './volumes-routing.module';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NotifyModalModule } from '../../shared/components/notify-modal/notify-modal.module';
import { DynamicModalModule } from '../../shared/components/dynamic-modal/dynamic-modal.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { PipesModule } from '../../shared/pipes/pipes.module';

const VOLUME_COMPONENTS = [VolumeListComponent, VolumeInfoComponent, VolumeOverviewComponent, VolumeConfigurationComponent]
const SNAPSHOT_COMPONENTS = [SnapshotListComponent, SnapshotCreateComponent, SnapshotSchedulerComponent]

const MODULES = [
  CommonModule,
  VolumesRoutingModule,
  NgxLoadingModule.forRoot({}),
  ProgressbarModule,
  DirectivesModule,
  PopoverModule,
  ModalModule.forRoot(),
  NotifyModalModule,
  DynamicModalModule,
  FormsModule,
  ReactiveFormsModule,
  TabsModule,
  TableModule,
  CalendarModule,
  DropdownModule,
  PipesModule
]
const COMPONENTS = [
  VolumesComponent,
  ...VOLUME_COMPONENTS,
  ...SNAPSHOT_COMPONENTS,
]
@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
  providers: [BsModalService],
})

export class VolumesModule { }
