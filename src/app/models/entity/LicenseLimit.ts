import { Guid } from "guid-typescript";

export class LicenseLimit {    
        id: number;      
        licenseId: number;    
        appLimitId: number;
        limit: string;
        uid:Guid;
}
