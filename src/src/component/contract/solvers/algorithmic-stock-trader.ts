import { CodingContractName } from "@ns";
import { ISolver } from '../solver.interface.js';

export class AlgorithmicStockTrader implements ISolver<CodingContractName.AlgorithmicStockTraderI> {
    solve(prices: number[]): number {
        let min = prices[0];
        let maxProfit = 0;

        prices.forEach(value => {
            min = Math.min(min, value);
            maxProfit = Math.max(maxProfit, value - min);
        });

        return maxProfit;
    }

    getType(): CodingContractName {
        return CodingContractName.AlgorithmicStockTraderI;
    }
}