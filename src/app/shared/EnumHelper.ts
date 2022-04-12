export class EnumHelper {
    public static getEnumKeys(enumType: any): Array<string> {
      var keys = Object.keys(enumType);
      return keys.slice(keys.length / 2);
    }
    public static getEnumValues(enumType: any): Array<string> {
      return Object.values(enumType) as string[];
    }
    public static checkEnumKeyIsValid(enumType: any, enumKey: any): boolean {
      var enumKeys = EnumHelper.getEnumKeys(enumType);
      return enumKeys.findIndex(x => x == enumKey) > 0;
    }
  }
  