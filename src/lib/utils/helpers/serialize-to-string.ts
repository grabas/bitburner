export const toString = (data: any): string => {
    const type = typeof data;
    if (type === "string") return data;
    if (type === "number" || type === "bigint" || type === "boolean") return data.toString();
    return JSON.stringify(data);
}