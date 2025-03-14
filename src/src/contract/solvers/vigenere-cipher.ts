import { SolverInterface } from '../solver.interface.js';

export class VigenereCipher implements SolverInterface<[string, string], string> {
    solve(data: [string, string]): string {
        const [s, k] = data;
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

    getType(): string {
        return 'Encryption II: Vigenère Cipher';
    }
}