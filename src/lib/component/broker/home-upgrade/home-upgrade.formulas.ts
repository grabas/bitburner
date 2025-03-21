import {ServerDto} from "/lib/entity/server/server.dto";
import {ServerConstants} from "/lib/enum/server-constants.enum";
import {Bitnode} from "/lib/entity/bitnode/bitnode";
import {getBitnode} from "/lib/repository/bitnode.repository";

export class HomeUpgradeFormulas {
    private readonly bitnode: Bitnode
    constructor() {
        this.bitnode = getBitnode()
    }

    public calculateUpgradeHomeRamCost(home: ServerDto): number {
        const currentRam = home.refresh().ram.realMax;
        const numUpgrades = Math.log2(currentRam);

        const mult = Math.pow(1.58, numUpgrades);
        return currentRam * ServerConstants.BaseCostFor1GBOfRamHome * mult * this.bitnode.multipliers.HomeComputerRamCost;
    }

    public getUpgradeHomeCoresCost(home: ServerDto): number {
        return 1e9 * Math.pow(7.5, home.refresh().cores);
    }
}
