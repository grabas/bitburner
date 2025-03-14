import { ISolver } from '../solver.interface.js';

export class SquareRoot implements ISolver<bigint, string> {
    solve(val: bigint): string {
        if (val < 0n) throw new Error("Negative input not allowed");
        const k = 2n;
        let limit = -1;

        let o = 0n;
        let x = val;

        while(x**k!==k && x!==o && --limit) {
            o=x;
            x = ((k-1n)*x + val/x**(k-1n))/k;
            if(limit<0 && (x-o)**2n == 1n) break;
        }

        if ((val-(x-1n)**k)**2n < (val-x**k)**2n) x=x-1n;
        if ((val-(x+1n)**k)**2n < (val-x**k)**2n) x=x+1n;
        return x.toString();
    }

    getType(): string {
        return 'Square Root';
    }
}