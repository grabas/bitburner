import { NS } from "@ns";

export class BrokerBase {
    protected readonly ns: NS;
    protected budgetPercentage = 100;
    protected purchaseCostLimit = Infinity;

    constructor(ns: NS) {
        this.ns = ns;
    }

    public setBudget(newBudget: number): void {
        this.budgetPercentage = newBudget;
    }

    public setPurchasedCostLimit(newLimit: number): void {
        this.purchaseCostLimit = newLimit;
    }

    protected canAfford = (cost: number): boolean => {
        if (!this.canEverAfford(cost)) throw new Error("Cost is too high");

        const availableMoney = Math.min(
            this.ns.getServerMoneyAvailable("home") * (this.budgetPercentage / 100),
            this.purchaseCostLimit
        );
        return availableMoney >= cost;
    };

    protected canEverAfford = (cost: number): boolean => {
        return cost !== Infinity && cost < this.purchaseCostLimit
    };

    protected secureFunds = async (cost: number): Promise<void> => {
        while (!this.canAfford(cost)) {
            await this.ns.sleep(10000);
        }
    };
}