import { NodeStatusChangeType } from '../enums/NodeStatusChangeType.enum';

export class NodeStatusChangesMessage {
    node: string;
    status: NodeStatusChangeType;
}