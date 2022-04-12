import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotifyModalComponent } from './notify-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NotifyModalService } from '../../services/notify-modal.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NotifyModalComponent],
  exports: [NotifyModalComponent],
  providers: [BsModalService, NotifyModalService],
})
export class NotifyModalModule { }
