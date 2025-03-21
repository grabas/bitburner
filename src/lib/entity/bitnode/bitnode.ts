import {BitNodeMultipliers, BitNodeOptions} from "/lib/entity/bitnode/bitnode.interface";
import {getBitnodeMults} from "/lib/enum/bitnode.enum";

export class Bitnode {
    number: number
    multipliers: BitNodeMultipliers;
    sourceFiles: [number, number][] = [];
    options: BitNodeOptions;

    constructor(number: number, options: BitNodeOptions, sourceFiles: [number, number][]) {
        this.number = number;
        this.multipliers = getBitnodeMults(number);
        this.sourceFiles = sourceFiles
        this.options = options;
    }

    public hasAccessToSourceFile(sourceFileNumber: number): boolean {
        return this.sourceFiles.some(([num]) => num === sourceFileNumber);
    }

    public hasAccessSingularity(): boolean {
        return this.hasAccessToSourceFile(4);
    }
}