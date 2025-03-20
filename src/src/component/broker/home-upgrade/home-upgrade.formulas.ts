import {NS} from "@ns";
import { BrokerBase } from "/src/component/broker/broker.base"
import {ServerDto} from "/src/entity/server/server.dto";
import {ServerConstants} from "/src/enum/server-constants.enum";
import {Bitnode} from "/src/entity/bitnode/bitnode";
import {getBitnode} from "/src/repository/bitnode.repository";

export class HomeUpgradeFormulas extends BrokerBase {
    private readonly bitnode: Bitnode
    constructor(ns: NS) {
        super(ns);
        this.bitnode = getBitnode()
    }

    public calculateUpgradeHomeRamCost(home: ServerDto): number {
        const currentRam = home.refresh().ram.max
        const numUpgrades = Math.log2(currentRam);

        const mult = Math.pow(1.58, numUpgrades);
        return currentRam * ServerConstants.BaseCostFor1GBOfRamHome * mult * this.bitnode.multipliers.HomeComputerRamCost;
    }

    public getUpgradeHomeCoresCost(home: ServerDto): number {
        return 1e9 * Math.pow(7.5, home.refresh().cores);
    }
}
