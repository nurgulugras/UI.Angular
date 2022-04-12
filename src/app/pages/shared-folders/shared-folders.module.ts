import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedFoldersComponent } from './shared-folders.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { NgxLoadingModule } from 'ngx-loading';
import { TableModule } from 'primeng/table';
import { SharedFolderListComponent, SharedFolderCrudComponent, FileBrowserComponent } from '.';
import { DynamicModalModule } from '../../shared/components/dynamic-modal/dynamic-modal.module';
import { NotifyModalModule } from '../../shared/components/notify-modal/notify-modal.module';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { SharedFolderRoutingModule } from './shared-folder-routing.module';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PipesModule } from '../../shared/pipes/pipes.module';

const MODULES = [
  CommonModule,
  SharedFolderRoutingModule,
  NgxLoadingModule.forRoot({}),
  DirectivesModule,
  ModalModule.forRoot(),
  NotifyModalModule,
  FormsModule,
  ReactiveFormsModule,
  DynamicModalModule,
  ProgressbarModule,
  PopoverModule.forRoot(),
  TableModule,
  DropdownModule,
  TooltipModule.forRoot(),
  BsDropdownModule.forRoot(),
  PipesModule
]
const COMPONENTS = [
  SharedFoldersComponent,
  SharedFolderListComponent,
  SharedFolderCrudComponent,
  FileBrowserComponent
]

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
  providers: [BsModalService]
})
export class SharedFoldersModule { }
