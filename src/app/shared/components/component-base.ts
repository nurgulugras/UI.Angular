import { Injector } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { NotifyModalService } from "../services/notify-modal.service";
import { NotifyService } from "../services/notify.service";
import { LoggedInUser } from "../../models/internal/LoggedInUser";
import { AuthToolService } from "../AuthToolService";
import * as moment from "moment";
import { ExporterService } from "../services/exporter.service";
import { ExporterOptions } from "../../models/internal/exporter-options";

// @Component({
//     template: ''
// })
export class ComponentBase {
  protected _notifyService: NotifyService;
  protected _modalService: NotifyModalService;
  protected _exporterService: ExporterService;
  public _isRunning: boolean = false;

  /* Volume ekranında, Volume' un child card' ların başlıklarında ki icon  */
  public _cardVolumeChildTitleIcon: string = "cil-grain";

  /* Node ekranındaki child card' ların başlıklarında ki icon  */
  public _cardNodeTitleIcon: string = "cil-apps-settings";

  /* Genel hatlardaki card' ların başlıklarındaki icon  */
  public _cardTitleIcon: string = "cil-blur";
  protected _loggedInUser: LoggedInUser;

  constructor(public injector: Injector) {
    this.getServices();
    this.hasWhiteSpace = this.hasWhiteSpace.bind(this);
  }
  private getServices() {
    this._notifyService = this.injector.get(NotifyService);
    this._modalService = this.injector.get(NotifyModalService);
    this._loggedInUser = this.injector.get(AuthToolService).getCurrentUser();
    this._exporterService = this.injector.get(ExporterService);
  }

  protected noWhitespaceValidator(control: FormControl) {
    if(!(control && control.value)){
      return
    }
    try {
      const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
    } catch (error) {
      debugger
    }
    
  }
  protected usernameValidator(control: FormControl) {
    const value = control.value || "";
    const hasWhitespace = value.indexOf(" ") >= 0;
    var reWhiteSpace = new RegExp("^([a-zA-Z][a-zA-Z0-9._]+[a-zA-Z0-9])$");
    return !hasWhitespace && reWhiteSpace.test(value)
      ? null
      : { whitespace: true };
  }
  protected ignoreWhitespaceValidator(control: FormControl) {
    var value = control.value || "";
    const hasWhitespace = value.indexOf(" ") >= 0;
    return !hasWhitespace ? null : { whitespace: true };
  }
  protected exportToExcel<TObject>(items: TObject[], opt: ExporterOptions) {
    this._exporterService.exportToExcelFromJson(items, opt);
  }
  public minimalizeCardBody(e: Element) {
    e.classList.toggle("hidden-body");
  }
  public dateFormat(date, format = "DD.MM.YYYY HH:mm:ss"): string {
    if (!date) return "-";
    return moment(date).format(format);
  }
  private hasWhiteSpace(s: string): boolean {
    return s == (null || undefined) ? false : s.indexOf(" ") >= 0;
  }

  // form' a modeli set eder
  protected setDataToForm(formGroup: FormGroup, data: any) {
    formGroup.patchValue(data);
  }
  // form da ki verileri model' e set eder
  protected setModelFromForm(formGroup: FormGroup, data: any) {
    data = Object.assign(data, formGroup.value);
  }
}
