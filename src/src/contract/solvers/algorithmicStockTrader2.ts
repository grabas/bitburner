import { IContractSolver } from '../iContractSolver.js';

export class AlgorithmicStockTrader2 implements IContractSolver<number[], number> {
    solve(data: number[]): number {
        let maxProfit = 0;
        data.forEach((value, index) => {
            maxProfit += Math.max(0, (data[index + 1] ?? 0) - value);
        });

        return maxProfit;
    }

    getType(): string {
        return 'Algorithmic Stock Trader II';
    }
}