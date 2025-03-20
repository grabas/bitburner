import {NS} from "@ns";
import {Bitnode} from "/src/entity/bitnode/bitnode";
import {getBitnode} from "/src/repository/bitnode.repository";
import {ServerConstants} from "/src/enum/server-constants.enum";
import {isPowerOfTwo} from "/src/utils/helpers/is-power-of-two";

export class PurchaseServerFormulas {
    private readonly ns: NS;
    private readonly bitnode: Bitnode;

    constructor(ns: NS) {
        this.ns = ns;
        this.bitnode = getBitnode();
    }

    calculatePurchaseServerCost(ram: number): number {
        const sanitizedRam = Math.round(ram);
        if (isNaN(sanitizedRam) || !isPowerOfTwo(sanitizedRam) || !(Math.sign(sanitizedRam) === 1)) {
            return Infinity;
        }

        if (sanitizedRam > this.getPurchaseServerMaxRam()) {
            return Infinity;
        }

        const upg = Math.max(0, Math.log(sanitizedRam) / Math.log(2) - 6);

        return (
            sanitizedRam *
            ServerConstants.BaseCostFor1GBOfRamServer *
            this.bitnode.multipliers.PurchasedServerCost *
            Math.pow(this.bitnode.multipliers.PurchasedServerSoftcap, upg)
        );
    }

    private getPurchaseServerMaxRam(): number {
        const ram = Math.round(ServerConstants.PurchasedServerMaxRam * this.bitnode.multipliers.PurchasedServerMaxRam);
        return 1 << (31 - Math.clz32(ram));
    }
}