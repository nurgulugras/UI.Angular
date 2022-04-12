import { SeverityType } from '../enums/SeverityType.enum';

export class HealthCheckStatus {
    severity: SeverityType;
    message: string;
}
