import { Component, OnInit } from '@angular/core';
import { AuditFilterParameter } from '../../models/api/AuditFilterParameter';

@Component({
  selector: 'esa-audit-logs',
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.scss']
})
export class AuditLogsComponent implements OnInit {

  auditFilterParameter: AuditFilterParameter = new AuditFilterParameter();

  constructor() { }

  ngOnInit() {
  }
}
