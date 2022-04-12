import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NgxLoadingModule } from 'ngx-loading';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TableModule } from 'primeng/table';
import { UserListComponent, UserCreateComponent } from './.';
import { DirectivesModule } from '../../../shared/directives/directives.module';
import { NotifyModalModule } from '../../../shared/components/notify-modal/notify-modal.module';
import { DynamicModalModule } from '../../../shared/components/dynamic-modal/dynamic-modal.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DropdownModule } from 'primeng/dropdown';

const COMPONENTS = [UserListComponent, UserCreateComponent];
const MODULES = [
  CommonModule,
  NgxLoadingModule.forRoot({}),
  DirectivesModule,
  ModalModule.forRoot(),
  NotifyModalModule,
  FormsModule,
  ReactiveFormsModule,
  DynamicModalModule,
  ProgressbarModule,
  PopoverModule,
  TabsModule,
  TableModule,
  BsDropdownModule.forRoot(),
  DropdownModule,
]

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [BsModalService]
})
export class FormUsersModule { }
