import { NS } from "@ns";
import { Config } from "./config";
import { ScriptsEnum } from "/src/enum/scripts.enum";
import {ServerDto} from "/src/entity/server/server.dto";
import {HackingFormulas} from "/src/component/batch/hacking-formulas";

interface BatchScript {
    path: string;
    size: number;
}

interface BatchActionStep {
    script: BatchScript;
    sleepTime: number;
    threads: number;
    duration?: number;
}

interface Income {
    perCycle: number;
    perSecond: number;
}

export class Action {
    public readonly target: ServerDto;
    public readonly host: ServerDto;
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
    public readonly multiplier: number;

    constructor(ns: NS, target: ServerDto, host: ServerDto) {
        const hackingFormulas = new HackingFormulas(ns);

        this.target = target;
        this.host = host;
        this.hackChance = hackingFormulas.getHackChance(target);


        const multiplier = hackingFormulas.getHackMultiplier(target, host);
        this.multiplier = multiplier;
        const targetAmount = target.money.max * multiplier;

        const hackingThreads = hackingFormulas.getHackThreads(target, multiplier);
        const growThreads = hackingFormulas.getGrowThreads(target, host, multiplier);
        const weakenTime = hackingFormulas.getWeakenTime(target);

        this.action = [{
            script: ScriptsEnum.HACK_BATCH,
            sleepTime: hackingFormulas.getHackSleepTime(target),
            threads: hackingThreads,
            duration: hackingFormulas.getHackTime(target)
        }, {
            script: ScriptsEnum.GROW_BATCH,
            sleepTime: hackingFormulas.getGrowSleepTime(target),
            threads: growThreads,
            duration: hackingFormulas.getGrowTime(target)
        }, {
            script: ScriptsEnum.WEAKEN_BATCH,
            sleepTime: hackingFormulas.getWeakenSleepTime(),
            threads: hackingFormulas.getWeakenThreads(
                target,
                host,
                hackingFormulas.getHackSecurity(hackingThreads)
            ),
            duration: weakenTime
        }, {
            script: ScriptsEnum.WEAKEN_BATCH,
            sleepTime: hackingFormulas.getWeakenSleepTime(2),
            threads: hackingFormulas.getWeakenThreads(
                target,
                host,
                hackingFormulas.getGrowSecurity(growThreads)
            ),
            duration: weakenTime
        }]

        this.duration = weakenTime + 2 * Config.TICK;
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
        this.moneyCapacity = target.getMoneyAvailable() / target.money.max * 100

        const incomePerCycle = this.batchSize * targetAmount
        this.income = {
            perCycle: incomePerCycle,
            perSecond: incomePerCycle / (this.cycleDuration / 1000)
        }
    }

    private getAvailableRam(): number {
        return this.host.ram.max - Config.SERVER_RESERVE;
    }
}