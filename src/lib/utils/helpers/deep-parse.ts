export const deepJSONParse = (value: any): any => {
    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            return deepJSONParse(parsed);
        } catch (error) {
            return value;
        }
    } else if (Array.isArray(value)) {
        return value.map(deepJSONParse);
    } else if (value !== null && typeof value === "object") {
        const result: any = {};
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                result[key] = deepJSONParse(value[key]);
            }
        }
        return result;
    }
    return value;
}
