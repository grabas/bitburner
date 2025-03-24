import {NS} from "@ns";
import {HacknetNode} from "/lib/entity/hacknet/hacknet-node";
import {HacknetNodeConstants} from "/lib/component/broker/hacknet/hacknet.enum";
import {Bitnode} from "/lib/entity/bitnode/bitnode";
import {getBitnode} from "/lib/repository/bitnode.repository";

export interface Rates {
    index: number,
    cost: number,
    type: "level" | "ram" | "core" | "newNode",
    gain: number,
    rate: number
}

export interface HackNodeMultipliers {
    nodeMoney: number,
    purchaseCost: number,
    levelCost: number
    ramCost: number,
    coreCost: number
}

export const getHacknodeMultipliers = (ns: NS): HackNodeMultipliers => {
    const mults = ns.getPlayer().mults;
    return {
        nodeMoney: mults.hacknet_node_money,
        purchaseCost: mults.hacknet_node_purchase_cost,
        levelCost: mults.hacknet_node_level_cost,
        ramCost: mults.hacknet_node_ram_cost,
        coreCost: mults.hacknet_node_core_cost
    } as HackNodeMultipliers;
}

export class HacknetFormulas {
    private readonly multipliers: HackNodeMultipliers;
    private readonly bitnode: Bitnode;

    constructor(ns: NS) {
        this.bitnode = getBitnode();
        this.multipliers = getHacknodeMultipliers(ns);
    }

    public calculateNodeCost(n = 1): number {
        if (n <= 0) {
            return 0;
        }
        return HacknetNodeConstants.BaseCost * Math.pow(HacknetNodeConstants.PurchaseNextMult, n - 1) * this.multipliers.purchaseCost;
    }

    public calculateGainToCost = (hacknetNode: HacknetNode): Rates[] =>
        (["level", "ram", "core"] as const).map(type => this.calculateUpgradeGTC(hacknetNode, type));

    private calculateUpgradeGTC = (
        hacknetNode: HacknetNode,
        type: "level" | "ram" | "core",
        amount = 1
    ): Rates => {
        let cost: number;
        let newLevel = hacknetNode.level;
        let newRam = hacknetNode.ram;
        let newCores = hacknetNode.cores;

        switch (type) {
            case "level":
                cost = this.calculateLevelUpgradeCost(hacknetNode.level, amount);
                newLevel += amount;
                break;
            case "ram":
                cost = this.calculateRamUpgradeCost(hacknetNode.ram, amount);
                newRam += amount;
                break;
            case "core":
                cost = this.calculateCoreUpgradeCost(hacknetNode.cores, amount);
                newCores += amount;
                break;
        }

        const gain = cost !== Infinity ? this.calculateMoneyGainRate(newLevel, newRam, newCores, hacknetNode.production) : 0;
        return {
            index: hacknetNode.index,
            cost,
            type,
            gain,
            rate: gain !== 0 && cost !== Infinity ? (cost / gain) : null,
        } as Rates;
    };

    public calculateMoneyGainRate(level = 1, ram = 1, cores = 1, currentProduction = 0): number {
        const gainPerLevel = HacknetNodeConstants.MoneyGainPerLevel;

        const levelMult = level * gainPerLevel;
        const ramMult = Math.pow(1.035, ram - 1);
        const coresMult = (cores + 5) / 6;
        const totalProduction = levelMult * ramMult * coresMult * this.multipliers.nodeMoney * this.bitnode.multipliers.HacknetNodeMoney;

        return totalProduction - currentProduction;
    }

    public calculateLevelUpgradeCost(startingLevel: number, extraLevels = 1): number {
        const sanitizedLevels = Math.round(extraLevels);
        if (isNaN(sanitizedLevels) || sanitizedLevels < 1) {
            return 0;
        }

        if (startingLevel >= HacknetNodeConstants.MaxLevel) {
            return Infinity;
        }

        const mult = HacknetNodeConstants.UpgradeLevelMult;
        let totalMultiplier = 0;
        let currLevel = startingLevel - 1;
        for (let i = 0; i < sanitizedLevels; ++i) {
            totalMultiplier += Math.pow(mult, currLevel);
            ++currLevel;
        }

        return HacknetNodeConstants.LevelBaseCost * totalMultiplier * this.multipliers.levelCost;
    }

    public calculateRamUpgradeCost(startingRam: number, extraLevels = 1): number {
        const sanitizedLevels = Math.round(extraLevels);
        if (isNaN(sanitizedLevels) || sanitizedLevels < 1) {
            return 0;
        }

        if (startingRam >= HacknetNodeConstants.MaxRam) {
            return Infinity;
        }

        let totalCost = 0;
        let numUpgrades = Math.round(Math.log2(startingRam));
        let currentRam = startingRam;

        for (let i = 0; i < sanitizedLevels; ++i) {
            const baseCost = currentRam * HacknetNodeConstants.RamBaseCost;
            const mult = Math.pow(HacknetNodeConstants.UpgradeRamMult, numUpgrades);

            totalCost += baseCost * mult;

            currentRam *= 2;
            ++numUpgrades;
        }

        totalCost *= this.multipliers.ramCost;

        return totalCost;
    }

    public calculateCoreUpgradeCost(startingCore: number, extraLevels = 1): number {
        const sanitizedCores = Math.round(extraLevels);
        if (isNaN(sanitizedCores) || sanitizedCores < 1) {
            return 0;
        }

        if (startingCore >= HacknetNodeConstants.MaxCores) {
            return Infinity;
        }

        const coreBaseCost = HacknetNodeConstants.CoreBaseCost;
        const mult = HacknetNodeConstants.UpgradeCoreMult;
        let totalCost = 0;
        let currentCores = startingCore;
        for (let i = 0; i < sanitizedCores; ++i) {
            totalCost += coreBaseCost * Math.pow(mult, currentCores - 1);
            ++currentCores;
        }

        totalCost *= this.multipliers.coreCost;

        return totalCost;
    }
}