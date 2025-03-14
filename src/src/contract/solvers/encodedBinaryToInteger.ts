import { IContractSolver } from '../iContractSolver.js';

export class EncodedBinaryToInteger implements IContractSolver<string, string> {
    solve(encoded: string): string {
        const bits: number[] = encoded.split("").map(ch => Number(ch));
        let errorIndex = 0;
        for (let i = 0; i < bits.length; i++) {
            if (bits[i] === 1) errorIndex ^= i;
        }
        if (errorIndex) {
            bits[errorIndex] = bits[errorIndex] === 1 ? 0 : 1;
        }
        let dataBits = "";
        for (let i = 1; i < bits.length; i++) {
            if ((i & (i - 1)) !== 0) dataBits += bits[i].toString();
        }
        return parseInt(dataBits, 2).toString();
    }

    getType(): string {
        return "HammingCodes: Encoded Binary to Integer";
    }
}