import { ISolver } from '../solver.interface.js';
import {CodingContractName} from "/lib/component/contract/contract-names.enum";

export class AlgorithmicStockTrader4 implements ISolver<CodingContractName.AlgorithmicStockTraderIV> {
    solve([k, prices]: [number, number[]]): number {
        const n = prices.length;
        if (k >= Math.floor(n / 2)) {
            let profit = 0;
            for (let i = 1; i < n; i++) {
                const diff = prices[i] - prices[i - 1];
                if (diff > 0) profit += diff;
            }
            return profit;
        }

        const table: number[][] = Array.from({ length: k + 1 }, () => Array(n).fill(0));
        for (let i = 1; i <= k; i++) {
            let maxDiff = -prices[0];
            for (let j = 1; j < n; j++) {
                table[i][j] = Math.max(table[i][j - 1], prices[j] + maxDiff);
                maxDiff = Math.max(maxDiff, table[i - 1][j] - prices[j]);
            }
        }
        return table[k][n - 1];
    }

    getType(): CodingContractName {
        return CodingContractName.AlgorithmicStockTraderIV;
    }
}