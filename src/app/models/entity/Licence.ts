import { LicensePeriodType } from "../enums/LicensePeriodType.enum";
import { AppLimit } from "./AppLimit";
import { AppProduct } from "./AppProduct";
import { LicenseLimit } from "./LicenseLimit";
import { LicenseProduct } from "./LicenseProduct";

export class Licence {
        id: number;
        createDate: Date | string;
        createUserId: number;
        createUserName: string;

        appId: number;
        appName: string;

        companyId: number;
        companyName: string;

        licenseNo: string;

        name: string;

        licensePeriodType: LicensePeriodType;
        licensePeriodTypeDesc: string;

        licensePeriod: number;
        sessionLimit: number;

        startDate: Date;

        endDate: Date;
        registeredDate: Date;
        aFUid: string;
     // aFStatus: AFStatus;
        aFMessage: string;
        isRegistered: boolean;
        licenseProducts: LicenseProduct[];
        licenseLimits: LicenseLimit[];
        licenseLimit:LicenseLimit;
}
