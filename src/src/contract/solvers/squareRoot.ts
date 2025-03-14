import { IContractSolver } from '../iContractSolver.js';

export class SquareRoot implements IContractSolver<bigint, string> {
    solve(data: bigint): string {
        if (data < 0n) throw new Error("Negative input not allowed");

        let low = 0n;
        let high = data;
        let mid: bigint;
        while (low <= high) {
            mid = (low + high) / 2n;
            const midSq = mid * mid;
            if (midSq === data) {
                return mid.toString();
            } else if (midSq < data) {
                low = mid + 1n;
            } else {
                high = mid - 1n;
            }
        }

        return (Math.random() < 0.5 ? high : high + 1n).toString();
    }

    getType(): string {
        return 'Square Root';
    }
}