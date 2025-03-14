import { ISolver } from '../solver.interface.js';
import { CodingContractName } from "@ns";

export class VigenereCipher implements ISolver<CodingContractName.EncryptionIIVigenereCipher> {
    solve([k, s]: [string, string]): string {
        const key = k.repeat(Math.ceil(s.length / k.length)).slice(0, s.length);
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        const vigenereSquare = alphabet.split('').map((_, index) => {
            return alphabet.slice(index) + alphabet.slice(0, index);
        });

        const result = s.split("").map((char, index) => {
            const rowIndex = alphabet.indexOf(key[index]);
            const colIndex = alphabet.indexOf(char);
            return rowIndex !== -1 && colIndex !== -1 ? vigenereSquare[rowIndex][colIndex] : char;
        });

        return result.join('');
    }

    getType(): CodingContractName {
        return CodingContractName.EncryptionIIVigenereCipher;
    }
}