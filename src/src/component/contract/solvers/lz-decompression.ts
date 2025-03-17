import { ISolver } from '../solver.interface.js';
import {CodingContractName} from "/src/enum/contract-names.enum";

export class LzDecompression implements ISolver<CodingContractName.CompressionIILZDecompression> {
    solve(encoded: string): string {
        let decoded = "";
        let pointer = 0;
        let isLiteralChunk = true;

        while (pointer < encoded.length) {
            const lengthDigit = Number(encoded[pointer]);
            pointer++;

            if (lengthDigit === 0) {
                isLiteralChunk = !isLiteralChunk;
                continue;
            }

            if (isLiteralChunk) {
                decoded += encoded.slice(pointer, pointer + lengthDigit);
                pointer += lengthDigit;
            } else {
                const offset = Number(encoded[pointer]);
                pointer++;
                for (let count = 0; count < lengthDigit; count++) {
                    decoded += decoded[decoded.length - offset];
                }
            }

            isLiteralChunk = !isLiteralChunk;
        }

        return decoded;
    }

    getType(): CodingContractName {
        return CodingContractName.CompressionIILZDecompression;
    }
}