import * as moment from "moment";

export class ObjectConverter {

    public static toQueryParams(obj: any): string {
        if (!obj) return "";
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                var value = obj[p];
                if (!value) continue;
                if (value instanceof Array) {
                    value.forEach(element => {
                        str.push(this.primitiveToQueryParam(p, element));
                    });
                } else {
                    str.push(this.primitiveToQueryParam(p, value));
                }
            }
        return str.join("&");
    }

    private static primitiveToQueryParam(key, value) {
        if (value instanceof Date) {
            value = moment(value).format();
        }
        return encodeURIComponent(key) + "=" + encodeURIComponent(value);
    }

    public static cast<TSource, TDest>(obj: TSource, ctor: { new(): TDest }): TDest {
        return Object.assign(new ctor(), obj) as TDest;
    }

    public static castArray<TSource, TDest>(obj: TSource[], ctor: { new(): TDest }): TDest[] {
        return obj.map(element => this.cast<TSource, TDest>(element, ctor)) as TDest[];
    }

    public static castAny<TSource, TDest>(obj: (TSource | TSource[]), ctor: { new(): TDest }): (TDest | TDest[]) {
        return (obj instanceof Array) ? this.castArray<TSource, TDest>(obj, ctor) : this.cast<TSource, TDest>(obj, ctor);
    }

}