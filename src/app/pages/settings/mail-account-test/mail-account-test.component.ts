import { Component, OnInit, Injector } from '@angular/core';
import { MailValidation } from '../../../shared/MailValidation';
import { ComponentBase } from '../../../shared/components/component-base';
import { NotifyConfirmType } from '../../../models/enums/NotifyConfirmType.enum';
import { MailTestRequestModel } from '../../../models/api/MailTestRequestModel';
import { MailProviderService } from '../../../shared/services/mail-provider.service';
import { ResultType } from '../../../models/enums/ResultType.enum';
import { PopupTool } from '../../../models/internal/PopupTool';

@Component({
  selector: 'esa-mail-account-test',
  templateUrl: './mail-account-test.component.html',
  styleUrls: ['./mail-account-test.component.scss']
})
export class MailAccountTestComponent extends ComponentBase implements OnInit {

  //  #region [ Fields ]
  mailTestRequestModel: MailTestRequestModel = new MailTestRequestModel();
  popupTool: PopupTool;
  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector, private mailProviderService: MailProviderService) {
    super(injector);
  }
  ngOnInit() {
  }
  // #endregion

  //  #region [ Entity ]
  private sendTestMailFromAPI(mailTestRequestModel: MailTestRequestModel): void {
    this._isRunning = true;
    this.mailProviderService.sendTestMail(mailTestRequestModel).subscribe(response => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this._notifyService.success("Test mail sent");
        this.closePopup();
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
  sendTestMail(): void {
    if (!this.isValidForm()) return;
    var modal = this._modalService.confirmYesNo("Send Test Mail", `Are you sure you want to send test mail to <strong>'${this.mailTestRequestModel.testMailAddress}'</strong>?`);
    modal.onClosed.subscribe((replyType) => {
      if (replyType == NotifyConfirmType.Yes) {
        this.sendTestMailFromAPI(this.mailTestRequestModel);
      }
    });
  }

  // #endregion

  //  #region [ Validations ]
  isValidForm(): boolean {
    if (!this.mailTestRequestModel) return false;
    if (!(this.mailTestRequestModel.testMailAddress && this.mailTestRequestModel.testMailAddress.length > 0)) return false;
    if (!MailValidation.isValidEMail(this.mailTestRequestModel.testMailAddress)) return false;
    return true;
  }
  // #endregion

  //  #region [ Internal ]
  closePopup(data: any = null) {
    this.popupTool.closeMe(data);
  }
  // #endregion
}
