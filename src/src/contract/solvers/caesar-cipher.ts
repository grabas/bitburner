import { SolverInterface } from '../solver.interface.js';

export class CaesarCipher implements SolverInterface<[string, number], string> {
    solve(data: [string, number]): string {
        const [s, k] = data;
        const alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase();

        const n = alphabet.length - k;
        const shiftedAlphabet = alphabet.slice(n) + alphabet.slice(0, n);

        return s.split('').map(char => {
            const index = alphabet.indexOf(char);
            return index === -1 ? char : shiftedAlphabet[index];
        }).join('');
    }

    getType(): string {
        return 'Encryption I: Caesar Cipher';
    }
}