import { ISolver } from '../solver.interface.js';
import {CodingContractName} from "/src/enum/contract-names.enum";

export class MinimumPathSumInTriangle implements ISolver<CodingContractName.MinimumPathSumInATriangle> {
    solve(triangle: number[][]): number {
        const dp = triangle[triangle.length - 1].slice();

        for (let row = triangle.length - 2; row >= 0; row--) {
            for (let col = 0; col < triangle[row].length; col++) {
                dp[col] = triangle[row][col] + Math.min(dp[col], dp[col + 1]);
            }
        }

        return dp[0];
    }

    getType(): CodingContractName {
        return CodingContractName.MinimumPathSumInATriangle;
    }
}