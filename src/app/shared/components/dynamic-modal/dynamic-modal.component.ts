import { Inject, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { ComponentRef } from '@angular/core';
import { ComponentFactoryResolver } from '@angular/core';
import { Component, EventEmitter, OnInit, Type } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PopupTool } from '../../../models/internal/PopupTool';

@Component({
  selector: 'esa-dynamic-modal',
  templateUrl: './dynamic-modal.component.html',
  styleUrls: ['./dynamic-modal.component.scss']
})
export class DynamicModalComponent implements OnInit {
  @ViewChild('componentContainer', { read: ViewContainerRef, static: true }) componentContainer: ViewContainerRef;
  me: any;
  title: string = '';
  hasHeader: boolean;
  // private _closing: EventEmitter<EventEmitter<PopupClosingEvent>> = new EventEmitter<EventEmitter<PopupClosingEvent>>();
  private _closed: EventEmitter<any> = new EventEmitter<any>();
  // private _resizing: EventEmitter<any> = new EventEmitter<any>();

  constructor(private moduleCFR: ComponentFactoryResolver, @Inject(BsModalRef) public bsModalRef: BsModalRef) { }
  ngOnInit() {
  }

  close(args: any = null) {
    this._closed.emit(args);
    this.bsModalRef.hide();
  }
  render<TComponent>(component: Type<TComponent>): ComponentRef<TComponent> {
    this.componentContainer.clear();
    const factory = this.moduleCFR.resolveComponentFactory(component);
    var instance = this.componentContainer.createComponent(factory);

    var popupTool = new PopupTool();
    popupTool.closeMe = this.close.bind(this);

    var generateComponentInstance: any = instance.instance;
    generateComponentInstance.popupTool = popupTool;
    return instance;
  }
  // onClosing(): EventEmitter<any> {
  //   return this._close
  // }
  onClosed(): EventEmitter<any> {
    return this._closed;
  }
}