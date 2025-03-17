import { ISolver } from '../solver.interface.js';
import {CodingContractName} from "/src/enum/contract-names.enum";

function isPowerOfTwo(n: number): boolean {
    return n > 0 && (n & (n - 1)) === 0;
}

export class IntegerToEncodedBinary implements ISolver<CodingContractName.HammingCodesIntegerToEncodedBinary> {
    solve(decimalValue: number): string {
        const binaryString = decimalValue.toString(2);
        const dataLength = binaryString.length;
        let totalLength = dataLength;

        while (true) {
            let parityCount = 0;
            for (let pos = 1; pos < totalLength; pos++) {
                if (isPowerOfTwo(pos)) parityCount++;
            }
            if (totalLength - (1 + parityCount) === dataLength) break;
            totalLength++;
        }

        const codeword: number[] = new Array(totalLength).fill(0);
        const parityPositions = new Set<number>();
        parityPositions.add(0);

        for (let pos = 1; pos < totalLength; pos++) {
            if (isPowerOfTwo(pos)) parityPositions.add(pos);
        }

        let dataIndex = 0;
        for (let pos = 0; pos < totalLength; pos++) {
            if (!parityPositions.has(pos)) {
                codeword[pos] = Number(binaryString[dataIndex]);
                dataIndex++;
            }
        }

        for (const pos of parityPositions) {
            if (pos === 0) continue;
            let parity = 0;
            for (let j = pos; j < totalLength; j += 2 * pos) {
                for (let k = j; k < j + pos && k < totalLength; k++) {
                    parity ^= codeword[k];
                }
            }
            codeword[pos] = parity;
        }

        let overallParity = 0;
        for (let i = 1; i < totalLength; i++) {
            overallParity ^= codeword[i];
        }
        codeword[0] = overallParity;

        return codeword.join('');
    }

    getType(): CodingContractName {
        return CodingContractName.HammingCodesIntegerToEncodedBinary;
    }
}