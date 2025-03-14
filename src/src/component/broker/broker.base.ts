import {NS} from "@ns";

export class BrokerBase {
    protected readonly ns: NS;

    constructor (ns: NS) {
        this.ns = ns;
    }

    protected canAfford = (cost: number) => {
        return this.ns.getServerMoneyAvailable("home") > cost;
    }

    protected secureFunds = async (cost: number) => {
        while (!this.canAfford(cost)) {
            await this.ns.sleep(10000);
        }
    }
}
