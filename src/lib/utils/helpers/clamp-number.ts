export function clampNumber(value: number, min = -Number.MAX_VALUE, max = Number.MAX_VALUE) {
    return Math.max(Math.min(value, max), min);
}

export function clampInteger(value: number, min = -Number.MAX_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
    return Math.round(Math.max(Math.min(value, max), min));
}