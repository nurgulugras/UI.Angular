import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Licence } from '../../../../models/entity/Licence';
import { Session } from '../../../../models/entity/Session';
import { NotifyConfirmType } from '../../../../models/enums/NotifyConfirmType.enum';
import { ResultType } from '../../../../models/enums/ResultType.enum';
import { ExporterOptions } from '../../../../models/internal/exporter-options';
import { ExportPropertyInfo } from '../../../../models/internal/ExportPropertyInfo';
import { LanguageKeys } from '../../../../models/internal/language-keys';
import { ComponentBase } from '../../../../shared/components/component-base';
import { LicenceService } from '../../../../shared/services/licence.service';
import { SessionService } from '../../../../shared/services/session.service';

@Component({
  selector: 'alms-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.scss']
})
export class SessionListComponent extends ComponentBase implements OnInit {
  //  #region [ Fields ]
  selectedLicense:Licence;
  sessions:Session[]=[];
   // #endregion
 
   //  #region [ Initialize ]
   constructor(public injector:Injector,private licenseService: LicenceService,private sessionService: SessionService ) {
     super(injector);
 
   }
 
   ngOnInit() {
    this.getSessionList(this.selectedLicense.id);
   }
   // #endregion
   
 
   //  #region [ Entity ]
   getSessionsFromAPI(license:number) {
     this.sessionService.getSessions(license)
       .subscribe((response) => {
         if (response.resultType == ResultType.Success) {
           this.sessions=response.dataModel;
         } else if (response.resultType == ResultType.Fail) {
           this._notifyService.error(response.message);
         }
       });
   }
   deleteSessionsFromAPI(license:number) {
    this.sessionService.deleteSession(license)
      .subscribe((response) => {
        if (response.resultType == ResultType.Success) {
          this._notifyService.success(LanguageKeys.ROW_DELETED);
        } else if (response.resultType == ResultType.Fail) {
          this._notifyService.error(response.message);
        }
      });
  }
   // #endregion
 
   //  #region [ UI Tools ]
   refresh() {
    if (this.selectedLicense && this.selectedLicense.id > 0)
      this.getSessionList(this.selectedLicense.id);
  }
  exportToExcel() {
    if (this.sessions && this.sessions.length > 0) {
      var opt = new ExporterOptions();
      opt.fileName = `oturum-bilgisi-listesi`;
      opt.headers = [
        new ExportPropertyInfo("Olusturma Tarihi", "Olusturma Tarihi"),
        new ExportPropertyInfo("Kullanici Adi", "Kullanici Adi"),
        new ExportPropertyInfo("Son Aktivite Tarihi", "Son Aktivite Tarihi"),
      ];
      opt.isAutoColumn = true;
      opt.skipHeader = false;
      this._exporterService.exportToExcelFromJson(this.sessions, opt);
    }
  }
  public delete(): void {

    // emin misin?
    var modal = this._modalService.confirmYesNo(
      "Tüm Oturumları Sonlandır",
      "Tüm oturumları sonlandırmak istediğinize emin misiniz?"
    );

    modal.onClosed.subscribe((reply) => {
      if (reply == NotifyConfirmType.Yes) {
        this.deleteSessionsFromAPI(this.selectedLicense.id);
      }
    });
  }
  
   // #endregion
 
   //  #region [ Validations ]
   // #endregion
 
   //  #region [ Internal ]
   getSessionList(license:number) {
    this.clearDataSource();
    this.getSessionsFromAPI(license);
  }
  clearDataSource() {
    this.sessions = [];
  }
   // #endregion
  
 
 }
 