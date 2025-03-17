import { ISolver } from '../solver.interface.js';
import {CodingContractName} from "/src/enum/contract-names.enum";

export class VigenereCipher implements ISolver<CodingContractName.EncryptionIIVigenereCipher> {
    solve([s, k]: [string, string]): string {
        const key = k.repeat(Math.ceil(s.length / k.length)).slice(0, s.length);

        const alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase()
        const vinegereSquare = alphabet.split('').map((_, index) => {
            return alphabet.slice(index) + alphabet.slice(0, index);
        })

        const result = s.split("").map((char, index) => {
            const rowIndex = alphabet.indexOf(key[index]);
            return vinegereSquare[rowIndex][alphabet.indexOf(char)];
        });

        return result.join('');

    }

    getType(): CodingContractName {
        return CodingContractName.EncryptionIIVigenereCipher;
    }
}