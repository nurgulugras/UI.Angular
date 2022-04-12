import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedFoldersComponent } from './shared-folders.component';

const routes: Routes = [
  {
    path: '',
    component: SharedFoldersComponent,
    data: {
      title: 'Shares'
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedFolderRoutingModule { }
