import { ISolver } from '../solver.interface.js';
import { CodingContractName } from "@ns";

export class ArrayJumpingGame implements ISolver<CodingContractName.ArrayJumpingGame> {
    solve(data: number[]): 1 | 0 {
        const n = data.length;
        let i = 0;
        for (let reach = 0; i < n && i <= reach; ++i) {
            reach = Math.max(i + data[i], reach);
        }
        return i === n ? 1 : 0;
    }

    getType(): CodingContractName {
        return CodingContractName.ArrayJumpingGame;
    }
}