import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { Application } from "../../../../models/entity/Application";
import { ResultType } from "../../../../models/enums/ResultType.enum";
import { ComponentBase } from "../../../../shared/components/component-base";
import { ApplicationsService } from "../../../../shared/services/applications.service";
import { DynamicModalService } from "../../../../shared/services/dynamic-modal.service";
import { ApplicationAddComponent } from "../application-add/application-add.component";

@Component({
  selector: "alms-application-list",
  templateUrl: "./application-list.component.html",
  styleUrls: ["./application-list.component.scss"],
})
export class ApplicationListComponent extends ComponentBase implements OnInit {
  //  #region [ Fields ]

  applications: Application[] = [];
  selectedApplication: Application = new Application();
  _isRunning: boolean;
  @Output() onSelectedValueChanged: EventEmitter<Application> =
    new EventEmitter();
  // #endregion

  //  #region [ Initialize ]
  constructor(
    public injector: Injector,
    private applicationsService: ApplicationsService,
    private dynamicModalService: DynamicModalService
  ) {
    super(injector);
  }
  ngOnInit() {
    this.getApplicationList();
  }
  // #endregion

  //  #region [ Entity ]

  getApplicationsFromAPI() {
    this._isRunning = true;
    this.applicationsService.getApplications().subscribe((response) => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.applications = response.dataModel;
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    });
  }

  // #endregion

  //  #region [ UI Tools ]
  refresh() {
    this.getApplicationList();
  }
  addNewApplication() {
    this.openNewApplicationComponent();
  }
  selectedApplicationChanged(application: Application) {
    this.selectedApplication = application;
    this.onSelectedValueChanged.emit(application);
  }
  // #endregion

  //  #region [ Validations ]
  // #endregion

  //  #region [ Internal ]
  getApplicationList() {
    this.getApplicationsFromAPI();
  }
  openNewApplicationComponent() {
    const popup = this.dynamicModalService.open<ApplicationAddComponent>(
      ApplicationAddComponent,
      "Yeni Uygulama",
      true,
      true,
      false
    );
    popup.onClosed().subscribe((response) => {
      this.refresh();
    });
  }
  // #endregion
}
