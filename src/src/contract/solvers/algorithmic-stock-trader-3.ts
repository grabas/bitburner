import { SolverInterface } from '../solver.interface.js';
import { AlgorithmicStockTrader } from './algorithmic-stock-trader.js';

export class AlgorithmicStockTrader3 implements SolverInterface<number[], number> {
    solve(data: number[]): number {
        const solver = new AlgorithmicStockTrader();

        let max = 0
        data.forEach((_, index) => {
            max = Math.max(max, solver.solve(data.slice(0, index)) + solver.solve(data.slice(index)))
        })

        return max;
    }

    getType(): string {
        return 'Algorithmic Stock Trader III';
    }
}