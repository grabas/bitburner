import { ISolver } from '../solver.interface.js';
import {CodingContractName} from "/src/component/contract/contract-names.enum";

export class RleCompression implements ISolver<CodingContractName.CompressionIRLECompression> {
    solve(input: string): string {
        if (input.length === 0) return "";
        let result = "";
        let currentCharacter = input[0];
        let count = 1;

        for (let i = 1; i < input.length; i++) {
            if (input[i] === currentCharacter) {
                count++;
            } else {
                while (count > 9) {
                    result += "9" + currentCharacter;
                    count -= 9;
                }
                result += count.toString() + currentCharacter;
                currentCharacter = input[i];
                count = 1;
            }
        }

        while (count > 9) {
            result += "9" + currentCharacter;
            count -= 9;
        }
        result += count.toString() + currentCharacter;

        return result;
    }

    getType(): CodingContractName {
        return CodingContractName.CompressionIRLECompression;
    }
}