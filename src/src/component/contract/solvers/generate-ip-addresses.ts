import { ISolver } from '../solver.interface.js';
import {CodingContractName} from "/src/component/contract/contract-names.enum";

export class GenerateIpAddresses implements ISolver<CodingContractName.GenerateIPAddresses> {
    solve(data: string): string[] {
        const result: string[] = [];
        this.backtrack(data, 0, [], result);
        return result;
    }

    private backtrack(ip: string, start: number, path: string[], result: string[]): void {
        if (path.length === 4 && start === ip.length) {
            result.push(path.join('.'));
            return;
        }

        if (path.length >= 4) return;

        for (let i = 1; i <= 3; i++) {
            if (start + i > ip.length) break;

            const segment = ip.substring(start, start + i);
            if (!this.isValidSegment(segment)) continue;

            this.backtrack(ip, start + i, [...path, segment], result);
        }
    }

    private isValidSegment(segment: string): boolean {
        if (segment.length > 1 && segment.startsWith("0")) return false;
        return parseInt(segment) <= 255;
    }

    getType(): CodingContractName {
        return CodingContractName.GenerateIPAddresses;
    }
}