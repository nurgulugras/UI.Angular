import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseParameter } from '../../models/api/ApiResponseParameter';
import { Node } from '../../models/entity/Node';
import { NodeStatus } from '../../models/entity/NodeStatus';
import { BaseService } from './BaseService';
import { KeyValue } from '@angular/common';
import { HealthCheckStatus } from '../../models/entity/HealthCheckStatus';

@Injectable({
  providedIn: 'root'
})
export class NodesService extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }


  public getNodes(): Observable<ApiResponseParameter<NodeStatus[]>> {
    var uri = `/v1/cluster/nodes`;
    return this.getBase(uri);
  }
  public getNodeInfo(node: string): Observable<ApiResponseParameter<KeyValue<string, string>[]>> {
    var uri = `/v1/cluster/nodes/info?node=` + node;
    return this.getBase(uri);
  }
  public getNodeHealthCheckList(node: string): Observable<ApiResponseParameter<HealthCheckStatus[]>> {
    var uri = `/v1/cluster/nodes/status?node=` + node;
    return this.getBase(uri);
  }
  public runNodeHealthCheckListToAllNodes(): Observable<ApiResponseParameter<boolean>> {
    var uri = `/v1/cluster/nodes/all/health-check`;
    return this.postBase(uri, null);
  }
  public getBaseNode(): Observable<ApiResponseParameter<Node>> {
    var uri = `/v1/cluster/nodes/entity/base`;
    return this.getBase(uri);
  }
  public getEntityNodes(): Observable<ApiResponseParameter<Node[]>> {
    var uri = `/v1/cluster/nodes/entity`;
    return this.getBase(uri);
  }
  public saveEntityNode(node: Node): Observable<ApiResponseParameter<Node>> {
    var uri = `/v1/cluster/nodes/entity`;
    return this.postBase(uri, node);
  }
  public updateEntityNode(nodeId: number, node: Node): Observable<ApiResponseParameter<Node>> {
    var uri = `/v1/cluster/nodes/entity/` + nodeId;
    return this.putBase(uri, node);
  }
  public deleteEntityNode(nodeId: number): Observable<ApiResponseParameter<boolean>> {
    var uri = `/v1/cluster/nodes/entity/` + nodeId;
    return this.deleteBase(uri);
  }
}
