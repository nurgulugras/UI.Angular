import { NgModule } from '@angular/core';
import { AuditLogsComponent } from './audit-logs.component';
import { Routes, RouterModule } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';

const routes: Routes = [
  {
    path: '',
    component: AuditLogsComponent,
    data: {
      title: 'Audit Logs'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [BsModalService]
})
export class AuditRoutingModule { }
