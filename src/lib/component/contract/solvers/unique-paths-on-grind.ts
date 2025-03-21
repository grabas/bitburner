import { ISolver } from '../solver.interface.js';
import {CodingContractName} from "/lib/component/contract/contract-names.enum";

export class UniquePathsOnGrid implements ISolver<CodingContractName.UniquePathsInAGridI> {
    solve([rows, columns]: [number, number]): number {
        let totalPaths = 1;
        for (let step = 1; step < rows; step++) {
            totalPaths = (totalPaths * (columns - 1 + step)) / step;
        }
        return totalPaths;
    }

    getType(): CodingContractName {
        return CodingContractName.UniquePathsInAGridI;
    }
}