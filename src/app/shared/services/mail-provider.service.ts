import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseParameter } from '../../models/api/ApiResponseParameter';
import { MailProvider } from '../../models/entity/MailProvider';
import { BaseService } from './BaseService';
import { MailTestRequestModel } from '../../models/api/MailTestRequestModel';

@Injectable({
  providedIn: 'root'
})
export class MailProviderService extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);
  }

  public getMailProvider(): Observable<ApiResponseParameter<MailProvider>> {
    var uri = `/v1/mail-providers`;
    return this.getBase(uri);
  }
  public saveMailProvider(mailProvider: MailProvider): Observable<ApiResponseParameter<boolean>> {
    var uri = `/v1/mail-providers`;
    return this.postBase(uri, mailProvider);
  }
  public updateMailProvider(mailProvider: MailProvider): Observable<ApiResponseParameter<boolean>> {
    var uri = `/v1/mail-providers/` + mailProvider.id;
    return this.putBase(uri, mailProvider);
  }
  public deleteMailProvider(mailProvider: MailProvider): Observable<ApiResponseParameter<boolean>> {
    var uri = `/v1/mail-providers/` + mailProvider.id;
    return this.deleteBase(uri);
  }
  public sendTestMail(mailTestRequestModel: MailTestRequestModel): Observable<ApiResponseParameter<boolean>> {
    var uri = `/v1/mail-providers/test`;
    return this.postBase(uri, mailTestRequestModel);
  }
}
