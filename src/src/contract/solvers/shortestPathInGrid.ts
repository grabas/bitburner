import { IContractSolver } from '../iContractSolver.js';

export class ShortestPathInGrid implements IContractSolver<number[][], string> {
    solve(grid: number[][]): string {
        const totalRows = grid.length;
        if (totalRows === 0) return "";
        const totalColumns = grid[0].length;
        if (grid[0][0] === 1 || grid[totalRows - 1][totalColumns - 1] === 1) return "";

        const moves = [
            { dr: -1, dc: 0, move: 'U' },
            { dr: 1, dc: 0, move: 'D' },
            { dr: 0, dc: -1, move: 'L' },
            { dr: 0, dc: 1, move: 'R' }
        ];

        const visited = Array.from({ length: totalRows }, () => Array(totalColumns).fill(false));
        const queue: { row: number; column: number; path: string }[] = [{ row: 0, column: 0, path: "" }];
        visited[0][0] = true;

        while (queue.length) {
            const { row, column, path } = queue.shift()!;
            if (row === totalRows - 1 && column === totalColumns - 1) return path;
            for (const { dr, dc, move } of moves) {
                const newRow = row + dr;
                const newColumn = column + dc;
                if (newRow >= 0 && newRow < totalRows && newColumn >= 0 && newColumn < totalColumns &&
                    grid[newRow][newColumn] === 0 && !visited[newRow][newColumn]) {
                    visited[newRow][newColumn] = true;
                    queue.push({ row: newRow, column: newColumn, path: path + move });
                }
            }
        }
        return "";
    }

    getType(): string {
        return 'Shortest Path in a Grid';
    }
}