import { ContractSolverInterface } from '../contract-solver.interface.js';

export class RleCompression implements ContractSolverInterface<string, string> {
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

    getType(): string {
        return 'Compression I: RLE Compression';
    }
}