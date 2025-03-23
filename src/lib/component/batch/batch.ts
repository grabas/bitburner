import { NS } from "@ns";
import { BatchConfig } from "./batch.config";
import {ActionScripts} from "/lib/enum/scripts.enum";
import {ServerDto} from "/lib/entity/server/server.dto";
import {HackingFormulas} from "/lib/component/batch/batch.formulas";
import {BatchAction, BatchType, IBatch} from "/lib/component/batch/batch.interface";

export class Batch implements IBatch {
    public readonly type = BatchType.ATTACK;
    public readonly target: ServerDto;
    public readonly host: ServerDto;
    public readonly hackChance: number;
    public readonly duration: number;
    public readonly action: BatchAction[];
    public readonly ramCost: number;
    public readonly targetAmount: number;
    public readonly targetAmountMultiplier: number;

    constructor(ns: NS, target: ServerDto, host: ServerDto, monitor = false) {
        this.host = host;
        this.target = target;

        const idealistic = true;

        const hackingFormulas = new HackingFormulas(ns);
        this.hackChance = hackingFormulas.getHackChance(target, idealistic);

        const multiplier = hackingFormulas.getHackMultiplier(target, host, idealistic);
        this.targetAmountMultiplier = multiplier;

        const hackingThreads = hackingFormulas.getHackThreads(target, multiplier, idealistic);
        const targetAmount = hackingFormulas.getHackMoney(target, hackingThreads, idealistic);
        const growThreads = hackingFormulas.getGrowThreads(target, host, target.money.max - targetAmount, idealistic)
        const weakenTime = hackingFormulas.calculateWeakenTime(target, idealistic);

        this.action = [{
            script: monitor ? ActionScripts.HACK_BATCH_MONITOR : ActionScripts.HACK_BATCH,
            sleepTime: hackingFormulas.getHackSleepTime(target, idealistic),
            threads: hackingThreads,
            duration: hackingFormulas.calculateHackTime(target, idealistic)
        }, {
            script: monitor ? ActionScripts.WEAKEN_BATCH_MONITOR : ActionScripts.WEAKEN_BATCH,
            sleepTime: hackingFormulas.getWeakenSleepTime(),
            threads: hackingFormulas.calculateWeakenThreads(
                target,
                host,
                hackingFormulas.getHackSecurity(hackingThreads)
            ),
            duration: weakenTime
        }, {
            script: monitor ? ActionScripts.GROW_BATCH_MONITOR : ActionScripts.GROW_BATCH,
            sleepTime: hackingFormulas.getGrowSleepTime(target, idealistic),
            threads: growThreads,
            duration: hackingFormulas.calculateGrowTime(target, idealistic)
        }, {
            script: monitor ? ActionScripts.WEAKEN_BATCH_MONITOR : ActionScripts.WEAKEN_BATCH,
            sleepTime: hackingFormulas.getWeakenSleepTime(2),
            threads: hackingFormulas.calculateWeakenThreads(
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