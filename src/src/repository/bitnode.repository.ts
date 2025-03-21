import { getSave } from "/src/database/save.database";
import { Bitnode} from "/src/entity/bitnode/bitnode";
import { BitNodeOptions } from "/src/entity/bitnode/bitnode.interface";

const BITNODE_CACHE_KEY = "cachedBitnodeNumber";
const BITNODE_OPTIONS_CACHE_KEY = "cachedBitnodeOptions";
const BITNODE_SOURCE_FILES_KEY = "cachedBitnodeSourceFiles";

function isArrayOfNumberPairs(arr: any): arr is [number, number][] {
    return Array.isArray(arr) && arr.every(
        pair =>
            Array.isArray(pair) &&
            pair.length === 2 &&
            typeof pair[0] === "number" &&
            typeof pair[1] === "number"
    );
}

export const getBitnode = (): Bitnode => {
    const cachedBitNodeNumber = localStorage.getItem(BITNODE_CACHE_KEY);
    const cachedBitnodeOptions = localStorage.getItem(BITNODE_OPTIONS_CACHE_KEY);
    const cachedBitnodeSourceFiles = localStorage.getItem(BITNODE_SOURCE_FILES_KEY);

    if (cachedBitNodeNumber && cachedBitnodeOptions && cachedBitnodeSourceFiles) {
        const bitNodeNumber = Number(cachedBitNodeNumber);
        const bitNodeOptions = JSON.parse(cachedBitnodeOptions) as BitNodeOptions;
        const parsedSourceFiles = JSON.parse(cachedBitnodeSourceFiles);

        if (!isArrayOfNumberPairs(parsedSourceFiles)) {
            throw new Error("Cached source files are not in the expected format ([number, number][]).");
        }

        return new Bitnode(bitNodeNumber, bitNodeOptions, parsedSourceFiles);
    }

    throw new Error("BitNode number not found in cache");
};

export const setBitnode = async (): Promise<Bitnode> => {
    const saveFile = await getSave();
    const playerSave = JSON.parse(saveFile.data.PlayerSave);
    const bitNodeNumber = playerSave.data.bitNodeN;

    localStorage.setItem(BITNODE_CACHE_KEY, String(bitNodeNumber));

    const bitNodeOptions = playerSave.data.bitNodeOptions;
    localStorage.setItem(BITNODE_OPTIONS_CACHE_KEY, JSON.stringify(bitNodeOptions));

    const bitNodeSourceFiles = playerSave.data.sourceFiles.data;
    if (!isArrayOfNumberPairs(bitNodeSourceFiles)) {
        throw new Error("Source files from save are not in the expected format ([number, number][]).");
    }
    localStorage.setItem(BITNODE_SOURCE_FILES_KEY, JSON.stringify(bitNodeSourceFiles));

    return new Bitnode(bitNodeNumber, bitNodeOptions, bitNodeSourceFiles);
};