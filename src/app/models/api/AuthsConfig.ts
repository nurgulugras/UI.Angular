import { BasicAuthConfig } from "../entity/BasicAuthConfig";
import { LdapAuthConfig } from "../entity/LdapAuthConfig";

export class AuthsConfig {
    basicAuthConfig: BasicAuthConfig;
    ldapAuthConfig: LdapAuthConfig;
}
