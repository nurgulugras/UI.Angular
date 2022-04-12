import { ExportPropertyInfo } from './ExportPropertyInfo';

export class ExporterOptions {
    constructor() {
    }
    // default: 'file'
    fileName: string;

    // default: 'data'
    sheetName: string;
    headers: ExportPropertyInfo[];
    skipHeader?: boolean;
    isAutoColumn?: boolean;
    /* Example: var wscols = [ {wch:6},{wch:7},{wch:10},{wch:20} ]; */
    customColumnSizes: any[];
    get hasCustomColumSizes() { return this.customColumnSizes && this.customColumnSizes.length > 0 }
}