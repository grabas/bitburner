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

    private constructor(
        target: ServerDto,
        host: ServerDto,
        hackingFormulas: HackingFormulas,
        actionSteps: BatchActionStep[],
        duration: number,
        ramPerBatch: number,
        batchSize: number,
        totalRam: number,
        cycleDuration: number,
        targetAmount: number,
        income: Income,
        moneyCapacity: number
    ) {
        this.target = target;
        this.host = host;
        this.hackChance = hackingFormulas.getHackChance(target);
        this.action = actionSteps;
        this.duration = duration;
        this.ramPerBatch = ramPerBatch;
        this.batchSize = batchSize;
        this.totalRam = totalRam;
        this.cycleDuration = cycleDuration;
        this.targetAmount = targetAmount;
        this.income = income;
        this.moneyCapacity = moneyCapacity;
    }

    static async create(ns: NS, target: ServerDto, host: ServerDto): Promise<Action> {
        const hackingFormulas = new HackingFormulas(ns);

        const multiplier = hackingFormulas.getHackMultiplier(target, host);
        const targetAmount = target.money.max * multiplier;

        const hackingThreads = hackingFormulas.getHackThreads(target, multiplier);
        const growThreads = await hackingFormulas.getGrowThreads(
            target,
            host,
            hackingFormulas.getHackMoney(target, hackingThreads)
        );
        const weakenTime = await hackingFormulas.getWeakenTime(target);

        const actionSteps: BatchActionStep[] = [
            {
                script: ScriptsEnum.HACK_BATCH,
                sleepTime: await hackingFormulas.getHackSleepTime(target),
                threads: hackingThreads,
                duration: await hackingFormulas.getHackTime(target),
            },
            {
                script: ScriptsEnum.GROW_BATCH,
                sleepTime: await hackingFormulas.getGrowSleepTime(target),
                threads: growThreads,
                duration: await hackingFormulas.getGrowTime(target),
            },
            {
                script: ScriptsEnum.WEAKEN_BATCH,
                sleepTime: hackingFormulas.getWeakenSleepTime(),
                threads: hackingFormulas.getWeakenThreads(
                    target,
                    host,
                    hackingFormulas.getHackSecurity(hackingThreads)
                ),
                duration: weakenTime,
            },
            {
                script: ScriptsEnum.WEAKEN_BATCH,
                sleepTime: hackingFormulas.getWeakenSleepTime(2),
                threads: hackingFormulas.getWeakenThreads(
                    target,
                    host,
                    hackingFormulas.getGrowSecurity(growThreads)
                ),
                duration: weakenTime,
            },
        ];

        const duration = weakenTime + 2 * Config.TICK;
        const ramPerBatch = parseFloat(
            actionSteps.reduce((acc, action) => acc + action.script.size * action.threads, 0).toFixed(2)
        );

        const batchSize = Math.min(
            Math.floor((host.ram.max - Config.SERVER_RESERVE) / ramPerBatch),
            Math.ceil(duration / Config.BATCH_SEPARATION)
        );

        const totalRam = parseFloat((ramPerBatch * batchSize).toFixed(2));
        const cycleDuration = (batchSize - 1) * Config.BATCH_SEPARATION + duration + Config.TIME_BUFFER;

        const moneyCapacity = (target.getMoneyAvailable() / target.money.max) * 100;
        const incomePerCycle = batchSize * targetAmount;
        const income: Income = {
            perCycle: incomePerCycle,
            perSecond: incomePerCycle / (cycleDuration / 1000),
        };

        return new Action(
            target,
            host,
            hackingFormulas,
            actionSteps,
            duration,
            ramPerBatch,
            batchSize,
            totalRam,
            cycleDuration,
            targetAmount,
            income,
            moneyCapacity
        );
    }

    static async createPrepareActions(ns: NS, target: ServerDto, host: ServerDto): Promise<Action> {
        const hackingFormulas = new HackingFormulas(ns);

        const growThreads = await hackingFormulas.getGrowThreads(target, host, target.getMoneyAvailable());
        const weakenTime = await hackingFormulas.getWeakenTime(target);

        let actionSteps: BatchActionStep[] = [];
        if (growThreads === 0) {
            actionSteps = [{
                script: ScriptsEnum.WEAKEN_BATCH,
                sleepTime: hackingFormulas.getWeakenSleepTime(),
                threads: hackingFormulas.getWeakenThreads(target, host) * 2,
                duration: weakenTime
            }]
        } else {
            actionSteps = [{
                script: ScriptsEnum.GROW_BATCH,
                sleepTime: await hackingFormulas.getGrowSleepTime(target),
                threads: growThreads,
                duration: await hackingFormulas.getGrowTime(target)
            }, {
                script: ScriptsEnum.WEAKEN_BATCH,
                sleepTime: hackingFormulas.getWeakenSleepTime(),
                threads: hackingFormulas.getWeakenThreads(target, host) * 2,
                duration: weakenTime
            }, {
                script: ScriptsEnum.WEAKEN_BATCH,
                sleepTime: hackingFormulas.getWeakenSleepTime(2),
                threads: hackingFormulas.getWeakenThreads(
                    target,
                    host,
                    hackingFormulas.getGrowSecurity(growThreads)
                ) ,
                duration: weakenTime
            }]
        }

        const duration = weakenTime + 2 * Config.TICK;
        const ramPerBatch = parseFloat(
            actionSteps.reduce((acc, action) => acc + action.script.size * action.threads, 0).toFixed(2)
        );

        const batchSize = Math.min(
            Math.floor((host.ram.max - Config.SERVER_RESERVE) / ramPerBatch),
            Math.ceil(duration / Config.BATCH_SEPARATION)
        );

        const totalRam = parseFloat((ramPerBatch * batchSize).toFixed(2));
        const cycleDuration = (batchSize - 1) * Config.BATCH_SEPARATION + duration + Config.TIME_BUFFER;

        const moneyCapacity = (target.getMoneyAvailable() / target.money.max) * 100;

        return new Action(
            target,
            host,
            hackingFormulas,
            actionSteps,
            duration,
            ramPerBatch,
            batchSize,
            totalRam,
            cycleDuration,
            0,
            {
                perCycle: 0,
                perSecond: 0,
            },
            moneyCapacity
        );
    }
}