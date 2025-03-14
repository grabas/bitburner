import { SolverInterface } from '../solver.interface.js';

export class TotalWaysSum2 implements SolverInterface<[number, number[]], number> {
    solve(data: [number, number[]]): number {
        const [targetSum, availableIntegers] = data;
        const waysToFormSum: number[] = Array(targetSum + 1).fill(0);
        waysToFormSum[0] = 1; // Base: There's one way to form the sum 0 (using no numbers)

        // For each available integer (think of them as coins),
        // update the number of ways to form every possible sum up to targetSum.
        for (const integerValue of availableIntegers) {
            for (let currentSum = integerValue; currentSum <= targetSum; currentSum++) {
                waysToFormSum[currentSum] += waysToFormSum[currentSum - integerValue];
            }
        }

        return waysToFormSum[targetSum];
    }

    getType(): string {
        return 'Total Ways to Sum II';
    }
}