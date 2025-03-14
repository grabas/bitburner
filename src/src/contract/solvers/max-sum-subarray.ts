import { SolverInterface } from '../solver.interface.js';

export class MaxSumSubarray implements SolverInterface<number[], number> {
    solve(data: number[]): number {
        let max = 0
        for (let i = 0; i < data.length; i++) {
            for (let j = i; j < data.length; j++) {
                max = Math.max(max, data.slice(i, j + 1).reduce((partialSum, a) => partialSum + a, 0))
            }
        }

        return max;
    }

    getType(): string {
        return 'Subarray with Maximum Sum';
    }
}