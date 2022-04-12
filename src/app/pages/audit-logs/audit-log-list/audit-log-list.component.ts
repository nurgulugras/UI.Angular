import { Component, OnInit, Input, Injector, ViewChild } from '@angular/core';
import { AuditFilterParameter } from '../../../models/api/AuditFilterParameter';
import { ComponentBase } from '../../../shared/components/component-base';
import { AuditLogsService } from '../../../shared/services/audit-logs.service';
import { AuditLog } from '../../../models/entity/AuditLog';
import { ResultType } from '../../../models/enums/ResultType.enum';
import * as moment from 'moment';
import { SeverityType } from '../../../models/enums/SeverityType.enum';
import { ExportPropertyInfo } from '../../../models/internal/ExportPropertyInfo';
import { ExporterOptions } from '../../../models/internal/exporter-options';
import { LazyLoadEvent, SortMeta } from 'primeng/api';

@Component({
  selector: 'esa-audit-log-list',
  templateUrl: './audit-log-list.component.html',
  styleUrls: ['./audit-log-list.component.scss']
})
export class AuditLogListComponent extends ComponentBase implements OnInit {

  //  #region [ Fields ]
  @ViewChild('changesDetailPanel', { static: false }) changesDetailPanel: any;
  @Input() auditFilterParameter: AuditFilterParameter = new AuditFilterParameter();
  cols: any[];
  auditLogs: AuditLog[] = [];
  changes: string;
  severityTypeUI = SeverityType;
  loading: boolean;
  rows: number = 0;
  totalRecords: number = 0;
  tableRowsPers: number[] = [15, 50, 100];
  currentPageNumber: number = 1;
  currentOrderBy: string[];
  isCallBack: boolean = false;

  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector, private auditLogsService: AuditLogsService) {
    super(injector);
    this.loadColums();
    this.rows = this.tableRowsPers[0];
  }
  ngOnInit() { }
  // #endregion

  //  #region [ Entity ]
  private getLogsFromAPI(pageNumber: number = 0, pageSize: number = 0, orderBy: string[] = null): void {
    this._isRunning = true;
    this.auditLogsService.getAuditLogs(this.auditFilterParameter, pageNumber, pageSize, orderBy).subscribe(response => {
      this._isRunning = false;
      // this.loading = true;
      this.auditLogs = [];
      if (response.resultType == ResultType.Success) {
        this.auditLogs = response.dataModel.data;
        this.totalRecords = response.dataModel.totalRecords;
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

  public getSeverityTypeIcon(severityType: SeverityType): string {
    switch (severityType) {
      case SeverityType.Warning:
        return "severity-warning.png";
      case SeverityType.Critical:
        return "severity-critical.png";
      case SeverityType.Error:
        return "severity-error.png";
      default:
        return "severity-info.png";
    }
  }
  public getSeverityBackgroundColor(severityType: SeverityType): string {
    switch (severityType) {
      case SeverityType.Warning:
        return "#fff8ea";
      case SeverityType.Critical:
        return "#ffc7c7";
      case SeverityType.Error:
        return "#fff2f2";
      default:
        return "";
    }
  }
  public loadLogs(event: LazyLoadEvent): void {
    var orderBy: string[];
    if (event.multiSortMeta) {
      orderBy = this.resolveSortedQuery(event.multiSortMeta);
    }
    this.currentOrderBy = orderBy;

    if (!this.isCallBack) return;
    // this.loading = true;
    var pageSize: number = this.rows = event.rows;
    var pageNumber = this.currentPageNumber = event.first == 0 ? 1 : (event.first / event.rows) + 1;

    this.getLogsFromAPI(pageNumber, pageSize, orderBy);
  }
  public dateFormat(date, format = "DD.MM.YYYY HH:mm:ss"): string {
    return moment(date).format(format);
  }
  refresh() {
    this.getList();
  }
  getList() {
    this.getLogsFromAPI(this.currentPageNumber, this.rows, this.currentOrderBy);
    this.isCallBack = true;
  }
  showChanges(changes: string) {
    this.changes = changes;
    this.changesDetailPanel.show();
  }
  // #endregion

  //  #region [ Validations ]
  // #endregion

  //  #region [ Internal ]
  exportToExcel() {
    if (this.auditLogs && this.auditLogs.length > 0) {
      var opt = new ExporterOptions();
      opt.fileName = "log-report-list";
      opt.headers = [
        new ExportPropertyInfo("createDate", "Create Date"),
        new ExportPropertyInfo("userName", "Create User"),
        new ExportPropertyInfo("severity", "Severity"),
        new ExportPropertyInfo("crudType", "Crud Type"),
        new ExportPropertyInfo("logCategory", "Log Category"),
        new ExportPropertyInfo("message", "Message"),
        new ExportPropertyInfo("changes", "Changes")
      ];
      opt.isAutoColumn = true;
      opt.skipHeader = false;
      this._exporterService.exportToExcelFromJson(this.auditLogs, opt);
    }
  }
  private loadColums() {
    this.cols = [
      { field: 'isSuccess', header: 'Is Success', sort: true },
      { field: 'createDate', header: 'Create Date', sort: true },
      { field: 'userName', header: 'Create User', sort: true },
      { field: 'crudType', header: 'Crud Type', sort: true },
      { field: 'logCategory', header: 'Log Category', sort: true },
      { field: 'message', header: 'Message', sort: false }
    ];
  }
  resolveSortedQuery(sort: SortMeta[]): string[] {
    var sortQuery: string[] = [];
    for (let index = 0; index < sort.length; index++) {
      const sorted = sort[index];
      sortQuery.push(`${sorted.field} ${sorted.order > 0 ? 'ASC' : 'DESC'}`);
    }
    return sortQuery;
  }
  // #endregion
}
