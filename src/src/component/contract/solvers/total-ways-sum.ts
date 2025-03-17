import { ISolver } from '../solver.interface.js';
import {CodingContractName} from "/src/enum/contract-names.enum";

export class TotalWaysSum implements ISolver<CodingContractName.TotalWaysToSum> {
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

    getType(): CodingContractName {
        return CodingContractName.TotalWaysToSum;
    }
}