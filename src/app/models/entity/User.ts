import { RoleType } from "../enums/RoleType.enum";


export class User {
    id: number;
    createDate: Date | string;
    name: string;
    surname: string;
    email: string;
    role: RoleType;
    password: string;
    fullName: string;
    isActive: boolean;
}
