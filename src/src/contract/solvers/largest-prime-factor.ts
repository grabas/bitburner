import { SolverInterface } from '../solver.interface.js';

export class LargestPrimeFactor implements SolverInterface<number, number> {
    solve(inputNumber: number): number {
        let remainingNumber = inputNumber;
        let largestPrimeFactorFound = 1;

        while (remainingNumber % 2 === 0) {
            largestPrimeFactorFound = 2;
            remainingNumber /= 2;
        }

        let currentFactor = 3;
        while (currentFactor <= Math.sqrt(remainingNumber)) {
            while (remainingNumber % currentFactor === 0) {
                largestPrimeFactorFound = currentFactor;
                remainingNumber /= currentFactor;
            }
            currentFactor += 2;
        }

        if (remainingNumber > 2) {
            largestPrimeFactorFound = remainingNumber;
        }

        return largestPrimeFactorFound;
    }

    getType(): string {
        return 'Find Largest Prime Factor';
    }
}