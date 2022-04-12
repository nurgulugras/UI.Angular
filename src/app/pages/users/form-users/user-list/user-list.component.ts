import { Component, Injector, OnInit } from '@angular/core';
import { UserCreateComponent } from '../user-create/user-create.component';
import { ComponentBase } from '../../../../shared/components/component-base';
import { User } from '../../../../models/entity/User';
import { DynamicModalService } from '../../../../shared/services/dynamic-modal.service';
import { UsersService } from '../../../../shared/services/users.service';
import { ResultType } from '../../../../models/enums/ResultType.enum';
import { LanguageKeys } from '../../../../models/internal/language-keys';
import { NotifyConfirmType } from '../../../../models/enums/NotifyConfirmType.enum';
import { ExporterOptions } from '../../../../models/internal/exporter-options';
import { ExportPropertyInfo } from '../../../../models/internal/ExportPropertyInfo';

@Component({
  selector: 'esa-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent extends ComponentBase implements OnInit {
  //  #region [ Fields ]
  users: User[] = [];
  cols: any[];
  // #endregion

  //  #region [ Initialize ]

  constructor(public injector: Injector, private dynamicModalService: DynamicModalService, private usersService: UsersService) {
    super(injector);
    this.loadColums();
  }
  ngOnInit() {
    this.getUsers();
  }
  // #endregion

  dene(e) {
  }

  //  #region [ Entity ]
  private getUsersFromAPI(): void {
    this._isRunning = true;
    this.usersService.getUsers().subscribe(response => {
      this.users = [];
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.users = response.dataModel;
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
  exportToExcel() {
    if (this.users && this.users.length > 0) {
      var opt = new ExporterOptions();
      opt.fileName = "form-user-list";
      opt.headers = [
        new ExportPropertyInfo("createDate", "Oluşturma Tarihi"),
        new ExportPropertyInfo("name", "Isim"),
        new ExportPropertyInfo("surname", "Soyisim"),
        new ExportPropertyInfo("email", "E-Mail"),
        new ExportPropertyInfo("role", "Rol"),
        new ExportPropertyInfo("isActive", "Aktif Mi?")
      ];
      opt.isAutoColumn = true;
      opt.skipHeader = false;
      this._exporterService.exportToExcelFromJson(this.users, opt);
    }
  }
  updateUser(user) {
    const popup = this.dynamicModalService.open<UserCreateComponent>(
      UserCreateComponent,
      null,
      false,
      true,
      true
    );
    popup.instance.setDataToEdit(user);
    popup.onClosed().subscribe(() => {
      this.refresh();
    });
  }
  createUser() {
    const popup = this.dynamicModalService.open<UserCreateComponent>(
      UserCreateComponent,
      null,
      false,
      true,
      true
    );
    popup.onClosed().subscribe(response => {
      if (response)
        this.refresh();
    });
  }

  public refresh() {
    this.getUsers();
  }
  // #endregion

  //  #region [ Validations ]
  isMyUser(user: User): boolean {
    return user.email == this._loggedInUser.username;
  }

  // #endregion

  //  #region [ Internal ]
  private getUsers() {
    this.getUsersFromAPI();
  }
  private loadColums() {
    this.cols = [
      { field: 'name', header: 'Isim', sort: true },
      { field: 'surname', header: 'Soyisim', sort: true },
      { field: 'email', header: 'E-Mail', sort: true },
      { field: 'role', header: 'Rol', sort: true },
      { field: 'isActive', header: 'Aktif Mi?', buttonType: true, width: '80px' }
    ];
  }

  // #endregion
}