import { Component, Injector, OnInit } from '@angular/core';
import { Application } from '../../../../models/entity/Application';
import { ResultType } from '../../../../models/enums/ResultType.enum';
import { LanguageKeys } from '../../../../models/internal/language-keys';
import { ComponentBase } from '../../../../shared/components/component-base';
import { AppLimitsService } from '../../../../shared/services/app-limits.service';
import { ApplicationsService } from '../../../../shared/services/applications.service';
import { DynamicModalService } from '../../../../shared/services/dynamic-modal.service';

@Component({
  selector: 'alms-applicaation-key-info',
  templateUrl: './applicaation-key-info.component.html',
  styleUrls: ['./applicaation-key-info.component.scss']
})
export class ApplicaationKeyInfoComponent extends ComponentBase implements OnInit {
 //  #region [ Fields ]
 applicationId:number;
 application:Application = new Application();
  // #endregion

  //  #region [ Initialize ]
  constructor(public injector:Injector,private applicationService: ApplicationsService ) {
    super(injector);

  }

  ngOnInit() {
    this.getApplicationByIdFromAPI();
  }
  // #endregion
  

  //  #region [ Entity ]
  getApplicationByIdFromAPI() {
    this.applicationService.getApplicationById(this.applicationId)
      .subscribe((response) => {
        if (response.resultType == ResultType.Success) {
          this.application=response.dataModel;
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        }
      });
  }
  // #endregion

  //  #region [ UI Tools ]
 
  // #endregion

  //  #region [ Validations ]
  // #endregion

  //  #region [ Internal ]
  // #endregion
 

}
