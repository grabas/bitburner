import { ISolver } from '../solver.interface.js';
import { AlgorithmicStockTrader } from './algorithmic-stock-trader.js';
import {CodingContractName} from "/lib/component/contract/contract-names.enum";

export class AlgorithmicStockTrader3 implements ISolver<CodingContractName.AlgorithmicStockTraderIII> {
    solve(prices: number[]): number {
        const solver = new AlgorithmicStockTrader();
        let max = 0;

        for (let i = 0; i < prices.length; i++) {
            max = Math.max(max, solver.solve(prices.slice(0, i)) + solver.solve(prices.slice(i)));
        }

        return max;
    }

    getType(): CodingContractName {
        return CodingContractName.AlgorithmicStockTraderIII;
    }
}