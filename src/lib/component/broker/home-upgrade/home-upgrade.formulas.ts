import {ServerDto} from "/lib/entity/server/server.dto";
import {ServerConstants} from "/lib/enum/server-constants.enum";
import {Bitnode} from "/lib/entity/bitnode/bitnode";
import {getBitnode} from "/lib/repository/bitnode.repository";
import {NS} from "@ns";
import {getNumberOfCores} from "/lib/utils/home-cores";

export class HomeUpgradeFormulas {
    private readonly ns: NS
    private readonly bitnode: Bitnode
    constructor(ns: NS) {
        this.ns = ns
        this.bitnode = getBitnode()
    }

    public calculateUpgradeHomeRamCost(): number {
        const currentRam = this.ns.getServerMaxRam("home");
        const numUpgrades = Math.log2(currentRam);

        const mult = Math.pow(1.58, numUpgrades);
        return currentRam * ServerConstants.BaseCostFor1GBOfRamHome * mult * this.bitnode.multipliers.HomeComputerRamCost;
    }

    public getUpgradeHomeCoresCost(): number {
        return 1e9 * Math.pow(7.5, getNumberOfCores());
    }
}
