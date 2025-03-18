import {getSave} from "/src/database/save.database";
import { Bitnode, BitNodeOptions } from "/src/entity/bitnode/bitnode";

const BITNODE_CACHE_KEY = "cachedBitnodeNumber"; // Cache key
const BITNODE_OPTIONS_CACHE_KEY = "cachedBitnodeOptions"; // Cache key

export const getBitnode = (): Bitnode => {
    const cachedBitNodeNumber = localStorage.getItem(BITNODE_CACHE_KEY);
    const cachedBitnodeOptions = localStorage.getItem(BITNODE_OPTIONS_CACHE_KEY)
    if (cachedBitNodeNumber && cachedBitnodeOptions) {
        return new Bitnode(Number(cachedBitNodeNumber), JSON.parse(cachedBitnodeOptions) as BitNodeOptions);
    }

    throw new Error("BitNode number not found in cache");
};

export const setBitnode = async (): Promise<Bitnode> => {
    const saveFile = await getSave();
    const bitNodeNumber = JSON.parse(saveFile.data.PlayerSave).data.bitNodeN;

    localStorage.setItem(BITNODE_CACHE_KEY, String(bitNodeNumber));

    const bitNodeOptions = JSON.parse(saveFile.data.PlayerSave).data.bitNodeOptions;
    localStorage.setItem(BITNODE_OPTIONS_CACHE_KEY, JSON.stringify(bitNodeOptions));

    return new Bitnode(bitNodeNumber, bitNodeOptions);
};