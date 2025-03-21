import { ISolver } from '../solver.interface.js';
import {CodingContractName} from "/src/component/contract/contract-names.enum";

export class CaesarCipher implements ISolver<CodingContractName.EncryptionICaesarCipher> {
    solve([s, k]: [string, number]): string {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase();

        const n = alphabet.length - k;
        const shiftedAlphabet = alphabet.slice(n) + alphabet.slice(0, n);

        return s.split('').map(char => {
            const index = alphabet.indexOf(char);
            return index === -1 ? char : shiftedAlphabet[index];
        }).join('');
    }

    getType(): CodingContractName {
        return CodingContractName.EncryptionICaesarCipher;
    }
}