import { ISolver } from '../solver.interface.js';
import {CodingContractName} from "/lib/component/contract/contract-names.enum";

export class EncodedBinaryToInteger implements ISolver<CodingContractName.HammingCodesEncodedBinaryToInteger> {
    solve(encoded: string): number {
        const bits: number[] = encoded.split("").map(ch => Number(ch));
        let errorIndex = 0;

        for (let i = 0; i < bits.length; i++) {
            if (bits[i] === 1) errorIndex ^= i;
        }

        if (errorIndex && errorIndex < bits.length) {
            bits[errorIndex] = bits[errorIndex] === 1 ? 0 : 1;
        }

        let dataBits = "";
        for (let i = 1; i < bits.length; i++) {
            if ((i & (i - 1)) !== 0) dataBits += bits[i].toString();
        }

        return parseInt(dataBits, 2);
    }

    getType(): CodingContractName {
        return CodingContractName.HammingCodesEncodedBinaryToInteger;
    }
}