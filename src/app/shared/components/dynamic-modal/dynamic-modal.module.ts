import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicModalComponent } from './dynamic-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DynamicModalComponent],
  exports: [DynamicModalComponent],
  providers: [BsModalService],
})
export class DynamicModalModule { }
