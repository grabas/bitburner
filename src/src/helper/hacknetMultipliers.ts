import {NS} from "@ns";

export interface HackNodeMultipliers {
    nodeMoney: number,
    purchaseCost: number,
    levelCost: number
    ramCost: number,
    coreCost: number
}

export const getHacknetMultipliers = (ns: NS): HackNodeMultipliers => {
    const mults = ns.getPlayer().mults;
    return {
        nodeMoney: mults.hacknet_node_money,
        purchaseCost: mults.hacknet_node_purchase_cost,
        levelCost: mults.hacknet_node_level_cost,
        ramCost: mults.hacknet_node_ram_cost,
        coreCost: mults.hacknet_node_core_cost
    } as HackNodeMultipliers;
}
