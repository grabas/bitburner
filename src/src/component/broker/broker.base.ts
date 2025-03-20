import { NS } from "@ns";

export class BrokerBase {
    protected readonly ns: NS;
    protected _budget_percentage = 100;

    constructor(ns: NS) {
        this.ns = ns;
    }

    public setBudget(newBudget: number): void {
        this._budget_percentage = newBudget;
    }

    protected canAfford = (cost: number): boolean => {
        const availableMoney = this.ns.getServerMoneyAvailable("home") * (this._budget_percentage / 100);
        return availableMoney >= cost;
    };

    protected secureFunds = async (cost: number): Promise<void> => {
        while (!this.canAfford(cost)) {
            await this.ns.sleep(10000);
        }
    };
}