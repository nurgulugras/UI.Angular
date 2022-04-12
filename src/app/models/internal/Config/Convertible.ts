export class Convertible {
    public convert(instanceData: Object) {
        const keys = Object.keys(instanceData);

        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    }
}
