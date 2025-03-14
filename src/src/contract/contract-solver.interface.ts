export interface ContractSolverInterface<T, R> {
    solve(data: T): R;
    getType(): string;
}