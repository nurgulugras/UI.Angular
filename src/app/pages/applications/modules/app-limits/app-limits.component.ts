import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Application } from '../../../../models/entity/Application';
import { ComponentBase } from '../../../../shared/components/component-base';

@Component({
  selector: 'alms-app-limits',
  templateUrl: './app-limits.component.html',
  styleUrls: ['./app-limits.component.scss']
})
export class AppLimitsComponent
extends ComponentBase
 implements OnInit,OnChanges {

   //  #region [ Fields ]
   @Input() selectedApplication: Application;
   // #endregion
 
   //  #region [ Initialize ]
   constructor(public injetor: Injector) {
     super(injetor);
   }
   ngOnChanges(changes: SimpleChanges): void {}
   ngOnInit() {}
   // #endregion
 
   //  #region [ Entity ]
   // #endregion
 
   //  #region [ UI Tools ]
   // #endregion
 
   //  #region [ Validations ]
   // #endregion
 
   //  #region [ Internal ]
   // #endregion

}
