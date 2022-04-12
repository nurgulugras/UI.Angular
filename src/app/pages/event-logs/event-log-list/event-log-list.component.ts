import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { EventLog } from '../../../models/entity/EventLog';
import { LogLevelType } from '../../../models/enums/LogLevelType.enum';
import { ResultType } from '../../../models/enums/ResultType.enum';
import { ComponentBase } from '../../../shared/components/component-base';
import { EventLogsService } from '../../../shared/services/event-logs.service';

@Component({
  selector: 'esa-event-log-list',
  templateUrl: './event-log-list.component.html',
  styleUrls: ['./event-log-list.component.scss']
})
export class EventLogListComponent extends ComponentBase implements OnInit {

  //  #region [ Fields ]
  @Output() onSelectedValueChanged: EventEmitter<EventLog> = new EventEmitter();
  eventLogs: EventLog[] = [];
  cols: any[];
  selectedTypes: string[] = [];
  selectedLevels: string[] = [];
  types: string[] = [];
  levels: string[] = [];
  showList: boolean;
  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector, private eventLogsService: EventLogsService) {
    super(injector);
    this.loadColums();
    this.loadTypes();
    this.loadLevels();
  }
  ngOnInit() {
    this.getEventLogs();
  }
  // #endregion

  //  #region [ Entity ]
  private getEventLogsFromAPI(): void {
    this._isRunning = true;
    this.eventLogsService.getEventLogs().subscribe(response => {
      this.eventLogs = [];
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.eventLogs = response.dataModel;
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    },
      error => {
        this._isRunning = false;
      });
  }
  // #endregion

  //  #region [ UI Tools ]
  refresh() {
    this.getEventLogs();
  }

  getBadgeClassByLevel(level: LogLevelType) {
    switch (level) {
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
  openDetail(eventLog: EventLog) {
    this.onSelectedValueChanged.emit(eventLog);
  }
  // #endregion

  //  #region [ Validations ]
  // #endregion

  //  #region [ Internal ]
  private getEventLogs() {
    this.getEventLogsFromAPI();
  }
  private loadColums() {
    this.cols = [
      { field: 'createDate', header: 'Create Date', sort: true, type: 'datetime' },
      // { field: 'createUserName', header: 'Create User', sort: true },
      { field: 'type', header: 'Type', sort: true },
      { field: 'level', header: 'Level', sort: true },
      // { field: 'message', header: 'Message', sort: false }
    ];
  }
  loadTypes(): void {
    var types: string[] = [];
    types.push("System");
    types.push("Security");
    types.push("Information");
    this.types = types;
  }
  loadLevels(): void {
    var levels: string[] = [];
    levels.push("Information");
    levels.push("Warning");
    levels.push("Error");
    levels.push("Fatal");
    this.levels = levels;
  }
  // #endregion
}