import { Component, OnInit, ViewChild } from "@angular/core";
import { Application } from "../../models/entity/Application";
import { ApplicationListComponent } from "./components/application-list/application-list.component";

@Component({
  selector: "esa-applications",
  templateUrl: "./applications.component.html",
  styleUrls: ["./applications.component.scss"],
})
export class ApplicationsComponent implements OnInit {
  //  #region [ Fields ]
  @ViewChild(ApplicationListComponent)
  applicationListComponent: ApplicationListComponent;
  selectedApplication: Application;
  // #endregion

  //  #region [ Initialize ]
  constructor() {}
  ngOnInit() {}
  // #endregion

  //  #region [ Entity ]
  // #endregion

  //  #region [ UI Tools ]
  onSelectedApplicationChanged(application: Application) {
    this.selectedApplication = application;
  }
  refreshAppList() {
    this.applicationListComponent.refresh();
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
