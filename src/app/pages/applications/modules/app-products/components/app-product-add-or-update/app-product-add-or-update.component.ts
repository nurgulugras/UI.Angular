import { Component, Injector, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AppProduct } from "../../../../../../models/entity/AppProduct";
import { NotifyConfirmType } from "../../../../../../models/enums/NotifyConfirmType.enum";
import { ResultType } from "../../../../../../models/enums/ResultType.enum";
import { LanguageKeys } from "../../../../../../models/internal/language-keys";
import { ComponentBase } from "../../../../../../shared/components/component-base";
import { AppProductsService } from "../../../../../../shared/services/app-products.service";
import * as _ from "lodash";

@Component({
  selector: "alms-app-product-add-or-update",
  templateUrl: "./app-product-add-or-update.component.html",
  styleUrls: ["./app-product-add-or-update.component.scss"],
})
export class AppProductAddOrUpdateComponent
  extends ComponentBase
  implements OnInit
{
  //  #region [ Fields ]
  formGroup: FormGroup;
  appProduct: AppProduct = new AppProduct();
  applicationId: number;
  // #endregion

  //  #region [ Initialize ]
  constructor(
    public injector: Injector,
    private appProductsService: AppProductsService
  ) {
    super(injector);
    this.initFormGroup();
  }
  ngOnInit() {}
  // #endregion

  //  #region [ Entity ]
  saveApplicationFromAPI(appProduct: AppProduct) {
    appProduct.appId = this.applicationId;
    this.appProductsService
      .createAppProduct(this.applicationId, appProduct)
      .subscribe((response) => {
        if (response.resultType == ResultType.Success) {
          this._notifyService.success(LanguageKeys.ROW_INSERTED);
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        }
      });
  }
  updateApplicationFromAPI(appProduct: AppProduct) {
    this.appProductsService
      .updateAppProduct(this.applicationId, appProduct)
      .subscribe((response) => {
        if (response.resultType == ResultType.Success) {
          this._notifyService.success(LanguageKeys.ROW_UPDATED);
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        }
      });
  }
  // #endregion

  //  #region [ UI Tools ]
  setAppProductToEdit(appProduct: AppProduct) {
    this.appProduct = _.cloneDeep(appProduct);
    this.setDataToForm(this.formGroup, this.appProduct);
  }
  saveOrUpdateAppProduct() {
    this.setModelFromForm(this.formGroup, this.appProduct);

    // form valid ?
    if (!this.isValidForm()) {
      this._notifyService.error(LanguageKeys.FORM_INVALID_MESSAGE);
      return;
    }

    // emin misin?
    var modal = this._modalService.confirmYesNo(
      this.isEditMode() ? "Ürün Güncelleme" : "Yeni Ürün",
      this.isEditMode()
        ? "Ürün güncellemek istediğinize emin misiniz?"
        : "Yeni ürün kaydı yapılacaktır. Onaylıyor musunuz?"
    );

    modal.onClosed.subscribe((reply) => {
      if (reply == NotifyConfirmType.Yes) {
        if (this.isEditMode()) this.updateAppProduct();
        else this.saveAppProduct();
      }
    });
  }
  // #endregion

  //  #region [ Validations ]
  isEditMode(): boolean {
    return this.appProduct && this.appProduct.id && this.appProduct.id > 0;
  }
  isValidForm(): boolean {
    return this.formGroup.valid;
  }

  // #endregion

  //  #region [ Internal ]
  initFormGroup() {
    this.formGroup = new FormGroup({
      id: new FormControl(this.appProduct.id),
      createDate: new FormControl(this.appProduct.createDate),
      createUserName: new FormControl(this.appProduct.createUserName),
      product: new FormControl(this.appProduct.product, [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
      description: new FormControl(this.appProduct.description),
      isActive: new FormControl(this.appProduct.isActive),
    });

    // koşullu validasyon.....
    // this.formGroup.get("useForVersion").valueChanges.subscribe((val) => {
    //   if (val) {
    //     this.formGroup.controls["snapshotName"].clearValidators();
    //   } else {
    //     this.formGroup.controls["snapshotName"].setValidators([
    //       Validators.required,
    //       this.noWhitespaceValidator,
    //     ]);
    //   }
    //   this.formGroup.controls["snapshotName"].updateValueAndValidity();
    // });
  }
  saveAppProduct() {
    this.saveApplicationFromAPI(this.appProduct);
  }
  updateAppProduct() {
    this.updateApplicationFromAPI(this.appProduct);
  }
  // #endregion
}
