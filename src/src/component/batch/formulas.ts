import {NS} from "@ns";
import { Config } from "./config";
import { ScriptsEnum } from "/src/enum/scripts.enum";

export const getHackMultipler = (ns: NS, target: string): number => {
    const entries = Array.from({ length: 299 }, (_, i) => ({
        multiplier: (i + 1) / 1000,
        value: getBatchIncomePerSecond(ns, target, (i + 1) / 1000),
    })).filter(
        (entry): entry is { multiplier: number; value: number } =>
            entry.value !== null
    );

    if (entries.length === 0) return 0;

    const best = entries.reduce((acc, cur) => (cur.value > acc.value ? cur : acc));
    return best.multiplier;
};

export function getBatchIncomePerSecond(ns: NS, target: string, hackMultiplier: number): number | null {
    const host = ns.getHostname();
    const availableRam = ns.getServerMaxRam(host) - Config.SERVER_RESERVE;
    const growMultiplier = 1 / (1 - hackMultiplier) + Config.GROW_BUFFER;
    const weakenTime = ns.getWeakenTime(target);
    const targetAmount = ns.getServerMaxMoney(target) * hackMultiplier;

    const hackThreads = Math.ceil(ns.hackAnalyzeThreads(target, targetAmount));
    if (hackThreads === -1) return null;

    const duration = weakenTime + 2 * Config.TICK;
    const growThreads = Math.ceil(ns.growthAnalyze(target, growMultiplier));

    const ramPerBatch =
        hackThreads * ScriptsEnum.HACK_BATCH.size +
        growThreads * ScriptsEnum.GROW_BATCH.size +
        Math.ceil(growThreads * Config.WEAKEN_BUFFER) * ScriptsEnum.GROW_BATCH.size * 2;

    const maxBatchesByRam = Math.floor(availableRam / ramPerBatch);
    const maxBatchesByTime = Math.ceil(duration / Config.BATCH_SEPARATION);
    const batchSize = Math.min(maxBatchesByRam, maxBatchesByTime);

    const cycleDuration = (batchSize - 1) * Config.BATCH_SEPARATION + duration + Config.TIME_BUFFER;
    const incomePerCycle = batchSize * targetAmount;

    return incomePerCycle / (cycleDuration / 1000);
}