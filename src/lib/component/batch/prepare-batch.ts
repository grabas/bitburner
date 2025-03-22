import { NS } from "@ns";
import { Scripts } from "/lib/enum/scripts.enum";
import { ServerDto } from "/lib/entity/server/server.dto";
import { HackingFormulas } from "/lib/component/batch/batch.formulas";
import {BatchAction, BatchType, IBatch} from "/lib/component/batch/batch.interface";
import {BatchConfig} from "/lib/component/batch/batch.config";

export class PrepareBatch implements IBatch {
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

        const hackingFormulas = new HackingFormulas(ns);
        const weakenTime = hackingFormulas.calculateWeakenTime(target);

        this.action = [];

        const growScript = monitor ? Scripts.GROW_BATCH_MONITOR : Scripts.GROW_BATCH;
        const weakenScript = monitor ? Scripts.WEAKEN_BATCH_MONITOR : Scripts.WEAKEN_BATCH;

        if (target.getSecurityLevel() > target.security.min) {
            let weakenThreads = hackingFormulas.calculateWeakenThreads(target, host);

            if (weakenThreads * weakenScript.size > host.getRamAvailable() * 0.5) {
                weakenThreads = Math.floor(host.getRamAvailable() / weakenScript.size * 0.20);
            }

            this.action.push({
                script: weakenScript,
                sleepTime: hackingFormulas.getWeakenSleepTime(),
                threads: Math.ceil(weakenThreads),
                duration: weakenTime
            });
        }

        if (target.getMoneyAvailable() !== target.money.max) {
            let growThreads = hackingFormulas.getGrowThreads(target, host, target.getMoneyAvailable());

            if (growThreads * growScript.size > host.getRamAvailable()) {
                growThreads = Math.floor(host.getRamAvailable() / growScript.size * 0.5);
            }

            let weakenGrowThreads = hackingFormulas.calculateWeakenThreads(
                target,
                host,
                hackingFormulas.getGrowSecurity(growThreads)
            ) * 1.5;

            if (weakenGrowThreads * weakenScript.size > host.getRamAvailable() * 0.3) {
                weakenGrowThreads = Math.floor(host.getRamAvailable() / weakenScript.size * 0.20);
            }

            this.action.push({
                    script: growScript,
                    sleepTime: hackingFormulas.getGrowSleepTime(target),
                    threads: Math.ceil(growThreads),
                    duration: hackingFormulas.calculateGrowTime(target)
                },
                {
                    script: weakenScript,
                    sleepTime: hackingFormulas.getWeakenSleepTime(2),
                    threads: Math.ceil(weakenGrowThreads),
                    duration: weakenTime
                });
        }

        const availableRam = host.getRamAvailable();
        const maxAllowedUsage = availableRam * 0.9;
        const totalCost = this.action.reduce((sum, action) => sum + action.threads * action.script.size, 0);

        if (totalCost > maxAllowedUsage) {
            const scaleFactor = maxAllowedUsage / totalCost;
            this.action = this.action.map(action => ({
                ...action,
                threads: Math.max(1, Math.floor(action.threads * scaleFactor))
            }));
        }

        this.ramCost = this.action.reduce((sum, action) => sum + action.threads * action.script.size, 0);
        this.duration = weakenTime + (this.action.length - 1) * BatchConfig.BATCH_SEPARATION;
    }
}