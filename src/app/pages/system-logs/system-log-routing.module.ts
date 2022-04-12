import { NgModule } from '@angular/core';
import { SystemLogsComponent } from './system-logs.component';
import { Routes, RouterModule } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';

const routes: Routes = [
  {
    path: '',
    component: SystemLogsComponent,
    data: {
      title: 'System Logs'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [BsModalService]
})
export class SystemLogRoutingModule { }
