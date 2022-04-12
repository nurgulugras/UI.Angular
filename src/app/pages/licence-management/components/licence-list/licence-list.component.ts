import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { filter } from 'rxjs/operators';
import { LicenceFilterCriteriaParametters } from '../../../../models/api/LicenceFilterCriteriaParametters';
import { Application } from '../../../../models/entity/Application';
import { Licence } from '../../../../models/entity/Licence';
import { ResultType } from '../../../../models/enums/ResultType.enum';
import { ComponentBase } from '../../../../shared/components/component-base';
import { LicenceService } from '../../../../shared/services/licence.service';

@Component({
  selector: 'alms-licence-list',
  templateUrl: './licence-list.component.html',
  styleUrls: ['./licence-list.component.scss']
})
export class LicenceListComponent extends ComponentBase implements OnInit {

  //  #region [ Fields ]
 licences: Licence[] = [];
 selectedLicence:Licence=new Licence();
 filter:LicenceFilterCriteriaParametters=new LicenceFilterCriteriaParametters();
  // #endregion

  //  #region [ Initialize ]
  constructor(public injector:Injector,private licencesService:LicenceService) {
    super(injector);
    licencesService.onLicenceDataSourceChanged.subscribe(() =>{
      this.refresh(this.filter);
    })
    
  }

  ngOnInit() {
  }
  // #endregion

  //  #region [ Entity ]
  getLicencesFromAPI(filter:LicenceFilterCriteriaParametters) {
     this._isRunning = true;
    this.licencesService.getlicencesByFilter(filter).subscribe((response) => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.licences = response.dataModel;
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    });
  }

  // #endregion

  //  #region [ UI Tools ]
  getLicenceByFilter(filter:LicenceFilterCriteriaParametters){
    this.filter=filter;
    this.getLicencesFromAPI(this.filter);
  }

  selectedLicenceChanged(licence: Licence) {
    this.licencesService.onSelectedLicenceChanged.emit(licence);
    this.selectedLicence = licence;
  }
  refresh(filter:LicenceFilterCriteriaParametters) {
    
      this.getLicenceByFilter(filter);
  }
  
  // #endregion

  //  #region [ Validations ]
  // #endregion

  //  #region [ Internal ]
 
  // #endregion

  

}

