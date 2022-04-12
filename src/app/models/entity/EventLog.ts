import { LogLevelType } from "../enums/LogLevelType.enum";
import { LogType } from "../enums/LogType.enum";
import { User } from "./User";
export class EventLog {
    id: number;
    createDate: Date;
    createUserId: number;
    createUserName: string;
    type: LogType;
    level: LogLevelType;
    message: string;
    eventId: string;
}
