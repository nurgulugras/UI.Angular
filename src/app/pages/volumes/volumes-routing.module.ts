import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VolumesComponent } from './volumes.component';


const routes: Routes = [
  {
    path: '',
    component: VolumesComponent,
    data: {
      title: 'Volumes'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VolumesRoutingModule { }
