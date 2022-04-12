import { Component, Injector, OnInit } from '@angular/core';
import { ComponentBase } from '../../../shared/components/component-base';
import { UsersService } from '../../../shared/services/users.service';
import { User } from '../../../models/entity/User';
import { ResultType } from '../../../models/enums/ResultType.enum';
import { DynamicModalService } from '../../../shared/services/dynamic-modal.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { UserAuthType } from '../../../models/enums/UserAuthType.enum';
import { LanguageKeys } from '../../../models/internal/language-keys';

@Component({
  selector: 'esa-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends ComponentBase implements OnInit {


  //  #region [ Fields ]
  user: User = new User();
  private fontSize: number = 13;
  private increaseAmount: number = 1;

  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector, private usersService: UsersService, private dynamicModalService: DynamicModalService) {
    super(injector)
  }
  ngOnInit() {
    this.getMe();
  }
  // #endregion

  //  #region [ Entity ]
  private getMyUserFromAPI(): void {
    this._isRunning = true;
    this.usersService.getMyUser().subscribe(response => {
      this._isRunning = false;

      if (response.resultType == ResultType.Success) {

        this.user=response.dataModel

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
  changePossword() {
    const popup = this.dynamicModalService.open<ChangePasswordComponent>(
      ChangePasswordComponent,
      "Şifre Değiştir",
      true,
      true,
      false
    );
  }
  increaseFontSize() {
    this.fontSize = this.fontSize + this.increaseAmount;
    this.htmlElement.style.fontSize = `${this.fontSize}px`;
  }
  decreaseFontSize() {
    this.fontSize = this.fontSize - this.increaseAmount;
    this.htmlElement.style.fontSize = `${this.fontSize}px`;
  }
  // #endregion

  //  #region [ Validations ]
  // isBasicAuth(): boolean {
  //   return this.user?.authenticationType == UserAuthType.Basic;
  // }
  // #endregion

  //  #region [ Internal ]
  getMe() {
    this.getMyUserFromAPI();
  }

  get htmlElement(): HTMLElement {
    return <HTMLElement>document.getElementsByTagName("html")[0];
  }
  // #endregion

}
