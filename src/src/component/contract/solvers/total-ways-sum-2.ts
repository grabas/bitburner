import { ISolver } from '../solver.interface.js';
import {CodingContractName} from "/src/component/contract/contract-names.enum";

export class TotalWaysSum2 implements ISolver<CodingContractName.TotalWaysToSumII> {
    solve([targetSum, availableIntegers]: [number, number[]]): number {
        const waysToFormSum: number[] = Array(targetSum + 1).fill(0);
        waysToFormSum[0] = 1;

        for (const integerValue of availableIntegers) {
            for (let currentSum = integerValue; currentSum <= targetSum; currentSum++) {
                waysToFormSum[currentSum] += waysToFormSum[currentSum - integerValue];
            }
        }

        return waysToFormSum[targetSum];
    }

    getType(): CodingContractName {
        return CodingContractName.TotalWaysToSumII;
    }
}