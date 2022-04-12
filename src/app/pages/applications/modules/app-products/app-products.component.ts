import {
  Component,
  Injector,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { Application } from "../../../../models/entity/Application";
import { ResultType } from "../../../../models/enums/ResultType.enum";
import { ComponentBase } from "../../../../shared/components/component-base";
import { AppProductsService } from "../../../../shared/services/app-products.service";

@Component({
  selector: "alms-app-products",
  templateUrl: "./app-products.component.html",
  styleUrls: ["./app-products.component.scss"],
})
export class AppProductsComponent
  extends ComponentBase
  implements OnInit, OnChanges
{
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
