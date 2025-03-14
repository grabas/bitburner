import { SolverInterface } from '../solver.interface.js';

export class TotalWaysSum implements SolverInterface<number, number> {
    solve(inputNumber: number): number {
        const targetNumber = inputNumber;
        const waysToSum: number[] = new Array(targetNumber + 1).fill(0);

        waysToSum[0] = 1;
        for (let currentSummand = 1; currentSummand <= targetNumber - 1; currentSummand++) {
            for (let currentTotal = currentSummand; currentTotal <= targetNumber; currentTotal++) {
                waysToSum[currentTotal] += waysToSum[currentTotal - currentSummand];
            }
        }

        return waysToSum[targetNumber];
    }

    getType(): string {
        return 'Total Ways to Sum';
    }
}