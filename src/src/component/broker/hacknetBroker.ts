import { Broker } from "/src/component/broker/broker.js"
import {Hacknet, HacknetNodesFormulas, NS} from "@ns";
import {HacknetNode, IRates} from "/src/entity/hacknet/hacknetNode";
import {getHacknetMultipliers} from "/src/helper/hacknetMultipliers";

export async function main(ns: NS) {
    ns.disableLog("ALL");
}

type HacknetUpgradeFunction = (nodeIndex: number, quantity?: number) => boolean;

interface UpgradeMap {
    level: HacknetUpgradeFunction;
    ram: HacknetUpgradeFunction;
    core: HacknetUpgradeFunction;
}

export class HacknetBroker extends Broker {
    private hacknet: Hacknet
    private formulas: HacknetNodesFormulas;
    private readonly upgradeMap: UpgradeMap;

    constructor(ns: NS) {
        super(ns);
        this.hacknet = ns.hacknet;
        this.formulas = ns.formulas.hacknetNodes;
        this.upgradeMap = {
            "level": this.hacknet.upgradeLevel,
            "ram": this.hacknet.upgradeRam,
            "core": this.hacknet.upgradeCore
        }
    }

    private purchaseNode = async (): Promise<HacknetNode> => {
        await this.secureFunds(this.getNewNodeCost());
        const index = this.hacknet.purchaseNode();

        return new HacknetNode(this.ns, index);
    }

    private getNewNodeCost = (): number => {
        return this.formulas.hacknetNodeCost(1, getHacknetMultipliers(this.ns).purchaseCost);
    }

    private getNewNodeRate = (): number => {
        const newNodeGain = this.formulas.moneyGainRate(1, 1, 1, getHacknetMultipliers(this.ns).nodeMoney);
        return newNodeGain / this.getNewNodeCost();
    }

    private getNodes = (): HacknetNode[] => {
        return Array.from({length: this.hacknet.numNodes()}, (_, i) => new HacknetNode(this.ns, i));
    }

    private getBestDeal = (): IRates => {
        return this.getNodes()
            .map(node => node.rates).flat()
            .filter(rate => this.canAfford(rate.cost))
            .reduce((best, rate) => best.rate > rate.rate ? best : rate);
    }

    public test = async (): Promise<void> => {
        return this.getNodes()
            .map(node => node.rates).flat()
            .forEach(rate => this.ns.tprint(`${JSON.stringify(rate, null, 2)}`));
        // eslint-disable-next-line no-constant-condition
        /*while (true) {
            const bestDeal = this.getBestDeal();
            const newNodeRate = this.getNewNodeRate();

            if (bestDeal.rate > newNodeRate) {
                this.upgradeMap[bestDeal.type](bestDeal.index);
                this.ns.tprint(`Upgraded node ${bestDeal.index} for ${bestDeal.cost}`);
            } else {
                this.ns.tprint(`Purchasing new node for ${this.getNewNodeCost()}`);
                await this.purchaseNode();
            }

            await this.ns.sleep(1000);
        }*/
    }
}
