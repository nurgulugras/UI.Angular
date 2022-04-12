import { EventEmitter, Injector, Output } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { NodeStatus } from "../../../models/entity/NodeStatus";
import { NodeStateType } from "../../../models/enums/NodeStateType.enum";
import { ResultType } from "../../../models/enums/ResultType.enum";
import { ComponentBase } from "../../../shared/components/component-base";
import { NodesService } from "../../../shared/services/nodes.service";

@Component({
  selector: "esa-node-list",
  templateUrl: "./node-list.component.html",
  styleUrls: ["./node-list.component.scss"],
})
export class NodeListComponent extends ComponentBase implements OnInit {
  //  #region [ Fields ]
  nodeStatuses: NodeStatus[];
  stateUI = NodeStateType;
  selectedNode: NodeStatus;
  @Output() onSelectedNodeChanged: EventEmitter<NodeStatus> =
    new EventEmitter();
  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector, private nodesService: NodesService) {
    super(injector);
  }
  ngOnInit() {
    this.getNodeStatusList();
  }
  // #endregion

  //  #region [ Entity ]
  private getNodesFromAPI(): void {
    this._isRunning = true;
    this.nodesService.getNodes().subscribe(
      (response) => {
        this._isRunning = false;
        if (response.resultType == ResultType.Success) {
          this.nodeStatuses = response.dataModel;
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        } else {
          this._notifyService.info("No node is available");
        }
      },
      (error) => {
        this._isRunning = false;
      }
    );
  }
  // #endregion

  //  #region [ UI Tools ]
  chanceSelected(nodeStatus: NodeStatus) {
    this.selectedNode = null;
    if (nodeStatus.status == NodeStateType.Disconnected) {
      this._notifyService.error(
        `The host named ${nodeStatus.node} is unreachable`
      );
    } else {
      this.selectedNode = nodeStatus;
    }
    this.onSelectedNodeChanged.emit(this.selectedNode);
  }
  refresh() {
    this.getNodeStatusList();
  }
  getStateImageClass(state: NodeStateType): string {
    if (state == NodeStateType.Connected) return "led green";
    if (state == NodeStateType.Disconnected) return "led red";
    return "led black";
  }
  with: number = 90;
  yap() {
    this.with = this.with - 10;
  }
  // #endregion

  //  #region [ Validations ]
  // #endregion

  //  #region [ Internal ]
  public getNodeStatusList() {
    this.getNodesFromAPI();
  }
  // #endregion
}
