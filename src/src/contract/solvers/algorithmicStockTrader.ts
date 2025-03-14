import { IContractSolver } from '../iContractSolver.js';

export class AlgorithmicStockTrader implements IContractSolver<number[], number> {
    solve(data: number[]): number {
        let min = data[0];
        let maxProfit = 0;

        data.forEach(value => {
            min = Math.min(min, value);
            maxProfit = Math.max(maxProfit, value - min);
        });

        return maxProfit;
    }

    getType(): string {
        return 'Algorithmic Stock Trader I';
    }
}