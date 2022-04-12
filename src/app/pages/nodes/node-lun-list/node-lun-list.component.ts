import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { NodeStatus } from "../../../models/entity/NodeStatus";
import { ResultType } from "../../../models/enums/ResultType.enum";
import { LunsService } from "../../../shared/services/luns.service";
import { DiskInfo } from "../../../models/enums/DiskInfo";
import { ComponentBase } from "../../../shared/components/component-base";
import { Injector } from "@angular/core";

@Component({
  selector: "esa-node-lun-list",
  templateUrl: "./node-lun-list.component.html",
  styleUrls: ["./node-lun-list.component.scss"],
})
export class NodeLunListComponent
  extends ComponentBase
  implements OnInit, OnChanges
{
  //  #region [ Fields ]
  @Input() selectedNode: NodeStatus;
  diskInfos: DiskInfo[];
  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector, private lunsService: LunsService) {
    super(injector);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isValid()) this.getLuns();
  }
  ngOnInit() {}
  // #endregion

  //  #region [ Entity ]
  private getLunsOfNodeFromAPI(node: string): void {
    this._isRunning = true;
    this.lunsService.getLunsOfNode(node).subscribe(
      (response) => {
        this._isRunning = false;
        this.diskInfos = [];
        if (response.resultType == ResultType.Success) {
          this.diskInfos = response.dataModel;
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        } else {
          this._notifyService.info("No lun is available");
        }
      },
      (error) => {
        this._isRunning = false;
      }
    );
  }
  // #endregion

  //  #region [ UI Tools ]
  getCardTitle(): string {
    return this.selectedNode && this.selectedNode.node
      ? ` / ${this.selectedNode.node}`
      : "";
  }
  refresh() {
    this.getLuns();
  }
  getPercentage(e: string): string {
    return !e ? "" : e.replace("%", "");
  }
  // #endregion

  //  #region [ Validations ]
  isValid(): boolean {
    return (
      this.selectedNode &&
      this.selectedNode.node &&
      this.selectedNode.node.trim().length > 0
    );
  }
  // #endregion

  //  #region [ Internal ]
  getLuns() {
    if (!this.isValid()) {
      this._notifyService.error(
        "No node have been selected. Select a node before continuing."
      );
      return;
    }
    this.getLunsOfNodeFromAPI(this.selectedNode.node);
  }
  // #endregion
}
