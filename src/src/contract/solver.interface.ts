export interface SolverInterface<T, R> {
    solve(data: T): R;
    getType(): string;
}