import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NgxLoadingModule } from 'ngx-loading';
import { NotifyModalModule } from '../../shared/components/notify-modal/notify-modal.module';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { UsersRoutingModule } from './users-routing.module';
import { DynamicModalModule } from '../../shared/components/dynamic-modal/dynamic-modal.module';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TableModule } from 'primeng/table';
import { FormUsersModule } from './form-users/form-users.module';


const MODULES = [
  CommonModule,
  UsersRoutingModule,
  NgxLoadingModule.forRoot({}),
  DirectivesModule,
  ModalModule.forRoot(),
  NotifyModalModule,
  FormsModule,
  ReactiveFormsModule,
  // DataTableModule,
  DynamicModalModule,
  ProgressbarModule,
  PopoverModule,
  TabsModule,
  TableModule,
  FormUsersModule,

]
const COMPONENTS = [
  UsersComponent
]

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
  providers: [BsModalService]
})

export class UsersModule { }
