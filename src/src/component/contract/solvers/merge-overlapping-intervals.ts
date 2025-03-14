import { ISolver } from '../solver.interface.js';
import { CodingContractName } from "@ns";

export class MergeOverlappingIntervals implements ISolver<CodingContractName.MergeOverlappingIntervals> {
    solve(intervals: [number, number][]): [number, number][] {
        intervals.sort((a, b) => a[0] - b[0]);
        const mergedIntervals: [number, number][] = [];

        for (const [start, end] of intervals) {
            if (
                mergedIntervals.length === 0 ||
                mergedIntervals[mergedIntervals.length - 1][1] < start
            ) {
                mergedIntervals.push([start, end]);
            } else {
                mergedIntervals[mergedIntervals.length - 1][1] = Math.max(
                    mergedIntervals[mergedIntervals.length - 1][1],
                    end
                );
            }
        }
        return mergedIntervals;
    }

    getType(): CodingContractName {
        return CodingContractName.MergeOverlappingIntervals;
    }
}