import { NodeStateType } from "../enums/NodeStateType.enum";
export class NodeStatus {
  UUID: string;
  node: string;
  status: NodeStateType;
}
