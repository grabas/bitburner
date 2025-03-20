import { NS } from "@ns";
import { BatchConfig } from "./batch.config";
import {Scripts} from "/src/enum/scripts.enum";
import {ServerDto} from "/src/entity/server/server.dto";
import {HackingFormulas} from "/src/component/batch/batch.formulas";
import {BatchAction} from "/src/component/batch/batch.interface";

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
        const weakenTime = hackingFormulas.calculateWeakenTime(target);

        this.action = [{
            script: debug ? Scripts.HACK_BATCH_DEBUG : Scripts.HACK_BATCH,
            sleepTime: hackingFormulas.getHackSleepTime(target),
            threads: hackingThreads,
            duration: hackingFormulas.calculateHackTime(target)
        }, {
            script: debug ? Scripts.GROW_BATCH_DEBUG : Scripts.GROW_BATCH,
            sleepTime: hackingFormulas.getGrowSleepTime(target),
            threads: growThreads,
            duration: hackingFormulas.calculateGrowTime(target)
        }, {
            script: debug ? Scripts.WEAKEN_BATCH_DEBUG : Scripts.WEAKEN_BATCH,
            sleepTime: hackingFormulas.getWeakenSleepTime(),
            threads: hackingFormulas.calculateWeakenThreads(
                target,
                host,
                hackingFormulas.getHackSecurity(hackingThreads)
            ),
            duration: weakenTime
        }, {
            script: debug ? Scripts.WEAKEN_BATCH_DEBUG : Scripts.WEAKEN_BATCH,
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