import { EnvironmentType } from "../enums/EnvironmentType.enum";

export class GlobalConfig {
    id: number;
    environmentType: EnvironmentType;
    snaphotPrefix: string;
    snaphotTimestampFormat: string;
}
