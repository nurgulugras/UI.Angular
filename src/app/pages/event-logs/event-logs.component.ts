import { Component, OnInit } from '@angular/core';
import { EventLog } from '../../models/entity/EventLog';

@Component({
  selector: 'esa-event-logs',
  templateUrl: './event-logs.component.html',
  styleUrls: ['./event-logs.component.scss']
})
export class EventLogsComponent implements OnInit {

  selectedEventLog: EventLog;
  constructor() { }

  ngOnInit() {
  }

}
