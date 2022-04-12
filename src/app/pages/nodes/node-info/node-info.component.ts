import { Component, Input, OnInit, Injector, OnChanges } from "@angular/core";
import { NodeStatus } from "../../../models/entity/NodeStatus";
import { NodesService } from "../../../shared/services/nodes.service";
import { ResultType } from "../../../models/enums/ResultType.enum";
import { ComponentBase } from "../../../shared/components/component-base";
import { KeyValue } from "@angular/common";
import { MenuItem } from "primeng/api/menuitem";

@Component({
  selector: "esa-node-info",
  templateUrl: "./node-info.component.html",
  styleUrls: ["./node-info.component.scss"],
})
export class NodeInfoComponent
  extends ComponentBase
  implements OnInit, OnChanges
{
  //  #region [ Fields ]
  @Input() selectedNode: NodeStatus;
  nodeInfos: KeyValue<string, string>[] = [];
  selectedProduct: any;
  items: MenuItem[];
  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector, private nodesService: NodesService) {
    super(injector);
    this.loadMenuItems();
  }
  ngOnInit() {}
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.getNodeInfo();
  }
  // #endregion

  //  #region [ Entity ]

  private getNodeInfoFromAPI(node: string): void {
    this._isRunning = true;
    this.nodesService.getNodeInfo(node).subscribe(
      (response) => {
        this._isRunning = false;
        this.nodeInfos = null;
        if (response.resultType == ResultType.Success) {
          this.nodeInfos = response.dataModel;
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
  getCardTitle(): string {
    return this.selectedNode && this.selectedNode.node
      ? ` / ${this.selectedNode.node}`
      : "";
  }
  refresh() {
    this.getNodeInfo();
  }
  // #endregion

  //  #region [ Validations ]
  // #endregion

  //  #region [ Internal ]
  getNodeInfo() {
    if (this.selectedNode && this.selectedNode.node)
      this.getNodeInfoFromAPI(this.selectedNode.node);
  }
  loadMenuItems() {
    this.items = [
      {
        label: "Refresh",
        icon: "pi pi-fw pi-search",
        command: () => this.refresh(),
      },
    ];
  }
  // #endregion
}
