import { NS } from "@ns";
import { getHackMultipler } from "./formulas";
import { Config } from "./config";
import { Scripts } from "/src/enum/scripts";

interface BatchScript {
    path: string;
    size: number;
}

interface BatchActionStep {
    script: BatchScript;
    sleepTime: number;
    threads: number;
}

interface Income {
    perCycle: number;
    perSecond: number;
}

export class Action {
    private readonly ns: NS;
    public readonly target: string;
    public readonly host: string;
    public readonly hackChance: number;
    public readonly duration: number;
    public readonly action: BatchActionStep[];
    public readonly ramPerBatch: number;
    public readonly batchSize: number;
    public readonly totalRam: number;
    public readonly cycleDuration: number;
    public readonly targetAmount: number;
    public readonly income: Income;
    public readonly moneyCapacity: number;

    constructor(ns: NS, target: string) {
        this.ns = ns;
        this.target = target;
        this.host = ns.getHostname();
        this.hackChance = ns.hackAnalyzeChance(target);

        const hackMultiplier = getHackMultipler(ns, target);

        const growMultiplier = 1 / (1 - hackMultiplier) + Config.GROW_BUFFER;
        const growThreads = Math.ceil(ns.growthAnalyze(target, growMultiplier));

        const weakenThreads = Math.ceil(growThreads * Config.WEAKEN_BUFFER);
        const weakenTime = ns.getWeakenTime(target);

        this.duration = weakenTime + 2 * Config.TICK;

        const targetAmount = ns.getServerMaxMoney(target) * hackMultiplier;

        this.action = [{
            script: Scripts.HACK_BATCH,
            sleepTime: weakenTime - Config.TICK - ns.getHackTime(target),
            threads: Math.ceil(ns.hackAnalyzeThreads(target, targetAmount))
        }, {
            script: Scripts.GROW_BATCH,
            sleepTime: weakenTime + Config.TICK - ns.getGrowTime(target),
            threads: growThreads
        }, {
            script: Scripts.WEAKEN_BATCH,
            sleepTime: 0,
            threads: weakenThreads
        }, {
            script: Scripts.WEAKEN_BATCH,
            sleepTime: (2 * Config.TICK),
            threads: weakenThreads,
        }]

        this.ramPerBatch = parseFloat(this.action.reduce((acc, action) => {
            return acc + action.script.size * action.threads;
        }, 0).toFixed(2));

        this.batchSize = Math.min(
            Math.floor(this.getAvailableRam() / this.ramPerBatch),
            Math.ceil(this.duration / Config.BATCH_SEPARATION)
        );

        this.totalRam = parseFloat((this.ramPerBatch * this.batchSize).toFixed(2));
        this.cycleDuration = (this.batchSize - 1) * Config.BATCH_SEPARATION + this.duration + Config.TIME_BUFFER

        this.targetAmount = targetAmount
        this.moneyCapacity = ns.getServerMoneyAvailable(target) / ns.getServerMaxMoney(target) * 100

        const incomePerCycle = this.batchSize * targetAmount
        this.income = {
            perCycle: incomePerCycle,
            perSecond: incomePerCycle / (this.cycleDuration / 1000)
        }
    }

    private getAvailableRam(): number {
        return this.ns.getServerMaxRam(this.host) - Config.SERVER_RESERVE;
    }
}