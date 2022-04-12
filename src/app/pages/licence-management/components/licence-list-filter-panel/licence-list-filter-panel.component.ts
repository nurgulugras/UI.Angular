import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { LicenceFilterCriteriaParametters } from '../../../../models/api/LicenceFilterCriteriaParametters';
import { Application } from '../../../../models/entity/Application';
import { Company } from '../../../../models/entity/Company';
import { Licence } from '../../../../models/entity/Licence';
import { ResultType } from '../../../../models/enums/ResultType.enum';
import { ComponentBase } from '../../../../shared/components/component-base';
import { ApplicationsService } from '../../../../shared/services/applications.service';
import { CompaniesService } from '../../../../shared/services/companies.service';

@Component({
  selector: 'alms-licence-list-filter-panel',
  templateUrl: './licence-list-filter-panel.component.html',
  styleUrls: ['./licence-list-filter-panel.component.scss']
})
export class LicenceListFilterPanelComponent extends ComponentBase implements OnInit {
 
  licenceFilterCriteriaParametters:LicenceFilterCriteriaParametters=new LicenceFilterCriteriaParametters();
  //  #region [ Fields ]
  companies:Company[]=[];
  applications:Application[]=[];
  @Output() onSearchButtonClick: EventEmitter<LicenceFilterCriteriaParametters> =new EventEmitter();
  // #endregion

  //  #region [ Initialize ]
  constructor(public injector:Injector,private companiesService:CompaniesService,private applicationsService:ApplicationsService) {
    super(injector);
  }

  ngOnInit() {
    this.getCompanies();
    this.getApplications();
  }
  // #endregion

  //  #region [ Entity ]
  getCompaniesFromAPI() {
    this._isRunning = true;
    this.companiesService.getActiveCompanies().subscribe((response) => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.companies = response.dataModel;
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    });
  }
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
  onSubmitButton() {
    this.onSearchButtonClick.emit(this.licenceFilterCriteriaParametters);
  }
  // #endregion

  //  #region [ Validations ]
  // #endregion

  //  #region [ Internal ]
  getCompanies(){
    this.getCompaniesFromAPI();
  }
  getApplications(){
    this.getApplicationsFromAPI();
  }
  // #endregion
  

}
