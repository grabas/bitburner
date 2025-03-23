import {NS, Singularity} from "@ns";
import { BrokerBase } from "/lib/component/broker/broker.base"
import {HomeUpgradeFormulas} from "/lib/component/broker/home-upgrade/home-upgrade.formulas";
import {ServerDto} from "/lib/entity/server/server.dto";
import {getBitnode} from "/lib/repository/bitnode.repository";
import {getNumberOfCores, increamentNumberOfCores} from "/lib/utils/home-cores";

export class HomeUpgradeBroker extends BrokerBase {
    private formulas: HomeUpgradeFormulas;
    private singularity: Singularity

    constructor(ns: NS) {
        super(ns);

        if (!getBitnode().hasAccessSingularity()) {
            throw new Error("You need to have access to Singularity Functions to use home upgrade broker");
        }

        this.singularity = ns.singularity
        this.formulas = new HomeUpgradeFormulas(ns);
    }

    private upgradeHomeRam = async () => {
        if (this.singularity.upgradeHomeRam()) {
            const message = `RAM Upgraded to ${this.ns.getServerMaxRam("home")}`
            this.ns.print(message);
            this.ns.toast(message);
        }
    }

    private upgradeHomeCores = async () => {
        await this.secureFunds(this.formulas.getUpgradeHomeCoresCost());
        if (this.singularity.upgradeHomeCores()) {
            increamentNumberOfCores()
            const message = `Cores Upgraded to ${getNumberOfCores()}`
            this.ns.print(message);
            this.ns.toast(message);
        }
    }

    public upgradeHome = async () => {
        const ramCost = this.formulas.calculateUpgradeHomeRamCost();
        const coresCost = this.formulas.getUpgradeHomeCoresCost();

        ramCost < coresCost ?
            await this.upgradeHomeRam() :
            await this.upgradeHomeCores();
    }
}
