import { Component, OnInit, OnChanges, Input, Injector } from "@angular/core";
import { ComponentBase } from "../../../shared/components/component-base";
import { NodeStatus } from "../../../models/entity/NodeStatus";
import { HealthCheckStatus } from "../../../models/entity/HealthCheckStatus";
import { NodesService } from "../../../shared/services/nodes.service";
import { ResultType } from "../../../models/enums/ResultType.enum";
import { SeverityType } from "../../../models/enums/SeverityType.enum";

@Component({
  selector: "esa-node-status",
  templateUrl: "./node-status.component.html",
  styleUrls: ["./node-status.component.scss"],
})
export class NodeStatusComponent
  extends ComponentBase
  implements OnInit, OnChanges
{
  //  #region [ Fields ]
  @Input() selectedNode: NodeStatus;
  healthCheckListOfNode: HealthCheckStatus[] = [];
  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector, private nodesService: NodesService) {
    super(injector);
  }
  ngOnInit() {}
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.getNodeInfos();
  }
  // #endregion

  //  #region [ Entity ]
  private getNodeHealthCheckListFromAPI(node: string): void {
    this._isRunning = true;
    this.nodesService.getNodeHealthCheckList(node).subscribe(
      (response) => {
        this._isRunning = false;
        this.healthCheckListOfNode = [];
        if (response.resultType == ResultType.Success) {
          this.healthCheckListOfNode = response.dataModel;
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        }
      },
      (error) => {
        this._isRunning = false;
        this.healthCheckListOfNode = [];
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
  public getSeverityTypeIcon(severityType: SeverityType): string {
    switch (severityType) {
      case SeverityType.Warning:
        return "severity-warning.png";
      case SeverityType.Critical:
        return "severity-critical.png";
      case SeverityType.Error:
        return "severity-error.png";
      default:
        return "severity-success.png";
    }
  }
  refresh() {
    this.getNodeInfos();
  }
  // #endregion

  //  #region [ Validations ]
  // #endregion

  //  #region [ Internal ]
  getNodeInfos() {
    if (this.selectedNode && this.selectedNode.node) {
      this.getNodeHealthCheckListFromAPI(this.selectedNode.node);
    }
  }
  // #endregion
}
