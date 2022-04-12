import {
  Component,
  Injector,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { AppProduct } from "../../../../../../models/entity/AppProduct";
import { ComponentBase } from "../../../../../../shared/components/component-base";
import { Application } from "../../../../../../models/entity/Application";
import { AppProductsService } from "../../../../../../shared/services/app-products.service";
import { ResultType } from "../../../../../../models/enums/ResultType.enum";
import { ExporterOptions } from "../../../../../../models/internal/exporter-options";
import { ExportPropertyInfo } from "../../../../../../models/internal/ExportPropertyInfo";
import { DynamicModalService } from "../../../../../../shared/services/dynamic-modal.service";
import { AppProductAddOrUpdateComponent } from "../app-product-add-or-update/app-product-add-or-update.component";

@Component({
  selector: "alms-app-product-list",
  templateUrl: "./app-product-list.component.html",
  styleUrls: ["./app-product-list.component.scss"],
})
export class AppProductListComponent
  extends ComponentBase
  implements OnInit, OnChanges
{
  //  #region [ Fields ]
  @Input() selectedApplication: Application;
  appProducts: AppProduct[] = [];
  // #endregion

  //  #region [ Initialize ]
  constructor(
    public injector: Injector,
    private appProductsService: AppProductsService,
    private dynamicModalService: DynamicModalService
  ) {
    super(injector);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.selectedApplication &&
      changes.selectedApplication.currentValue &&
      changes.selectedApplication.currentValue.id > 0
    ) {
      this.getProductList(this.selectedApplication.id);
    }
  }

  ngOnInit() {}
  // #endregion

  //  #region [ Entity ]
  getAppProductsFromAPI(appId: number) {
    this._isRunning = true;
    this.appProductsService.getAppProducts(appId).subscribe((response) => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.appProducts = response.dataModel;
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    });
  }
  // #endregion

  //  #region [ UI Tools ]
  createNewAppProduct() {
    this.openCreateOrUpdateAppProductComponent(null);
  }
  updateAppProduct(appProduct: AppProduct) {
    this.openCreateOrUpdateAppProductComponent(appProduct);
  }

  openCreateOrUpdateAppProductComponent(appProduct: AppProduct) {
    const popup = this.dynamicModalService.open<AppProductAddOrUpdateComponent>(
      AppProductAddOrUpdateComponent,
      appProduct == null ? "Yeni Ürün Oluştur" : "Ürün Güncelleme",
      true,
      true,
      true
    );
    popup.instance.applicationId = this.selectedApplication.id;
    if (appProduct != null) popup.instance.setAppProductToEdit(appProduct);
    popup.onClosed().subscribe((response) => {
      this.refresh();
    });
  }

  refresh() {
    if (this.selectedApplication && this.selectedApplication.id > 0)
      this.getProductList(this.selectedApplication.id);
  }
  exportToExcel() {
    if (this.appProducts && this.appProducts.length > 0) {
      var opt = new ExporterOptions();
      opt.fileName = `uygulama-urun-listesi`;
      opt.headers = [
        new ExportPropertyInfo("product", "Ürün"),
        new ExportPropertyInfo("description", "Açıklama"),
        new ExportPropertyInfo("isActive", "Aktif Mi?"),
      ];
      opt.isAutoColumn = true;
      opt.skipHeader = false;
      this._exporterService.exportToExcelFromJson(this.appProducts, opt);
    }
  }
  // #endregion

  //  #region [ Validations ]
  // #endregion

  //  #region [ Internal ]
  getProductList(appId: number) {
    this.clearDataSource();
    this.getAppProductsFromAPI(appId);
  }
  clearDataSource() {
    this.appProducts = [];
  }
  // #endregion
}
