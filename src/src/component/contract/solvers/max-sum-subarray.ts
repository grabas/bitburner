import { ISolver } from '../solver.interface.js';
import {CodingContractName} from "/src/enum/contract-names.enum";

export class MaxSumSubarray implements ISolver<CodingContractName.SubarrayWithMaximumSum> {
    solve(data: number[]): number {
        let maxSum = data[0];
        let currentSum = data[0];

        for (let i = 1; i < data.length; i++) {
            currentSum = Math.max(data[i], currentSum + data[i]);
            maxSum = Math.max(maxSum, currentSum);
        }

        return maxSum;
    }

    getType(): CodingContractName {
        return CodingContractName.SubarrayWithMaximumSum;
    }
}