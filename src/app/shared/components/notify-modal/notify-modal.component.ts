import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotifyConfirmType } from '../../../models/enums/NotifyConfirmType.enum';
import { ButtonOption } from '../../../models/internal/ButtonOption';

@Component({
  selector: 'esa-notify-modal',
  templateUrl: './notify-modal.component.html',
  styleUrls: ['./notify-modal.component.scss']
})
export class NotifyModalComponent implements OnInit {
  title: string = '';
  content: string = '';
  buttons: ButtonOption[];
  onClosed: EventEmitter<NotifyConfirmType> = new EventEmitter();
  constructor(@Inject(BsModalRef) public bsModalRef: BsModalRef) { }
  ngOnInit() {
  }
  public close(button: ButtonOption) {
    this.onClosed.emit(button?.confirmType);
    this.bsModalRef.hide()
  }
}
