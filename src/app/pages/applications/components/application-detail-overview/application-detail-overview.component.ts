import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Application } from "../../../../models/entity/Application";
import { ComponentBase } from "../../../../shared/components/component-base";
import { DynamicModalService } from "../../../../shared/services/dynamic-modal.service";
import { ApplicaationKeyInfoComponent } from "../applicaation-key-info/applicaation-key-info.component";
import { ApplicationDetailOrUpdateComponent } from "../application-detail-or-update/application-detail-or-update.component";
@Component({
  selector: "alms-application-detail-overview",
  templateUrl: "./application-detail-overview.component.html",
  styleUrls: ["./application-detail-overview.component.scss"],
})
export class ApplicationDetailOverviewComponent
  extends ComponentBase
  implements OnInit
{
  //  #region [ Fields ]
  @Input() selectedApplication: Application;
  @Output() onUpdateApplication: EventEmitter<Application> = new EventEmitter();
  @ViewChild(ApplicationDetailOrUpdateComponent)
  applicationUpdateComponent: ApplicationDetailOrUpdateComponent;
  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector,private dynamicModalService:DynamicModalService) {
    super(injector);
  }
  ngOnInit() {}
  // #endregion

  //  #region [ Entity ]

  // #endregion

  //  #region [ UI Tools ]
  getTitle(): string {
    return this.isEditMode() ? this.selectedApplication.name : "Uygulama";
  }
  update(): void {
    this.applicationUpdateComponent.update();
  }
  applicationUpdated(application: Application) {
    this.selectedApplication = application;
    this.onUpdateApplication.emit(application);
  }
  openAppKeyInfoComponent() {
    const popup = this.dynamicModalService.open<ApplicaationKeyInfoComponent>(
      ApplicaationKeyInfoComponent,
     "Key Bilgisi",
      true,
      true,
      true
    );
    popup.instance.applicationId = this.selectedApplication.id;
  }
  // #endregion

  //  #region [ Validations ]
  isEditMode(): boolean {
    return (
      this.selectedApplication &&
      this.selectedApplication.id &&
      this.selectedApplication.id > 0
    );
  }
  // #endregion

  //  #region [ Internal ]
  // #endregion
}
