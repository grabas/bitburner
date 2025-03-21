import {NS, Singularity} from "@ns";
import { BrokerBase } from "/src/component/broker/broker.base"
import {HomeUpgradeFormulas} from "/src/component/broker/home-upgrade/home-upgrade.formulas";
import {ServerDto} from "/src/entity/server/server.dto";
import {getBitnode} from "/src/repository/bitnode.repository";
import {increamentNumberOfCores} from "/src/utils/home-cores";

export class HomeUpgradeBroker extends BrokerBase {
    private formulas: HomeUpgradeFormulas;
    private singularity: Singularity

    constructor(ns: NS) {
        super(ns);

        if (!getBitnode().hasAccessSingularity()) {
            throw new Error("You need to have access to Singularity Functions to use home upgrade broker");
        }

        this.singularity = ns.singularity
        this.formulas = new HomeUpgradeFormulas();
    }

    private upgradeHomeRam = async (home: ServerDto) => {
        await this.secureFunds(this.formulas.calculateUpgradeHomeRamCost(home));
        if (this.singularity.upgradeHomeRam()) {
            const message = `RAM Upgraded to ${this.ns.formatRam(home.refresh().ram.max)}`
            this.ns.print(message);
            this.ns.toast(message);
        }
    }

    private upgradeHomeCores = async (home: ServerDto) => {
        await this.secureFunds(this.formulas.getUpgradeHomeCoresCost(home));
        if (this.singularity.upgradeHomeCores()) {
            increamentNumberOfCores()
            const message = `Cores Upgraded to ${home.refresh().cores}`
            this.ns.print(message);
            this.ns.toast(message);
        }
    }

    public upgradeHome = async (home: ServerDto) => {
        const ramCost = this.formulas.calculateUpgradeHomeRamCost(home);
        const coresCost = this.formulas.getUpgradeHomeCoresCost(home);

        ramCost < coresCost ?
            await this.upgradeHomeRam(home) :
            await this.upgradeHomeCores(home);
    }
}
