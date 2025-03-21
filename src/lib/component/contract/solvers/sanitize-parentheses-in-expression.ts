import { ISolver } from '../solver.interface.js';
import {CodingContractName} from "/lib/component/contract/contract-names.enum";

export class SanitizeParenthesesInExpression implements ISolver<CodingContractName.SanitizeParenthesesInExpression> {
    solve(expression: string): string[] {
        const isValid = (exp: string): boolean => {
            let balance = 0;
            for (const char of exp) {
                if (char === '(') balance++;
                else if (char === ')') {
                    if (balance === 0) return false;
                    balance--;
                }
            }
            return balance === 0;
        };

        let currentLevel = new Set([expression]);
        let foundValid = false;
        const validExpressions = new Set<string>();

        while (currentLevel.size > 0) {
            for (const exp of currentLevel) {
                if (isValid(exp)) {
                    validExpressions.add(exp);
                    foundValid = true;
                }
            }
            if (foundValid) return Array.from(validExpressions);
            const nextLevel = new Set<string>();
            for (const exp of currentLevel) {
                for (let i = 0; i < exp.length; i++) {
                    if (exp[i] !== '(' && exp[i] !== ')') continue;
                    nextLevel.add(exp.slice(0, i) + exp.slice(i + 1));
                }
            }
            currentLevel = nextLevel;
        }
        return [""];
    }

    getType(): CodingContractName {
        return CodingContractName.SanitizeParenthesesInExpression;
    }
}