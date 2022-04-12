export class MailProvider {
    id: number;
    host: string;
    port: number;
    useDefaultCredentials: boolean;
    useBasicAuthentication: boolean;
    enableSSL: boolean;
    username: string;
    password: string;
    senderMail: string;
    senderDisplayName: string;
}
