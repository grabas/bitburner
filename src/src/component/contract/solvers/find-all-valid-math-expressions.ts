import { ISolver } from '../solver.interface.js';
import {CodingContractName} from "/src/enum/contract-names.enum";

export class FindAllValidMathExpressions implements ISolver<CodingContractName.FindAllValidMathExpressions> {
    solve([digits, target]: [string, number]): string[] {
        const results: string[] = [];

        const backtrack = (index: number, expression: string, currentValue: number, lastOperand: number) => {
            if (index === digits.length) {
                if (currentValue === target) results.push(expression);
                return;
            }

            for (let i = index; i < digits.length; i++) {
                if (i > index && digits[index] === '0') break;
                const currentStr = digits.substring(index, i + 1);
                const currentNum = Number(currentStr);

                if (index === 0) {
                    backtrack(i + 1, currentStr, currentNum, currentNum);
                } else {
                    backtrack(i + 1, `${expression}+${currentStr}`, currentValue + currentNum, currentNum);
                    backtrack(i + 1, `${expression}-${currentStr}`, currentValue - currentNum, -currentNum);
                    backtrack(i + 1, `${expression}*${currentStr}`, currentValue - lastOperand + lastOperand * currentNum, lastOperand * currentNum);
                }
            }
        };

        backtrack(0, "", 0, 0);
        return results;
    }

    getType(): CodingContractName {
        return CodingContractName.FindAllValidMathExpressions;
    }
}