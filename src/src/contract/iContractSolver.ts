export interface IContractSolver<T, R> {
    solve(data: T): R;
    getType(): string;
}