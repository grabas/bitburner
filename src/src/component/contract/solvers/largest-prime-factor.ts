import { ISolver } from '../solver.interface.js';
import {CodingContractName} from "/src/component/contract/contract-names.enum";

export class LargestPrimeFactor implements ISolver<CodingContractName.FindLargestPrimeFactor> {
    solve(inputNumber: number): number {
        let remainingNumber = inputNumber;
        let largestPrimeFactorFound = 1;

        while (remainingNumber % 2 === 0) {
            largestPrimeFactorFound = 2;
            remainingNumber /= 2;
        }

        let currentFactor = 3;
        while (currentFactor * currentFactor <= remainingNumber) {
            while (remainingNumber % currentFactor === 0) {
                largestPrimeFactorFound = currentFactor;
                remainingNumber /= currentFactor;
            }
            currentFactor += 2;
        }

        if (remainingNumber > 1) {
            largestPrimeFactorFound = remainingNumber;
        }

        return largestPrimeFactorFound;
    }

    getType(): CodingContractName {
        return CodingContractName.FindLargestPrimeFactor;
    }
}