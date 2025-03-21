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
            "core": this.hacknet.upgradeCore
        }
    }

    private purchaseNode = (): HacknetNode|null => {
        if (!this.canAfford(this.getNewNodeCost())) return null;

        const index = this.hacknet.purchaseNode();
        return new HacknetNode(this.ns, index);
    }

    private getNewNodeCost = (): number => {
        return this.formulas.calculateNodeCost(this.hacknet.numNodes() + 1);
    }

    private getNewNodeRate = (): number => {
        const newNodeGain = this.formulas.calculateMoneyGainRate();
        return this.getNewNodeCost() / newNodeGain;
    }

    private getNodes = (): HacknetNode[] => {
        return Array.from({length: this.hacknet.numNodes()}, (_, i) => new HacknetNode(this.ns, i));
    }

    public getBestDeal = (): Rates | null => {
        const bestDealPerBatch =  this.getNodes()
            .map(node => this.formulas.getBestRate(node))
            .flat()
            .filter(rate => this.canEverAfford(rate.cost ?? Infinity));

        return bestDealPerBatch.length ?
            bestDealPerBatch.reduce((best, rate) => (best.rate ?? Infinity) < (rate.rate ?? Infinity) ? best : rate) :
            null;
    }

    public actOnBestDeal = async (): Promise<void> => {
        if (this.hacknet.numNodes() === 0) {
            this.purchaseNode(); return;
        }

        const bestDeal = this.getBestDeal();
        if (bestDeal && (bestDeal.rate ?? Infinity) < this.getNewNodeRate()) {
            await this.secureFunds(bestDeal.cost as number);
            this.upgradeMap[bestDeal.type](bestDeal.index);
            this.ns.print(`Upgraded node ${bestDeal.index} ${bestDeal.type} for ${this.ns.formatNumber(bestDeal.cost as number)}`);
        } else {
            const newNodeCost = this.getNewNodeCost();

            if (!this.canEverAfford(newNodeCost) && bestDeal === null) {
                throw new Error("No best deal found and new node cost exceeds purchase limit. Exiting...");
            }

            if (this.canAfford(newNodeCost)) {
                this.purchaseNode();
                this.ns.print(`Purchased new node for ${this.ns.formatNumber(newNodeCost)}`);
            }
        }
    }
}
