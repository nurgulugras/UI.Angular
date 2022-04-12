import { Component, OnInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import { ComponentBase } from '../../../shared/components/component-base';
import { User } from '../../../models/entity/User';
import { UsersService } from '../../../shared/services/users.service';
import { ResultType } from '../../../models/enums/ResultType.enum';
import { EnumHelper } from '../../../shared/EnumHelper';
import { AuditLogCategory } from '../../../models/enums/AuditLogCategory.enum';
import { CrudType } from '../../../models/enums/CrudType.enum';
import { SeverityType } from '../../../models/enums/SeverityType.enum';
import { SystemLogFilterParameter } from '../../../models/api/SystemLogFilterParameter';

@Component({
  selector: 'esa-system-log-list-filter',
  templateUrl: './system-log-list-filter.component.html',
  styleUrls: ['./system-log-list-filter.component.scss']
})
export class SystemLogListFilterComponent extends ComponentBase implements OnInit {

  //  #region [ Fields ]

  @Input() systemLogFilterParameter: SystemLogFilterParameter = new SystemLogFilterParameter();
  @Output() onSearchButtonClick: EventEmitter<any> = new EventEmitter();
  logCategories: string[] = []
  crudTypes: string[] = []
  severityTypes: string[] = []
  userIds: number[] = []
  logUsers: User[] = []
  selectedCategories: string[] = [];
  selectedCrudTypes: string[] = [];
  isOnlyErrors: boolean = false;

  date: any;
  // #endregion

  getusername(e: User) {
    return e.name + " " + e.surname;
  }

  //  #region [ Initialize ]
  constructor(public injector: Injector, private usersService: UsersService) {
    super(injector);
    this.loadTypes();
  }
  ngOnInit() {
    this.getUsersFromAPI();
    this.date = [new Date(), null];
    this.onBlurMethod(this.date);
  }
  onBlurMethod(e: Date[]) {
    if (!e) {
      this.systemLogFilterParameter.startDate = null;
      this.systemLogFilterParameter.endDate = null;
    } else {
      this.systemLogFilterParameter.startDate = e[0];
      this.systemLogFilterParameter.endDate = e[1];
    }
  }
  // #endregion

  //  #region [ Entity ]
  private getUsersFromAPI(): void {
    this._isRunning = true;
    this.usersService.getUsers().subscribe(response => {
      this.logUsers = [];
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.logUsers = response.dataModel;
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
  onSubmitButton() {
    this.onSearchButtonClick.emit();
  }
  // #endregion

  //  #region [ Validations ]
  // #endregion

  //  #region [ Internal ]
  loadTypes() {
    this.logCategories = EnumHelper.getEnumKeys(AuditLogCategory);
    this.crudTypes = EnumHelper.getEnumKeys(CrudType);
    this.severityTypes = EnumHelper.getEnumValues(SeverityType);
  }
  // #endregion
}