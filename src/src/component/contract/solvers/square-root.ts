import { ISolver } from '../solver.interface.js';
import { CodingContractName } from "@ns";

export class SquareRoot implements ISolver<CodingContractName.SquareRoot> {
    solve(val: bigint): bigint {
        if (val < 0n) throw new Error("Negative input not allowed");

        const k = 2n;
        let o = 0n;
        let x = val;

        while (x ** k !== k && x !== o) {
            o = x;
            x = ((k - 1n) * x + val / x ** (k - 1n)) / k;
        }

        if ((val - (x - 1n) ** k) ** 2n < (val - x ** k) ** 2n) x = x - 1n;
        if ((val - (x + 1n) ** k) ** 2n < (val - x ** k) ** 2n) x = x + 1n;

        return x;
    }

    getType(): CodingContractName {
        return CodingContractName.SquareRoot;
    }
}