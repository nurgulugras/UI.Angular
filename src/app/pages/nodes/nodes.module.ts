import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodesComponent } from './nodes.component';
import { NodesRoutingModule } from './nodes-routing.module';
import { NodeListComponent, NodeLunListComponent, NodeInfoComponent, NodeStatusComponent } from './.';
import { NgxLoadingModule } from 'ngx-loading';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TableModule } from 'primeng/table';

const MODULES = [
  CommonModule,
  NodesRoutingModule,
  NgxLoadingModule.forRoot({}),
  ProgressbarModule,
  TableModule
]
const COMPONENTS = [
  NodesComponent,
  NodeListComponent,
  NodeLunListComponent,
  NodeInfoComponent,
  NodeStatusComponent
]

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS]
})
export class NodesModule { }