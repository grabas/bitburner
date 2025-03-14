import { ISolver } from '../solver.interface.js';

export class ArrayJumpingGame implements ISolver<number[], number> {
    solve(data: number[]): number {
        const n = data.length;
        let i = 0;
        for (let reach = 0; i < n && i <= reach; ++i) {
            reach = Math.max(i + data[i], reach);
        }
        return i === n ? 1 : 0;
    }

    getType(): string {
        return 'Array Jumping Game';
    }
}