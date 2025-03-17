import { ISolver } from '../solver.interface.js';
import {CodingContractName} from "/src/enum/contract-names.enum";

export class CaesarCipher implements ISolver<CodingContractName.EncryptionICaesarCipher> {
    solve([s, k]: [string, number]): string {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const shiftedAlphabet = alphabet.slice(k % 26) + alphabet.slice(0, k % 26);

        return s.split('').map(char => {
            const index = alphabet.indexOf(char.toUpperCase());
            return index === -1 ? char : shiftedAlphabet[index];
        }).join('');
    }

    getType(): CodingContractName {
        return CodingContractName.EncryptionICaesarCipher;
    }
}