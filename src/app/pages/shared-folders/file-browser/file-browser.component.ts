import { Component, OnInit, Injector } from '@angular/core';
import { Sharing } from '../../../models/entity/Sharing';
import { ComponentBase } from '../../../shared/components/component-base';
import { SharesService } from '../../../shared/services/shares.service';
import { ResultType } from '../../../models/enums/ResultType.enum';
import { DirectoryInfo } from '../../../models/entity/Directory/DirectoryInfo';
import { OSFileBase } from '../../../models/entity/Directory/OSFileBase';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import * as cloneDeep from 'lodash';
import { ExporterService } from '../../../shared/services/exporter.service';
import { ExporterOptions } from '../../../models/internal/exporter-options';

@Component({
  selector: 'esa-file-browser',
  templateUrl: './file-browser.component.html',
  styleUrls: ['./file-browser.component.scss']
})
export class FileBrowserComponent extends ComponentBase implements OnInit {
  //  #region [ Fields ]
  sharing: Sharing;
  directoryInfo: DirectoryInfo;
  directoryContent: OSFileBase[] = [];

  // #endregion

  //  #region [ Initialize ]
  constructor(public injector: Injector, private sharesService: SharesService, private exporterService: ExporterService) {
    super(injector);
  }
  ngOnInit() {
  }
  // #endregion

  //  #region [ Entity ]

  getDirectoryInfoFromAPI(volume: string, directory: string) {
    this._isRunning = true;
    this.sharesService.getDirectoryInfo(volume, directory).subscribe(response => {
      this._isRunning = false;
      if (response.resultType == ResultType.Success) {
        this.directoryInfo = response.dataModel;
        this.directoryContent = [];
        if (this.directoryInfo.folders) {
          this.directoryInfo.folders.map(folder => {
            folder.modifiedDate = new Date(folder.modifiedDate);
            folder.isFolder = true;
            this.directoryContent.push(folder);
          });
        }
        if (this.directoryInfo.files) {
          this.directoryInfo.files.map(file => {
            file.modifiedDate = new Date(file.modifiedDate);
            this.directoryContent.push(file);
          });
        }
        // if (this.directoryContent.length == 0) {
        //   var emptyContent = new OSFileBase();
        //   emptyContent.name = "...";
        //   this.directoryContent.push(emptyContent);

        // }
      } else if (response.resultType == ResultType.Fail) {
        this._notifyService.error(response.message);
      }
    },
      error => {
        this._isRunning = false;
      });
  }
  // #endregion

  //  #region [ UI Tools ]

  goToDirectory(directoryContent: OSFileBase) {
    if (!directoryContent.isFolder) return;
    this.loadDirectory(this.directoryInfo.path + "/" + directoryContent.name);
  }
  goToHomeDirectory() {
    if (this.isRootPath()) return;
    this.loadDirectory(this.sharing.folderName);
  }
  goToBackDirectory() {
    if (this.isRootPath()) return;
    var currentDirectory = this.directoryInfo.path;
    var splitted = currentDirectory.split("/");
    splitted.splice(-1);
    let newPath = splitted.join("/");
    this.loadDirectory(newPath);
  }
  goDirectoryByIndex(index: number): void {
    if (this.isRootPath()) return;
    var currentDirectory = this.directoryInfo.path;
    var splitted = currentDirectory.split("/");
    splitted = splitted.slice(0, index + 1);
    let newPath = splitted.join("/");
    this.loadDirectory(newPath);
  }
  getAddressList(): string[] {
    return this.directoryInfo ? this.directoryInfo.path.split("/") : [];
  }
  refresh() {
    this.loadDirectory(this.directoryInfo.path);
  }

  loadExistsSharingData(sharing: Sharing) {
    this.sharing = sharing;
    this.loadDirectory(sharing.folderName);
  }
  public dateFormat(date, format = "DD.MM.YYYY HH:mm:ss"): string {
    if (!date) return "";
    return moment(date).format(format);
  }
  getCurrentDirectoryPath() {
    var regex = new RegExp("/", 'g');
    return this.directoryInfo && this.directoryInfo.path ? this.directoryInfo.path.replace(regex, ' > ') : "";
  }

  // #endregion

  //  #region [ Validations ]
  isRootPath(): boolean {
    if (!this.directoryInfo || !this.sharing) return false;
    return this.directoryInfo.path == this.sharing.folderName;
  }
  // #endregion

  //  #region [ Internal ]
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
  loadDirectory(directory: string) {
    if (!(this.sharing && this.sharing.volume)) return;
    this.getDirectoryInfoFromAPI(this.sharing.volume, directory);
  }
  // #endregion
}
