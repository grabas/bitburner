import { NS } from "@ns";
import { BatchConfig } from "./batch.config";
import { ScriptsEnum } from "/src/enum/scripts.enum";
import {ServerDto} from "/src/entity/server/server.dto";
import {HackingFormulas} from "/src/component/batch/batch.formulas";

interface BatchScript {
    path: string;
    size: number;
}

interface BatchAction {
    script: BatchScript;
    sleepTime: number;
    threads: number;
    duration?: number;
}

export class Batch {
    public readonly target: ServerDto;
    public readonly host: ServerDto;
    public readonly hackChance: number;
    public readonly duration: number;
    public readonly action: BatchAction[];
    public readonly ramCost: number;
    public readonly targetAmount: number;
    public readonly targetAmountMultiplier: number;
    constructor(ns: NS, target: ServerDto, host: ServerDto, debug = false) {
        const hackingFormulas = new HackingFormulas(ns);

        this.target = target;
        this.host = host;
        this.hackChance = hackingFormulas.getHackChance(target);

        const multiplier = hackingFormulas.getHackMultiplier(target, host);
        this.targetAmountMultiplier = multiplier;

        const hackingThreads = hackingFormulas.getHackThreads(target, multiplier);
        const targetAmount = hackingFormulas.getHackMoney(target, hackingThreads);
        const growThreads = hackingFormulas.getGrowThreads(target, host, target.money.max - targetAmount)
        const weakenTime = hackingFormulas.getWeakenTime(target);

        this.action = [{
            script: debug ? ScriptsEnum.HACK_BATCH_DEBUG : ScriptsEnum.HACK_BATCH,
            sleepTime: hackingFormulas.getHackSleepTime(target),
            threads: hackingThreads,
            duration: hackingFormulas.getHackTime(target)
        }, {
            script: debug ? ScriptsEnum.GROW_BATCH_DEBUG : ScriptsEnum.GROW_BATCH,
            sleepTime: hackingFormulas.getGrowSleepTime(target),
            threads: growThreads,
            duration: hackingFormulas.getGrowTime(target)
        }, {
            script: debug ? ScriptsEnum.WEAKEN_BATCH_DEBUG : ScriptsEnum.WEAKEN_BATCH,
            sleepTime: hackingFormulas.getWeakenSleepTime(),
            threads: hackingFormulas.getWeakenThreads(
                target,
                host,
                hackingFormulas.getHackSecurity(hackingThreads)
            ),
            duration: weakenTime
        }, {
            script: debug ? ScriptsEnum.WEAKEN_BATCH_DEBUG : ScriptsEnum.WEAKEN_BATCH,
            sleepTime: hackingFormulas.getWeakenSleepTime(2),
            threads: hackingFormulas.getWeakenThreads(
                target,
                host,
                hackingFormulas.getGrowSecurity(growThreads)
            ),
            duration: weakenTime
        }]

        this.duration = weakenTime + 2 * BatchConfig.TICK;
        this.ramCost = parseFloat(this.action.reduce((acc, action) => {
            return acc + action.script.size * action.threads;
        }, 0).toFixed(2));

        this.targetAmount = targetAmount
    }
}