export class Cryptography {
    public static Encode<TDataType>(
      data: TDataType,
      useSecurity: boolean = true
    ) {
      var internalData: any =
        typeof data == typeof String ? data : JSON.stringify(data);
      var encodedData = btoa(unescape(encodeURIComponent(internalData)));
      // var encodedData = btoa(internalData);
  
      if (useSecurity) encodedData = this.reverseData(encodedData);
      return encodedData;
    }
    public static Decode<TDataType>(
      data: string,
      useSecurity: boolean = true
    ): TDataType {
      if (useSecurity) data = this.reverseData(data);
      var decodedData = decodeURIComponent(escape(window.atob(data)));
      // var decodedData = atob(data);
      return JSON.parse(decodedData) as TDataType;
    }
  
    private static reverseData(data: string): string {
      return data
        .split("")
        .reverse()
        .join("");
    }
  }
  