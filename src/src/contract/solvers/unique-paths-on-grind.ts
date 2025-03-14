import { ISolver } from '../solver.interface.js';

export class UniquePathsOnGrind implements ISolver<[number, number], number> {
    solve(data: [number, number]): number {
        const [rows, columns] = data;
        let totalPaths = 1;
        for (let step = 1; step < rows; step++) {
            totalPaths = totalPaths * (columns - 1 + step) / step;
        }
        return totalPaths;
    }

    getType(): string {
        return 'Unique Paths in a Grid I';
    }
}