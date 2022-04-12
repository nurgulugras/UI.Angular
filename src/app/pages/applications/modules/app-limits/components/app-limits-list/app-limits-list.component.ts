import {
  Component,
  Injector,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { AppLimit } from "../../../../../../models/entity/AppLimit";
import { ComponentBase } from "../../../../../../shared/components/component-base";
import { Application } from "../../../../../../models/entity/Application";
import { AppLimitsService } from "../../../../../../shared/services/app-limits.service";
import { ResultType } from "../../../../../../models/enums/ResultType.enum";
import { ExporterOptions } from "../../../../../../models/internal/exporter-options";
import { ExportPropertyInfo } from "../../../../../../models/internal/ExportPropertyInfo";
import { DynamicModalService } from "../../../../../../shared/services/dynamic-modal.service";
import { AppLimitsAddOrUpdateComponent } from "../app-limits-add-or-update/app-limits-add-or-update.component";

@Component({
  selector: "alms-app-limits-list",
  templateUrl: "./app-limits-list.component.html",
  styleUrls: ["./app-limits-list.component.scss"],
})
export class AppLimitsListComponent
  extends ComponentBase
  implements OnInit, OnChanges
{
  //  #region [ Fields ]
  @Input() selectedApplication: Application;
  appLimits: AppLimit[] = [];
  // #endregion

  //  #region [ Initialize ]
  constructor(
    public injector: Injector,
    private appLimitsService: AppLimitsService,
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
      this.getLimitList(this.selectedApplication.id);
    }
  }

  ngOnInit() {}
  // #endregion

  //  #region [ Entity ]
  getAppLimitsFromAPI(appId: number) {
    this._isRunning = true;
    this.appLimitsService.getAppLimits(appId).subscribe((response) => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.appLimits = response.dataModel;
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    });
  }
  // #endregion

  //  #region [ UI Tools ]
  createNewAppLimit() {
    this.openCreateOrUpdateAppLimitComponent(null);
  }
  updateAppLimit(appLimit: AppLimit) {
    this.openCreateOrUpdateAppLimitComponent(appLimit);
  }

  openCreateOrUpdateAppLimitComponent(appLimit: AppLimit) {
    const popup = this.dynamicModalService.open<AppLimitsAddOrUpdateComponent>(
      AppLimitsAddOrUpdateComponent,
      appLimit == null ? "Yeni limit Oluştur" : "Limit Güncelleme",
      true,
      true,
      true
    );
    popup.instance.applicationId = this.selectedApplication.id;
    if (appLimit != null) popup.instance.setAppLimitToEdit(appLimit);
    popup.onClosed().subscribe((response) => {
      this.refresh();
    });
  }

  refresh() {
    if (this.selectedApplication && this.selectedApplication.id > 0)
      this.getLimitList(this.selectedApplication.id);
  }
  exportToExcel() {
    if (this.appLimits && this.appLimits.length > 0) {
      var opt = new ExporterOptions();
      opt.fileName = `uygulama-limit-listesi`;
      opt.headers = [
        new ExportPropertyInfo("limit", "Limit"),
        new ExportPropertyInfo("description", "Açıklama"),
        new ExportPropertyInfo("isActive", "Aktif Mi?"),
      ];
      opt.isAutoColumn = true;
      opt.skipHeader = false;
      this._exporterService.exportToExcelFromJson(this.appLimits, opt);
    }
  }
  // #endregion

  //  #region [ Validations ]
  // #endregion

  //  #region [ Internal ]
  getLimitList(appId: number) {
    this.clearDataSource();
    this.getAppLimitsFromAPI(appId);
  }
  clearDataSource() {
    this.appLimits = [];
  }
  // #endregion
}
