import {BitNodeMultipliers} from "/src/entity/bitnode/bitnode-multipliers.interface";
import {getBitNodeMultipliers} from "/src/enum/bitnode.enum";

export class Bitnode {
    number: number
    multipliers: BitNodeMultipliers;

    constructor(number: number) {
        this.number = number;
        this.multipliers = getBitNodeMultipliers(number);
    }
}