declare const _: {
    get(object: any, path: string, defaultValue?: any): any;
};

declare global {
    interface Array<T> {
        sortBy(prop: string, order?: "ASC" | "DESC"): T[];
    }
}

Array.prototype.sortBy = function<T>(this: T[], prop: string, order: "ASC" | "DESC" = "DESC"): T[] {
    return this.sort((a, b) => {
        const aValue = _.get(a, prop);
        const bValue = _.get(b, prop);
        return order === "DESC" ? bValue - aValue : aValue - bValue;
    });
};

export {};
