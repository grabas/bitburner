import { SolverInterface } from '../solver.interface.js';

export class ArrayJumpingGame2 implements SolverInterface<number[], number> {
    solve(data: number[]): number {
        const totalPositions = data.length;
        if (totalPositions <= 1) return 0;
        let jumps = 0;
        let currentBoundary = 0;
        let maximumReach = 0;
        for (let index = 0; index < totalPositions - 1; index++) {
            if (index > maximumReach) return 0;
            maximumReach = Math.max(maximumReach, index + data[index]);
            if (index === currentBoundary) {
                jumps++;
                currentBoundary = maximumReach;
                if (currentBoundary >= totalPositions - 1) break;
            }
        }
        return currentBoundary >= totalPositions - 1 ? jumps : 0;
    }

    getType(): string {
        return 'Array Jumping Game II';
    }
}