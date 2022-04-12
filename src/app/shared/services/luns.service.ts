import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseParameter } from '../../models/api/ApiResponseParameter';
import { DiskInfo } from '../../models/enums/DiskInfo';
import { BaseService } from './BaseService';

@Injectable({
  providedIn: 'root'
})
export class LunsService extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }

  public getLunsOfNode(node: string): Observable<ApiResponseParameter<DiskInfo[]>> {
    var uri = `/v1/cluster/nodes/luns?node=` + node;
    return this.getBase(uri);
  }

}
