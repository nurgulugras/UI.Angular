import { Component, OnInit } from '@angular/core';
import { NodeStatus } from '../../models/entity/NodeStatus';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss']
})
export class NodesComponent implements OnInit {
  selectedNode: NodeStatus;
  constructor(private router: Router) {
    this.getStateValue();
  }
  ngOnInit() { }
  selectedNodeChanged(nodeStatus: NodeStatus) {
    this.selectedNode = nodeStatus;
  }
  getStateValue() {
    var navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state && navigation.extras.state.nodeStatus) {
      this.selectedNodeChanged(navigation.extras.state.nodeStatus);
    }
  }
}