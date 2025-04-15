import { NS } from "@ns";
import { ActionScripts } from "/lib/enum/scripts.enum";
import { ServerDto } from "/lib/entity/server/server.dto";
import {BatchAction, BatchType, IBatch} from "/lib/component/batch-attack/batch.interface";
import {BatchConfig} from "/lib/component/batch-attack/batch.config";
import {BatchHackingFormulas} from "/lib/component/batch-attack/batch.formulas";

export class PrepareBatchDto implements IBatch {
    public readonly type = BatchType.PREPARE;
    public readonly target: ServerDto;
    public readonly host: ServerDto;
    public action: BatchAction[];
    public duration: number;
    public ramCost: number;
    public targetAmount = 0;

    constructor(ns: NS, target: ServerDto, host: ServerDto, monitor = false) {
        this.host = host;
        this.target = target;

        const hackingFormulas = new BatchHackingFormulas(ns);
        const weakenTime = hackingFormulas.calculateWeakenTime(target);

        this.action = [];

        const growScript = monitor ? ActionScripts.GROW_BATCH_MONITOR : ActionScripts.GROW_BATCH;
        const weakenScript = monitor ? ActionScripts.WEAKEN_BATCH_MONITOR : ActionScripts.WEAKEN_BATCH;

        if (target.getSecurityLevel() > target.security.min) {
            let weakenThreads = hackingFormulas.calculateWeakenThreads(target, host);

            if (weakenThreads * weakenScript.size > host.getRamAvailable()) {
                weakenThreads = Math.floor(host.getRamAvailable() / weakenScript.size);
            }

            this.action.push({
                script: weakenScript,
                sleepTime: hackingFormulas.getWeakenSleepTime(),
                threads: Math.ceil(weakenThreads),
                duration: weakenTime
            });
        }

        if (target.getMoneyAvailable() !== target.money.max) {
            const growThreads = hackingFormulas.getGrowThreads(target, host, target.getMoneyAvailable());
            const weakenGrowThreads = hackingFormulas.calculateWeakenThreads(target, host, hackingFormulas.getGrowSecurity(growThreads));

            this.action.push({
                    script: growScript,
                    sleepTime: hackingFormulas.getGrowSleepTime(target),
                    threads: growThreads,
                    duration: hackingFormulas.calculateGrowTime(target)
                },
                {
                    script: weakenScript,
                    sleepTime: hackingFormulas.getWeakenSleepTime(2),
                    threads: weakenGrowThreads,
                    duration: weakenTime
                });
        }

        const availableRam = host.getRamAvailable();
        const totalCost = this.action.reduce((sum, action) => sum + action.threads * action.script.size, 0);

        if (totalCost > availableRam) {
            if (this.action.length === 3) {
                const weakenAction = this.action[0];
                const weakenCost = weakenAction.threads * weakenAction.script.size;

                const remainingActions = this.action.slice(1);
                const remainingCost = remainingActions.reduce((sum, action) => sum + action.threads * action.script.size, 0);
                const availableForRemaining = availableRam - weakenCost;

                const scaledRemaining = remainingActions.map(action => {
                    action.threads = Math.max(Math.floor(action.threads * availableForRemaining / remainingCost), 1);
                    return action;
                });
                this.action = [weakenAction, ...scaledRemaining];
            } else {
                this.action = this.action.map(action => {
                    action.threads = Math.floor(action.threads * availableRam / totalCost);
                    return action;
                });
            }
        }

        this.ramCost = this.action.reduce((sum, action) => sum + action.threads * action.script.size, 0);
        this.duration = weakenTime + (this.action.length - 1) * BatchConfig.BATCH_SEPARATION;
    }
}