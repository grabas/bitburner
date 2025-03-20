import {BitNodeMultipliers} from "/src/entity/bitnode/bitnode-multipliers.interface";
import {getBitNodeMultipliers} from "/src/enum/bitnode.enum";

export interface BitNodeOptions {
    sourceFileOverrides: {
        ctor: string;
        data: any[];
    };
    restrictHomePCUpgrade: boolean;
    disableGang: boolean;
    disableCorporation: boolean;
    disableBladeburner: boolean;
    disable4SData: boolean;
    disableHacknetServer: boolean;
    disableSleeveExpAndAugmentation: boolean;
    intelligenceOverride: number | undefined;
}

export class Bitnode {
    number: number
    multipliers: BitNodeMultipliers;
    sourceFiles: [number, number][] = [];
    options: BitNodeOptions;

    constructor(number: number, options: BitNodeOptions, sourceFiles: [number, number][]) {
        this.number = number;
        this.multipliers = getBitNodeMultipliers(number);
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