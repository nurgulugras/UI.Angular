import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Application } from "../../../../models/entity/Application";
import { NotifyConfirmType } from "../../../../models/enums/NotifyConfirmType.enum";
import { ResultType } from "../../../../models/enums/ResultType.enum";
import { LanguageKeys } from "../../../../models/internal/language-keys";
import { ComponentBase } from "../../../../shared/components/component-base";
import { ApplicationsService } from "../../../../shared/services/applications.service";
import * as _ from "lodash";
import { AppProduct } from "../../../../models/entity/AppProduct";
@Component({
  selector: "alms-application-detail-or-update",
  templateUrl: "./application-detail-or-update.component.html",
  styleUrls: ["./application-detail-or-update.component.scss"],
})
export class ApplicationDetailOrUpdateComponent
  extends ComponentBase
  implements OnInit, OnChanges
{
  //  #region [ Fields ]
  @Input() application: Application = new Application();
  @Output() onUpdateApplication: EventEmitter<Application> = new EventEmitter();
  formGroup: FormGroup;
  // #endregion

  //  #region [ Initialize ]
  constructor(
    public injector: Injector,
    private applicationsService: ApplicationsService
  ) {
    super(injector);
    this.initFormGroup();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.application && changes.application.currentValue) {
      this.application = _.cloneDeep(this.application);
      this.setDataToForm(this.formGroup, this.application);
    }
  }
  ngOnInit() {}
  // #endregion

  //  #region [ Entity ]
  updateApplicationFromAPI(application: Application) {
    this.applicationsService
      .updateApplication(application)
      .subscribe((response) => {
        if (response.resultType == ResultType.Success) {
          this._notifyService.success(LanguageKeys.ROW_UPDATED);
          // listComp.refresh();
          this.onUpdateApplication.emit(application);
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        }
      });
  }
  // #endregion

  //  #region [ UI Tools ]
  public update(): void {
    this.setModelFromForm(this.formGroup, this.application);

    // form valid ?
    if (!this.isValidForm()) {
      this._notifyService.error(LanguageKeys.FORM_INVALID_MESSAGE);
      return;
    }

    // emin misin?
    var modal = this._modalService.confirmYesNo(
      "Uygulama Güncelleme",
      "Uygulamayı güncellemek istediğinize emin misiniz?"
    );

    modal.onClosed.subscribe((reply) => {
      if (reply == NotifyConfirmType.Yes) {
        this.updateApplicationFromAPI(this.application);
      }
    });
  }
  // #endregion

  //  #region [ Validations ]
  isValidForm(): boolean {
    return this.formGroup.valid;
  }
  isEditMode(): boolean {
    return this.application && this.application.id && this.application.id > 0;
  }
  // #endregion

  //  #region [ Internal ]
  initFormGroup() {
    this.formGroup = new FormGroup({
      id: new FormControl(this.application.id),
      createDate: new FormControl(this.application.createDate),
      createUserName: new FormControl(this.application.createUserName),
      name: new FormControl(this.application.name, [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
      apiKey: new FormControl(this.application.apiKey),
      apiSecretKey: new FormControl(this.application.apiSecretKey),
      isActive: new FormControl(this.application.isActive),
    });
  }

  // #endregion
}
