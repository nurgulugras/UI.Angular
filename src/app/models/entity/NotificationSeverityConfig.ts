import { Guid } from 'guid-typescript';

export class NotificationSeverityConfig {
    id: number;
    uid: Guid;
    userMails: string;
    isSelectedSeverityInfo: boolean;
    isSelectedSeverityWarning: boolean;
    isSelectedSeverityError: boolean;
    isSelectedSeverityCritical: boolean;
}