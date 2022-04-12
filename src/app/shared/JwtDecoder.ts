import jwt_decode from 'jwt-decode'
export class JwtDecoder {
  public static decode(token: string) {
    return jwt_decode(token);
  }
}
