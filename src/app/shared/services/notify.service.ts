import { Injectable } from '@angular/core';
import { NotifierService, NotifierContainerComponent } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  private _notifyComponent: NotifierContainerComponent;
  constructor(private notifier: NotifierService) { }

  success(message: string) {
    if (!this.isAlreadExistsMessage(message))
      this.notifier.notify('success', message);
  }
  info(message: string) {
    if (!this.isAlreadExistsMessage(message))
      this.notifier.notify('info', message);
  }
  warning(message: string) {
    if (!this.isAlreadExistsMessage(message))
      this.notifier.notify('warning', message);
  }
  error(message: string) {
    if (!this.isAlreadExistsMessage(message))
      this.notifier.notify('error', message);
  }
  private isAlreadExistsMessage(message: string): boolean {
    var existsMessages = this._notifyComponent.notifications;
    if (!existsMessages) return false;
    var isAlreadyExistsMessage = existsMessages.find(x => x.message == message);
    return isAlreadyExistsMessage ? true : false;
  }
  setNotifyElement(component: any) {
    this._notifyComponent = component;
  }
}
