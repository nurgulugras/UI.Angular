import { CrudType } from '../enums/CrudType.enum';
import { AuditLogCategory } from '../enums/AuditLogCategory.enum';
import { SeverityType } from '../enums/SeverityType.enum';

export class ActivityLog {
    id: number;
    createDate: Date;
    userId?: number;
    userName: string;
    severity: SeverityType;
    crudType: CrudType;
    logCategory: AuditLogCategory;
    message: string;
    // isSuccess: boolean;
    entityId?: number;
    entityObject: string;
    changes: string;
}
