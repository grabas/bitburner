export function isPowerOfTwo(n: number): boolean {
    if (isNaN(n)) {
        return false;
    }

    if (n === 0) {
        return false;
    }

    return (n & (n - 1)) === 0;
}