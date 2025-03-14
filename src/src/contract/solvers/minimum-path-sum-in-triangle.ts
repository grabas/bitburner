import { ISolver } from '../solver.interface.js';

export class MinimumPathSumInTriangle implements ISolver<number[][], number> {
    solve(data: number[][]): number {
        const dp = data[data.length - 1].slice();
        for (let row = data.length - 2; row >= 0; row--) {
            for (let col = 0; col < data[row].length; col++) {
                dp[col] = data[row][col] + Math.min(dp[col], dp[col + 1]);
            }
        }
        return dp[0];
    }

    getType(): string {
        return 'Minimum Path Sum in a Triangle';
    }
}