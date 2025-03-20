import {NS, Singularity} from "@ns";
import { BrokerBase } from "/src/component/broker/broker.base"
import {HomeUpgradeFormulas} from "/src/component/broker/home-upgrade/home-upgrade.formulas";
import {ServerDto} from "/src/entity/server/server.dto";

export class HomeUpgradeBroker extends BrokerBase {
    private formulas: HomeUpgradeFormulas;
    private singularity: Singularity

    constructor(ns: NS) {
        super(ns);
        this.singularity = ns.singularity
        this.formulas = new HomeUpgradeFormulas(ns);
    }

    private upgradeHomeRam = async (home: ServerDto) => {
        await this.secureFunds(this.formulas.calculateUpgradeHomeRamCost(home));
        this.singularity.upgradeHomeRam();

        const message = `RAM Upgraded to ${this.ns.formatRam(home.refresh().ram.max)}`
        this.ns.print(message);
        this.ns.toast(message);
    }

    private upgradeHomeCores = async (home: ServerDto) => {
        await this.secureFunds(this.formulas.getUpgradeHomeCoresCost(home));
        this.singularity.upgradeHomeCores();

        const message = `Cores Upgraded to ${home.refresh().cores}`
        this.ns.print(message);
        this.ns.toast(message);
    }

    public upgradeHome = async (home: ServerDto) => {
        const ramCost = this.formulas.calculateUpgradeHomeRamCost(home);
        const coresCost = this.formulas.getUpgradeHomeCoresCost(home);

        ramCost < coresCost ?
            await this.upgradeHomeRam(home) :
            await this.upgradeHomeCores(home);
    }
}
