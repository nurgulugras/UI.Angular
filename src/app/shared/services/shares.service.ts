import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseParameter } from '../../models/api/ApiResponseParameter';
import { Sharing } from '../../models/entity/Sharing';
import { BaseService } from './BaseService';
import { ResultType } from '../../models/enums/ResultType.enum';
import { tap } from 'rxjs/operators';
import { DeleteSharingParameter } from '../../models/api/DeleteSharingParameter';
import { SharingParameters } from '../../models/parameters/SharingParameters';
import { DirectoryInfoRequestParameter } from '../../models/api/DirectoryInfoRequestParameter';
import { DirectoryInfo } from '../../models/entity/Directory/DirectoryInfo';

@Injectable({
  providedIn: 'root'
})
export class SharesService extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }
  public getSharingList(): Observable<ApiResponseParameter<Sharing[]>> {
    var uri = "/v1/cluster/volumes/shares";
    return this.getBase(uri).pipe(
      tap(response => {
        var apiResponse: ApiResponseParameter<Sharing[]> = response;
        if (apiResponse.resultType == ResultType.Success) {
          apiResponse.dataModel.sort(this.orderByAsc);
        }
      })
    );
  }
  public createSharing(sharing: Sharing): Observable<ApiResponseParameter<Sharing>> {
    var uri = "/v1/cluster/volumes/shares";
    return this.postBase(uri, sharing);
  }
  public updateSharing(sharing: Sharing): Observable<ApiResponseParameter<Sharing>> {
    var uri = "/v1/cluster/volumes/shares";
    return this.putBase(uri, sharing);
  }
  public deleteSharing(deleteSharingParameter: DeleteSharingParameter): Observable<ApiResponseParameter<boolean>> {
    var uri = "/v1/cluster/volumes/shares";
    return this.deleteBase(uri, deleteSharingParameter);
  }
  public getSharingParameters(): Observable<ApiResponseParameter<SharingParameters>> {
    var uri = "/v1/cluster/volumes/shares/parameters";
    return this.getBase(uri);
  }

  public getDirectoryInfo(volume: string, directory: string): Observable<ApiResponseParameter<DirectoryInfo>> {
    var parameter = new DirectoryInfoRequestParameter();
    parameter.volume = volume;
    parameter.directoryPath = directory;
    var uri = "/v1/cluster/volumes/shares/directories";
    return this.postBase(uri, parameter);
  }
  orderByAsc(item1: Sharing, item2: Sharing) {
    return item1.folderName.localeCompare(item2.folderName);
  }
}
