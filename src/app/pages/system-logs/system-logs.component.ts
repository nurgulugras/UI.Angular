import { Component, OnInit } from '@angular/core';
import { SystemLogFilterParameter } from '../../models/api/SystemLogFilterParameter';

@Component({
  selector: 'esa-system-logs',
  templateUrl: './system-logs.component.html',
  styleUrls: ['./system-logs.component.scss']
})
export class SystemLogsComponent implements OnInit {

  systemLogFilterParameter: SystemLogFilterParameter = new SystemLogFilterParameter();

  constructor() { }

  ngOnInit() {
  }
}
