import { ISolver } from '../solver.interface.js';
import {CodingContractName} from "/lib/component/contract/contract-names.enum";

export class UniquePathsOnGrid2 implements ISolver<CodingContractName.UniquePathsInAGridII> {
    solve(obstacleGrid: (1 | 0)[][]): number {
        if (obstacleGrid.length === 0 || obstacleGrid[0].length === 0) return 0;

        const totalRows = obstacleGrid.length;
        const totalColumns = obstacleGrid[0].length;

        if (obstacleGrid[0][0] === 1 || obstacleGrid[totalRows - 1][totalColumns - 1] === 1) return 0;

        const memoizationMap = new Map<string, number>();
        return this.calculatePaths(0, 0, obstacleGrid, memoizationMap);
    }

    private calculatePaths(
        currentRow: number,
        currentColumn: number,
        obstacleGrid: (1 | 0)[][],
        memo: Map<string, number>
    ): number {
        const memoKey = `${currentRow},${currentColumn}`;

        if (memo.has(memoKey)) return memo.get(memoKey)!;

        const totalRows = obstacleGrid.length;
        const totalColumns = obstacleGrid[0].length;

        if (
            currentRow >= totalRows ||
            currentColumn >= totalColumns ||
            obstacleGrid[currentRow][currentColumn] === 1
        ) return 0;

        if (currentRow === totalRows - 1 && currentColumn === totalColumns - 1) return 1;

        const pathsMovingDown = this.calculatePaths(currentRow + 1, currentColumn, obstacleGrid, memo);
        const pathsMovingRight = this.calculatePaths(currentRow, currentColumn + 1, obstacleGrid, memo);
        const totalPathsFromHere = pathsMovingDown + pathsMovingRight;

        memo.set(memoKey, totalPathsFromHere);
        return totalPathsFromHere;
    }

    getType(): CodingContractName {
        return CodingContractName.UniquePathsInAGridII;
    }
}