export class AuditLog {
    id: number;
    createDate: Date;
    status: string;
    logDate: Date;
    hostname: string;
    IP: string;
    email: string;
    machine: string;
    share: string;
    operation: string;
    path: string;
    dir: string;
    file: string;
    oldPath: string;
    oldDir: string;
    oldFile: string;
}