import { Injectable, Type } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { DynamicModalComponent } from '../components/dynamic-modal/dynamic-modal.component';
import { PopupInstance } from './popup-instance';

@Injectable({
  providedIn: 'root'
})
export class DynamicModalService {
  constructor(private modalService: BsModalService) { }
  open<TComponent>(
    component: Type<TComponent>,
    title: string,
    hasHeader: boolean = true,
    ignoreCloseOutside: boolean = false,
    isLargeSize: boolean = true,
  ) {
    var config: ModalOptions<DynamicModalComponent> = new ModalOptions();
    config.class = isLargeSize ? 'modal-lg' : null;
    config.backdrop = ignoreCloseOutside ? 'static' : null;
    config.keyboard = ignoreCloseOutside ? false : true;

    let modalRef: BsModalRef<DynamicModalComponent> = this.modalService.show<DynamicModalComponent>(DynamicModalComponent, config);
    modalRef.content.title = title;
    modalRef.content.hasHeader = hasHeader;
    var instance = modalRef.content.render(component)?.instance;

    var popupInstanceModel = new PopupInstance(
      instance,
      // modalRef.content.onClosing(),
      modalRef.content.onClosed()
    );
    return popupInstanceModel;
  }
}