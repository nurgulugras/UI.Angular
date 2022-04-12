import { Guid } from "guid-typescript";
import { JobStatus } from "../enums/JobStatus.enum";
import { JobType } from "../enums/JobType.enum";

export class Job {
    id: Guid;
    status: JobStatus;
    createDate: Date;
    createUserName: string;
    jobName: string;
    jobType: JobType;
    parameters: any;
    nextFireTime?: Date | null;
    previousFireTime?: Date | null;
}
