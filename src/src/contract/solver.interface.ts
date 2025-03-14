export interface ISolver<T, R> {
    solve(data: T): R;
    getType(): string;
}