import {HacknetNodesFormulas, NS} from "@ns";
import {getHacknetMultipliers} from "/src/helper/hacknetMultipliers";

export interface IRates {
    index: number,
    cost: number,
    type: "level" | "ram" | "core",
    gain: number,
    rate: number
}

export class HacknetNode {
    ns: NS;
    index: number;
    name: string;
    level: number;
    ram: number;
    cores: number;
    production: number;
    timeOnline: number;
    totalProduction: number;
    formulas: HacknetNodesFormulas;
    rates: IRates[];

    constructor(ns: NS, index: number) {
        this.ns = ns;
        const data = ns.hacknet.getNodeStats(index);

        const match = data.name.match(/-(\d+)$/);
        this.index = match ? Number(match[1]) : NaN;
        this.name = data.name;
        this.level = data.level;
        this.ram = data.ram;
        this.cores = data.cores;
        this.production = data.production;
        this.timeOnline = data.timeOnline;
        this.totalProduction = data.totalProduction;
        this.formulas = ns.formulas.hacknetNodes;
        this.rates = this.calculateGainToCost();
    }

    private calculateLevelGTC = (): IRates => {
        const mults = getHacknetMultipliers(this.ns);

        const cost = this.formulas.levelUpgradeCost(this.level, 1, mults.levelCost);
        const gain = this.formulas.moneyGainRate(this.level + 1, this.ram, this.cores, mults.nodeMoney);

        return {
            index: this.index,
            cost: cost,
            type: "level",
            gain: gain,
            rate: gain / cost
        } as IRates;
    }

    private calculateRamGTC = (): IRates => {
        const mults = getHacknetMultipliers(this.ns);

        const cost = this.formulas.ramUpgradeCost(this.level, 1, mults.ramCost);
        const gain = this.formulas.moneyGainRate(this.level, this.ram + 1, this.cores, mults.nodeMoney);

        return {
            index: this.index,
            cost: cost,
            type: "ram",
            gain: gain,
            rate: gain / cost
        } as IRates;
    }

    private calculateCoreGTC = (): IRates => {
        const mults = getHacknetMultipliers(this.ns);

        const cost = this.formulas.coreUpgradeCost(this.level, 1, mults.coreCost);
        const gain = this.formulas.moneyGainRate(this.level, this.ram, this.cores + 1, mults.nodeMoney);

        return {
            index: this.index,
            cost: cost,
            type: "core",
            gain: gain,
            rate: gain / cost
        } as IRates;
    }

    private calculateGainToCost = (): IRates[] => {
        return [
            this.calculateLevelGTC(),
            this.calculateRamGTC(),
            this.calculateCoreGTC()
        ]
    }

    public getBestRate = (): IRates => {
        return this.rates.reduce((max, item) => (item.rate > max.rate ? item : max), this.rates[0]);
    }
}