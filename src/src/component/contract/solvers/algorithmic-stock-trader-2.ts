import { ISolver } from '../solver.interface.js';
import {CodingContractName} from "/src/enum/contract-names.enum";

export class AlgorithmicStockTrader2 implements ISolver<CodingContractName.AlgorithmicStockTraderII> {
    solve(prices: number[]): number {
        let maxProfit = 0;

        for (let i = 1; i < prices.length; i++) {
            maxProfit += Math.max(0, prices[i] - prices[i - 1]);
        }

        return maxProfit;
    }

    getType(): CodingContractName {
        return CodingContractName.AlgorithmicStockTraderII;
    }
}