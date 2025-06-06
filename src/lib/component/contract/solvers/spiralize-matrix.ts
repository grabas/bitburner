import { ISolver } from '../solver.interface.js';
import {CodingContractName} from "/lib/component/contract/contract-names.enum";

export class SpiralizeMatrix implements ISolver<CodingContractName.SpiralizeMatrix> {
    solve(matrix: number[][]): number[] {
        const spiralOrder: number[] = [];
        let topBoundary = 0;
        let bottomBoundary = matrix.length - 1;
        let leftBoundary = 0;
        let rightBoundary = matrix[0].length - 1;

        while (topBoundary <= bottomBoundary && leftBoundary <= rightBoundary) {
            for (let columnIndex = leftBoundary; columnIndex <= rightBoundary; columnIndex++) {
                spiralOrder.push(matrix[topBoundary][columnIndex]);
            }
            topBoundary++;

            for (let rowIndex = topBoundary; rowIndex <= bottomBoundary; rowIndex++) {
                spiralOrder.push(matrix[rowIndex][rightBoundary]);
            }
            rightBoundary--;

            if (topBoundary <= bottomBoundary) {
                for (let columnIndex = rightBoundary; columnIndex >= leftBoundary; columnIndex--) {
                    spiralOrder.push(matrix[bottomBoundary][columnIndex]);
                }
                bottomBoundary--;
            }

            if (leftBoundary <= rightBoundary) {
                for (let rowIndex = bottomBoundary; rowIndex >= topBoundary; rowIndex--) {
                    spiralOrder.push(matrix[rowIndex][leftBoundary]);
                }
                leftBoundary++;
            }
        }

        return spiralOrder;
    }

    getType(): CodingContractName {
        return CodingContractName.SpiralizeMatrix;
    }
}