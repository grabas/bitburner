import { ISolver } from '../solver.interface.js';
import { CodingContractName } from "/lib/component/contract/contract-names.enum";

export class ArrayJumpingGame implements ISolver<CodingContractName.ArrayJumpingGame> {
    solve(data: number[]): 1 | 0 {
        const n = data.length;
        let reach = 0;

        for (let i = 0; i < n && i <= reach; i++) {
            reach = Math.max(reach, i + data[i]);
            if (reach >= n - 1) return 1;
        }

        return 0;
    }

    getType(): CodingContractName {
        return CodingContractName.ArrayJumpingGame;
    }
}