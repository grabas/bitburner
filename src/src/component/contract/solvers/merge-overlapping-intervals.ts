import { ISolver } from '../solver.interface.js';
import { CodingContractName } from "/src/enum/contract-names.enum";

export class MergeOverlappingIntervals implements ISolver<CodingContractName.MergeOverlappingIntervals> {
    solve(intervals: [number, number][]): [number, number][] {
        if (!intervals || intervals.length === 0) return [];

        intervals.sort((a, b) => a[0] - b[0]);

        const mergedIntervals: [number, number][] = [];
        let [currentStart, currentEnd] = intervals[0];

        for (let i = 1; i < intervals.length; i++) {
            const [nextStart, nextEnd] = intervals[i];

            if (nextStart <= currentEnd) {
                currentEnd = Math.max(currentEnd, nextEnd);
            } else {
                mergedIntervals.push([currentStart, currentEnd]);
                [currentStart, currentEnd] = [nextStart, nextEnd];
            }
        }

        mergedIntervals.push([currentStart, currentEnd]);

        return mergedIntervals;
    }

    getType(): CodingContractName {
        return CodingContractName.MergeOverlappingIntervals;
    }
}