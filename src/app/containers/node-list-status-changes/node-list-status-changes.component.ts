import { Component, OnInit, Injector } from "@angular/core";
import { ComponentBase } from "../../shared/components/component-base";
import { NodesService } from "../../shared/services/nodes.service";
import { ResultType } from "../../models/enums/ResultType.enum";
import { NodeSeverityStatus } from "../../models/internal/NodeSeverityStatus";
import { NodeStateType } from "../../models/enums/NodeStateType.enum";
import { SeverityType } from "../../models/enums/SeverityType.enum";
import { Router } from "@angular/router";
import { NodeStatus } from "../../models/entity/NodeStatus";
import { SignalrNodeStatusChangesHubService } from "../../shared/services/signalr-hub/signalr-node-status-changes-hub.service";
import { NodeStatusChangeType } from "../../models/enums/NodeStatusChangeType.enum";

@Component({
  selector: "esa-node-list-status-changes",
  templateUrl: "./node-list-status-changes.component.html",
  styleUrls: ["./node-list-status-changes.component.scss"],
})
export class NodeListStatusChangesComponent
  extends ComponentBase
  implements OnInit
{
  //  #region [ Fields ]
  nodeSeverityStatusList: NodeSeverityStatus[] = [];
  nodeStatusList: NodeStatus[] = [];
  // #endregion

  //  #region [ Initialize ]
  constructor(
    public injector: Injector,
    private nodesService: NodesService,
    private router: Router,
    private nodeStatusChangesHubService: SignalrNodeStatusChangesHubService
  ) {
    super(injector);
  }
  ngOnInit() {
    this.nodeStatusChangesHubService
      .getNodeStatusChanges()
      .subscribe(this.listenToChangesHub.bind(this));
    this.getNodesFromAPI();
  }

  // #endregion

  //  #region [ Entity ]
  private getNodesFromAPI(): void {
    this.nodeStatusList = null;
    this.nodesService.getNodes().subscribe((response) => {
      if (response.resultType == ResultType.Success) {
        this.nodeStatusList = response.dataModel;
        this.nodeSeverityStatusList = response.dataModel.map((item) => {
          var nodeSeverityStatus = new NodeSeverityStatus();
          nodeSeverityStatus.node = item.node;
          nodeSeverityStatus.status =
            item.status == NodeStateType.Connected
              ? NodeStatusChangeType.Success
              : NodeStatusChangeType.Fail;

          return nodeSeverityStatus;
        });
      }
    });
  }
  private runNodeHealthCheckListFromAPI(): void {
    this._isRunning = true;
    this.nodesService.runNodeHealthCheckListToAllNodes().subscribe(
      (response) => {
        this._isRunning = false;
        if (response.resultType == ResultType.Success) {
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        }
      },
      (error) => {
        this._isRunning = false;
      }
    );
  }
  // #endregion

  //  #region [ UI Tools ]
  getStatusImage(nodeSeverityStatus: NodeSeverityStatus): string {
    if (nodeSeverityStatus.status == NodeStatusChangeType.Success)
      return "green.png";
    if (nodeSeverityStatus.status == NodeStatusChangeType.Warning)
      return "yellow.png";
    return "red.png";
  }
  goToNodeDetail(nodeSeverityStatus: NodeSeverityStatus): void {
    var nodeStatus = this.nodeStatusList.find(
      (x) => x.node == nodeSeverityStatus.node
    );
    this.router.navigate(["/nodes"], {
      state: { nodeStatus: nodeStatus },
    });
  }
  refresh() {
    this.runNodeHealthCheckListFromAPI();
  }
  // #endregion

  //  #region [ Validations ]
  // #endregion

  //  #region [ Internal ]

  listenToChangesHub(message) {
    if (!message) return;
    this.changeStatusOfNode(message);
  }
  changeStatusOfNode(nodeSeverityStatus: NodeSeverityStatus) {
    var existsNodeStatus = this.nodeSeverityStatusList.find(
      (x) => x.node == nodeSeverityStatus.node
    );
    if (!existsNodeStatus) return;
    this.pushNotifyToChangesStatusOfNode(
      nodeSeverityStatus.node,
      existsNodeStatus.status,
      nodeSeverityStatus.status
    );
    existsNodeStatus.status = nodeSeverityStatus.status;
  }
  pushNotifyToChangesStatusOfNode(
    node: string,
    oldStatus: NodeStatusChangeType,
    newStatus: NodeStatusChangeType
  ) {
    if (oldStatus == newStatus) return;
    var message = `'${node}' node status changed to ${newStatus}`;
    if (newStatus == NodeStatusChangeType.Success)
      this._notifyService.success(message);
    if (newStatus == NodeStatusChangeType.Warning)
      this._notifyService.warning(message);
    if (newStatus == NodeStatusChangeType.Fail)
      this._notifyService.error(message);
  }

  // #endregion
}
