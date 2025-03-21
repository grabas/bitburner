import {NS} from "@ns";
import { BrokerBase } from "/lib/component/broker/broker.base"
import {ServerBrokerConfig as Config} from "/lib/component/broker/purchase-server/purchase-server.config";
import {PurchaseServerFormulas} from "/lib/component/broker/purchase-server/purchase-server.formulas";

export class PurchaseServerBroker extends BrokerBase {
    private formulas: PurchaseServerFormulas;

    constructor(ns: NS) {
        super(ns);
        this.setBudget(Config.BUDGET_PERCENTAGE);

        this.formulas = new PurchaseServerFormulas(ns);
    }

    public upgradeServer = async (server: string, ram: number) => {
        await this.secureFunds(this.formulas.calculatePurchaseServerCost(ram));

        if (this.ns.serverExists(server) && this.ns.getServerMaxRam(server) < ram) {
            this.ns.upgradePurchasedServer(server, ram)
            this.ns.print(`Upgraded ${server} to ${this.ns.formatRam(ram)}`);
        } else {
            this.ns.purchaseServer(server, ram);
            this.ns.print(`Purchased ${server} with ${this.ns.formatRam(ram)}`);
        }
    }
}
