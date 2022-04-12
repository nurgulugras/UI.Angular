import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EventLogsComponent } from './event-logs.component';

const routes: Routes = [
  {
    path: '',
    component: EventLogsComponent,
    data: {
      title: 'Event Logs'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventLogsRoutingModule { }
