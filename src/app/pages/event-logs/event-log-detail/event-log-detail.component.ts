import { Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EventLog } from '../../../models/entity/EventLog';
import { LogLevelType } from '../../../models/enums/LogLevelType.enum';
import { ComponentBase } from '../../../shared/components/component-base';

@Component({
  selector: 'esa-event-log-detail',
  templateUrl: './event-log-detail.component.html',
  styleUrls: ['./event-log-detail.component.scss']
})
export class EventLogDetailComponent extends ComponentBase implements OnInit, OnChanges {

  //  #region [ Fields ]
  formGroup: FormGroup;
  @Input() eventLog: EventLog;
  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector) {
    super(injector);
    this.initFormGroup();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.formGroup.patchValue(this.eventLog);
  }
  ngOnInit() {
  }
  // #endregion

  //  #region [ Entity ]
  // #endregion

  //  #region [ UI Tools ]
  getBadgeClassByLevel(): string {
    if (!this.eventLog) return '';
    switch (this.eventLog.level) {
      case LogLevelType.Information:
        return "badge-primary"
      case LogLevelType.Warning:
        return "badge-warning"
      case LogLevelType.Error:
        return "badge-danger"
      default:
        return "badge-dark"
    }
  }
  // #endregion

  //  #region [ Validations ]
  // #endregion

  //  #region [ Internal ]
  initFormGroup() {
    this.formGroup = new FormGroup({
      id: new FormControl(''),
      createDate: new FormControl(''),
      createUserId: new FormControl(''),
      createUserName: new FormControl(''),
      type: new FormControl(''),
      level: new FormControl(''),
      message: new FormControl(''),
      eventId: new FormControl('')
    });
  }
  // #endregion
}