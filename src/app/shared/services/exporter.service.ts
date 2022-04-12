import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as xlsx from 'xlsx';
import { ExporterOptions } from '../../models/internal/exporter-options';

@Injectable({
  providedIn: 'root'
})
export class ExporterService {

  constructor() { }

  public exportToExcelFromJson(items: any, opt: ExporterOptions) {

    if (opt == null)
      throw "Exporter Options cannot be null!";
    opt.fileName = opt.fileName && opt.fileName.trim().length > 0 ? opt.fileName : "file";
    opt.sheetName = opt.sheetName && opt.sheetName.trim().length > 0 ? opt.sheetName : "data";

    // girilen header' lara göre yeni object oluşturuluyor 
    var newItems = this.getCleanItems(items, opt);

    // Header için satır ekleme
    this.addHeaders(newItems, opt);

    const worksheet = xlsx.utils.json_to_sheet(newItems, { skipHeader: opt.skipHeader });

    if (opt.isAutoColumn) {
      let objectProperties = Object.getOwnPropertyNames(newItems[0]);
      var wscols = [];
      for (var i = 0; i < objectProperties.length; i++) {  // columns length added
        var property = objectProperties[i];
        var maxLengthOfProperty = this.getMaxLengthOfProperty(newItems, property);
        wscols.push({ wch: maxLengthOfProperty + 1 })
      }
      worksheet['!cols'] = wscols;
    } else if (opt.hasCustomColumSizes) {
      worksheet['!cols'] = opt.customColumnSizes;
    }

    let sheets = {};
    sheets[opt.sheetName] = worksheet;

    const workbook = { Sheets: sheets, SheetNames: [opt.sheetName] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, opt.fileName);
  }

  private getCleanItems(items: any[], opt: ExporterOptions): any[] {
    if (opt == null || opt.headers == null) return null;
    const finallyItems = [];

    let requestedObjectProperties = opt.headers.map(header => header.propertyName);

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const item = items[itemIndex];
      var newItem = this.getNewItemByProperties(item, requestedObjectProperties);
      finallyItems.push(newItem);
    }

    return finallyItems;
  }

  // Header için satır ekleme
  private addHeaders(list: any[] = [], opt: ExporterOptions) {
    if (opt.skipHeader) return;

    opt.skipHeader = true;

    let requestedObjectHeaders = opt.headers;

    var headerItem = {};
    for (let headerIndex = 0; headerIndex < requestedObjectHeaders.length; headerIndex++) {
      const header = requestedObjectHeaders[headerIndex];
      headerItem[header.propertyName] = header.headerName;
    }
    list.unshift(headerItem);
  }
  // seçilen property lere göre yeni bir obje oluşturur, var olan item' dan yeni item' a atama yapar.
  private getNewItemByProperties(item: any, properties: string[]): any {
    var newItem = {};
    for (let objectProperyIndex = 0; objectProperyIndex < properties.length; objectProperyIndex++) {
      const objectProperty = properties[objectProperyIndex];
      newItem[objectProperty] = item[objectProperty];
    }
    return newItem;
  }
  // verilen property nin liste içerisindeki en uzun karakter sayısını verir.
  private getMaxLengthOfProperty(items: any[], propertyName: string) {
    var maxLength: number = 0;
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const item = items[itemIndex];
      // formatı tarih ise uzunluğu kısıtlandırılıyor
      if (items.length > 1 && items[1][propertyName] instanceof Date) {
        maxLength = 14;
      } else {
        var propertyValue = String(item[propertyName]);
        if (propertyValue && propertyValue.length > maxLength)
          maxLength = propertyValue.length;
      }
    }
    return maxLength;
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
