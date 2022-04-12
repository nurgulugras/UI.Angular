import { NotifyConfirmType } from "../enums/NotifyConfirmType.enum";

export class ButtonOption {
    constructor(public text: string, public icon: string, public confirmType: NotifyConfirmType, public backgroundClass: string = null) {
    }
}
