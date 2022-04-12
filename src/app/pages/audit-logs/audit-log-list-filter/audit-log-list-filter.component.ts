import { Component, OnInit, Input, EventEmitter, Output, Injector } from '@angular/core';
import { AuditFilterParameter } from '../../../models/api/AuditFilterParameter';
import { User } from '../../../models/entity/User';
import { ComponentBase } from '../../../shared/components/component-base';
import { ResultType } from '../../../models/enums/ResultType.enum';
import { AuditLogsService } from '../../../shared/services/audit-logs.service';
import { SharesService } from '../../../shared/services/shares.service';
import { Sharing } from '../../../models/entity/Sharing';

@Component({
  selector: 'esa-audit-log-list-filter',
  templateUrl: './audit-log-list-filter.component.html',
  styleUrls: ['./audit-log-list-filter.component.scss']
})
export class AuditLogListFilterComponent extends ComponentBase implements OnInit {
  //  #region [ Fields ]
  @Input() auditFilterParameter: AuditFilterParameter = new AuditFilterParameter();
  @Output() onSearchButtonClick: EventEmitter<any> = new EventEmitter();

  userNames: string[];
  shares: string[] = [];
  files: string[];
  operations: string[];
  isOnlyErrors: boolean = false;
  date: any;
  // #endregion
  //  #region [ Initialize ]
  constructor(public injector: Injector, private auditLogsService: AuditLogsService, private sharesService: SharesService) {
    super(injector);
    this.loadTypes();
  }
  ngOnInit() {
    this.loadDataSources();
    this.date = [new Date(), null];
    this.onBlurMethod(this.date);
  }
  onBlurMethod(e: Date[]) {
    if (!e) {
      this.auditFilterParameter.startDate = null;
      this.auditFilterParameter.endDate = null;
    } else {
      this.auditFilterParameter.startDate = e[0];
      this.auditFilterParameter.endDate = e[1];
    }
  }
  // #endregion

  //  #region [ Entity ]

  private getUserNamesFromAPI(): void {
    this._isRunning = true;
    this.auditLogsService.getUsernamesToAuditLog().subscribe(response => {
      this.userNames = [];
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.userNames = response.dataModel;
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    },
      () => {
        this._isRunning = false;
      });
  }
  private getFilesFromAPI(): void {
    this._isRunning = true;
    this.auditLogsService.getFilesToAuditLog().subscribe(response => {
      this.files = [];
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.files = response.dataModel;
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    },
      () => {
        this._isRunning = false;
      });
  }
  private getOperationsFromAPI(): void {
    this._isRunning = true;
    this.auditLogsService.getOperationsToAuditLog().subscribe(response => {
      this.operations = [];
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.operations = response.dataModel;
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    },
      () => {
        this._isRunning = false;
      });
  }
  private getSharingListFromAPI() {
    this._isRunning = true;
    this.sharesService.getSharingList().subscribe(response => {
      this.shares = [];
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.shares = response.dataModel.map(share => share.folderName);
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    },
      () => {
        this._isRunning = false;
      });
  }
  // #endregion

  //  #region [ UI Tools ]
  onSubmitButton() {
    this.onSearchButtonClick.emit();
  }
  // #endregion

  //  #region [ Validations ]
  // #endregion

  //  #region [ Internal ]
  loadDataSources() {
    this.getUserNamesFromAPI();
    this.getFilesFromAPI();
    this.getOperationsFromAPI();
    this.getSharingListFromAPI();
  }
  loadTypes() {
    // this.logCategories = EnumHelper.getEnumKeys(AuditLogCategory);
    // this.crudTypes = EnumHelper.getEnumKeys(CrudType);
    // this.severityTypes = EnumHelper.getEnumValues(SeverityType);
  }
  // #endregion
}