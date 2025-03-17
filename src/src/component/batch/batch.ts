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

export class Batch {
    public readonly target: ServerDto;
    public readonly host: ServerDto;
    public readonly hackChance: number;
    public readonly duration: number;
    public readonly action: BatchActionStep[];
    public readonly ram: number;

    constructor(ns: NS, target: ServerDto, host: ServerDto) {
        const hackingFormulas = new HackingFormulas(ns);
        this.target = target;
        this.host = host;
        const growThreads = await hackingFormulas.getGrowThreads(target, host, target.getMoneyAvailable());
        const weakenTime = await hackingFormulas.getWeakenTime(target);

        let action = [];
        if (growThreads === 0) {
            action = [{
                script: ScriptsEnum.WEAKEN_BATCH,
                sleepTime: hackingFormulas.getWeakenSleepTime(),
                threads: hackingFormulas.getWeakenThreads(target, host) * 2,
                duration: weakenTime
            }]
        } else {
            action = [{
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
                ) * 2,
                duration: weakenTime
            }]
        }
    }
}