import { AuditLogCategory } from '../enums/AuditLogCategory.enum';
import { CrudType } from '../enums/CrudType.enum';
import { SeverityType } from '../enums/SeverityType.enum';
export class SystemLogFilterParameter {
    categories: AuditLogCategory[];
    crudTypes: CrudType[];
    severityTypes: SeverityType[];
    userIds: number[];
    startDate?: Date;
    endDate?: Date;
}
