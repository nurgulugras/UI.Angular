import { ShareOwnerType } from '../enums/ShareOwnerType.enum';

export class Sharing {
    volume: string;
    ownerType: ShareOwnerType;
    owner: string;
    comment: string;
    path: string;
    folderName: string;
    folderSize: string;
    readOnly: boolean;
    guestOk: boolean;
    hideUnreadable: boolean;
    windowsPreviousVersions: boolean;
}