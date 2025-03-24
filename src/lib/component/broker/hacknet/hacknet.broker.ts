import { BrokerBase } from "/lib/component/broker/broker.base.js"
import {Hacknet, NS} from "@ns";
import {HacknetNode} from "/lib/entity/hacknet/hacknet-node";
import {HacknetFormulas, Rates} from "/lib/component/broker/hacknet/hacknet.formulas";
import {HacknetBrokerConfig} from "/lib/component/broker/hacknet/hacknet.config";

export async function main(ns: NS) {
    ns.disableLog("ALL");
}

type HacknetUpgradeFunction = (nodeIndex: number, quantity?: number) => boolean;

interface UpgradeMap {
    level: HacknetUpgradeFunction;
    ram: HacknetUpgradeFunction;
    core: HacknetUpgradeFunction;
    newNode: () => HacknetNode|null;
}

export class HacknetBroker extends BrokerBase {
    private hacknet: Hacknet
    private formulas: HacknetFormulas;
    private readonly upgradeMap: UpgradeMap;

    constructor(ns: NS) {
        super(ns);
        this.setBudget(HacknetBrokerConfig.BUDGET_PERCENTAGE);
        this.setPurchasedCostLimit(HacknetBrokerConfig.PURCHASE_COST_LIMIT);

        this.hacknet = ns.hacknet;
        this.formulas = new HacknetFormulas(ns);
        this.upgradeMap = {
            "level": this.hacknet.upgradeLevel,
            "ram": this.hacknet.upgradeRam,
            "core": this.hacknet.upgradeCore,
            "newNode": this.purchaseNode
        }
    }

    private getNodes = (): HacknetNode[] => {
        return Array.from({length: this.hacknet.numNodes()}, (_, i) => new HacknetNode(this.ns, i));
    }

    private purchaseNode = (): HacknetNode|null => {
        if (!this.canAfford(this.getNewNodeCost())) return null;

        const index = this.hacknet.purchaseNode();
        return new HacknetNode(this.ns, index);
    }

    private getNewNodeCost = (): number => {
        return this.formulas.calculateNodeCost(this.hacknet.numNodes() + 1);
    }

    private getNewNodeRate = (): Rates => {
        const newNodeGain = this.formulas.calculateMoneyGainRate();
        return {
            index: -1,
            cost: this.getNewNodeCost(),
            type: "newNode",
            gain: newNodeGain,
            rate: this.getNewNodeCost() / newNodeGain
        };
    }

    public getDeals = (): Rates[] => {
        const deals = this.getNodes()
            .map(node => this.formulas.getBestRate(node))
            .flat()
            .filter(rate => this.canEverAfford(
                this.effectiveCost(rate.cost as number)
            ));

        if (this.canEverAfford(this.getNewNodeCost())) deals.push(this.getNewNodeRate())

        return deals;
    }

    public getBestDealICanAfford = (): Rates | null => {
        const getBestDealsPerNode =
            this.getDeals()
                .filter((rate) => this.canAfford(rate.cost as number))

        return getBestDealsPerNode.length ?
            getBestDealsPerNode.reduce((best, rate) => (best.rate ?? Infinity) < (rate.rate ?? Infinity) ? best : rate) :
            null;
    }

    public actOnBestDeal = async (): Promise<void> => {
        if (this.hacknet.numNodes() === 0) {
            this.purchaseNode(); return;
        }

        if (!this.getDeals().length) {
            throw new Error("No more deals to me made. Exiting...");
        }

        const bestDeal = this.getBestDealICanAfford();

        if (bestDeal) {
            this.upgradeMap[bestDeal.type](bestDeal.index);
            this.ns.print(`Upgraded node ${bestDeal.index} ${bestDeal.type} for ${this.ns.formatNumber(bestDeal.cost as number)}`);
        }
    }

    private effectiveCost = (cost: number | null): number => cost === null ? Infinity : cost;
}
