import { Component, Injector, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Application } from "../../../../models/entity/Application";
import { NotifyConfirmType } from "../../../../models/enums/NotifyConfirmType.enum";
import { ResultType } from "../../../../models/enums/ResultType.enum";
import { LanguageKeys } from "../../../../models/internal/language-keys";
import { ComponentBase } from "../../../../shared/components/component-base";
import { ApplicationsService } from "../../../../shared/services/applications.service";

@Component({
  selector: "alms-application-add",
  templateUrl: "./application-add.component.html",
  styleUrls: ["./application-add.component.scss"],
})
export class ApplicationAddComponent extends ComponentBase implements OnInit {
  //  #region [ Fields ]
  formGroup: FormGroup;
  application: Application = new Application();
  // #endregion

  //  #region [ Initialize ]
  constructor(
    public injector: Injector,
    private applicationsService: ApplicationsService
  ) {
    super(injector);
    this.initFormGroup();
  }
  ngOnInit() {}
  // #endregion

  //  #region [ Entity ]

  saveAppalicationFromAPI(application: Application) {
    this.applicationsService
      .createApplication(application)
      .subscribe((response) => {
        if (response.resultType == ResultType.Success) {
          this._notifyService.success(LanguageKeys.ROW_INSERTED);
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        }
      });
  }

  // #endregion

  //  #region [ UI Tools ]
  save() {
    this.setModelFromForm();
    if (!this.isValidForm()) {
      this._notifyService.error(LanguageKeys.FORM_INVALID_MESSAGE);
      return;
    }
    var modal = this._modalService.confirmYesNo(
      "Uygulama Kayıt",
      "Uygulamayı kaydetmek istediğinize emin misiniz?"
    );

    modal.onClosed.subscribe((reply) => {
      if (reply == NotifyConfirmType.Yes) {
        this.saveAppalicationFromAPI(this.application);
      }
    });
  }
  // #endregion

  //  #region [ Validations ]
  isValidForm(): boolean {
    return this.formGroup.valid;
  }
  // #endregion

  //  #region [ Internal ]
  initFormGroup() {
    this.formGroup = new FormGroup({
      name: new FormControl(this.application.name, [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
      isActive: new FormControl(this.application.isActive),
    });
    // this.repaitForm();
  }
  setModelFromForm() {
    this.application = Object.assign(this.application, this.formGroup.value);
  }
  // #endregion
}
