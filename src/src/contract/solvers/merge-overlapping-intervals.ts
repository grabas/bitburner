import { ISolver } from '../solver.interface.js';

export class MergeOverlappingIntervals implements ISolver<number[][], number[][]> {
    solve(intervals: number[][]): number[][] {
        intervals.sort((firstInterval, secondInterval) => firstInterval[0] - secondInterval[0]);
        const mergedIntervals: number[][] = [];
        for (const currentInterval of intervals) {
            if (
                mergedIntervals.length === 0 ||
                mergedIntervals[mergedIntervals.length - 1][1] < currentInterval[0]
            ) {
                mergedIntervals.push(currentInterval);
            } else {
                mergedIntervals[mergedIntervals.length - 1][1] = Math.max(
                    mergedIntervals[mergedIntervals.length - 1][1],
                    currentInterval[1]
                );
            }
        }
        return mergedIntervals;
    }

    getType(): string {
        return 'Merge Overlapping Intervals';
    }
}