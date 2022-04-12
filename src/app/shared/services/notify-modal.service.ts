import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotifyConfirmType } from '../../models/enums/NotifyConfirmType.enum';
import { ButtonOption } from '../../models/internal/ButtonOption';
import { NotifyModalComponent } from '../components/notify-modal/notify-modal.component';

@Injectable({
  providedIn: 'root'
})
export class NotifyModalService {

  constructor(private modalService: BsModalService) { }

  public confirmYesNo(title: string, content: string, classes: string[] = []): NotifyModalComponent {
    return this.confirmBase(title, content, this.getYesNoButtons(classes));
  }
  public confirmYesNoCancel(title: string, content: string): NotifyModalComponent {
    return this.confirmBase(title, content, this.getYesNoCanceluttons());
  }
  public confirmOkCancel(title: string, content: string): NotifyModalComponent {
    return this.confirmBase(title, content, this.getOkCancelButtons());
  }
  public confirmOk(title: string, content: string): NotifyModalComponent {
    return this.confirmBase(title, content, this.getOkButtons());
  }
  private confirmBase(title: string, content: string, buttons: ButtonOption[]): NotifyModalComponent {
    let modalRef: BsModalRef<NotifyModalComponent> = this.modalService.show<NotifyModalComponent>(NotifyModalComponent, {});
    modalRef.content.title = title;
    modalRef.content.content = content;
    modalRef.content.buttons = buttons;
    return modalRef.content;
  }
  private getYesNoButtons(classes: string[]): ButtonOption[] {
    var buttons: ButtonOption[] = [];
    buttons.push(new ButtonOption("Evet", "fa fa-check", NotifyConfirmType.Yes, classes && classes.length > 0 ? classes[0] : null));
    buttons.push(new ButtonOption("Hayır", "fa fa-close", NotifyConfirmType.No, classes && classes.length > 1 ? classes[1] : null));
    return buttons;
  }
  private getYesNoCanceluttons(): ButtonOption[] {
    var buttons: ButtonOption[] = [];
    buttons.push(new ButtonOption("Evet", "fa fa-check", NotifyConfirmType.Yes));
    buttons.push(new ButtonOption("Hayır", "fa fa-close", NotifyConfirmType.No));
    buttons.push(new ButtonOption("Iptal", "fa fa-window-close", NotifyConfirmType.Cancel));
    return buttons;
  }
  private getOkCancelButtons(): ButtonOption[] {
    var buttons: ButtonOption[] = [];
    buttons.push(new ButtonOption("Tamam", "fa fa-check", NotifyConfirmType.OK));
    buttons.push(new ButtonOption("Iptal", "fa fa-window-close", NotifyConfirmType.Cancel));
    return buttons;
  }
  private getOkButtons(): ButtonOption[] {
    var buttons: ButtonOption[] = [];
    buttons.push(new ButtonOption("Tamam", "fa fa-check", NotifyConfirmType.OK));
    return buttons;
  }
}
