import { EventEmitter } from '@angular/core';
import { PopupClosingEvent } from '../../models/internal/PopupClosingEvent';

export class PopupInstance<TComponent> {
    private _closing: EventEmitter<EventEmitter<PopupClosingEvent>> = new EventEmitter<EventEmitter<PopupClosingEvent>>();
    private _closed: EventEmitter<any> = new EventEmitter<any>();
    constructor(
        instance: TComponent,
        // closing: EventEmitter<EventEmitter<PopupClosingEvent>>,
        closed: EventEmitter<any>,
    ) {
        this.instance = instance;
        // this._closing = closing;
        this._closed = closed;
    }
    instance: TComponent;
    // onClosing(): EventEmitter<EventEmitter<PopupClosingEvent>> {
    //     return this._closing;
    // }
    onClosed(): EventEmitter<any> {
        return this._closed;
    }
}