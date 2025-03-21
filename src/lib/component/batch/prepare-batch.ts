import { NS } from "@ns";
import { Scripts } from "/lib/enum/scripts.enum";
import { ServerDto } from "/lib/entity/server/server.dto";
import { HackingFormulas } from "/lib/component/batch/batch.formulas";
import { BatchAction } from "/lib/component/batch/batch.interface";
import {BatchConfig} from "/lib/component/batch/batch.config";

export class PrepareBatch {
    public readonly target: ServerDto;
    public readonly host: ServerDto;
    public action: BatchAction[];
    public duration: number;

    constructor(ns: NS, target: ServerDto, host: ServerDto) {
        const hackingFormulas = new HackingFormulas(ns);
        this.target = target;
        this.host = host;
        const weakenTime = hackingFormulas.calculateWeakenTime(target);

        this.action = [];

        if (target.getSecurityLevel() > target.security.min) {
            let weakenThreads = hackingFormulas.calculateWeakenThreads(target, host);

            if (weakenThreads * Scripts.WEAKEN_BATCH.size > host.getRamAvailable() * 0.5) {
                weakenThreads = Math.floor(host.getRamAvailable() / Scripts.WEAKEN_BATCH.size * 0.20);
            }

            this.action.push({
                script: Scripts.WEAKEN_BATCH,
                sleepTime: hackingFormulas.getWeakenSleepTime(),
                threads: Math.ceil(weakenThreads),
                duration: weakenTime
            });
        }

        if (target.getMoneyAvailable() !== target.money.max) {
            let growThreads = hackingFormulas.getGrowThreads(target, host, target.getMoneyAvailable());

            if (growThreads * Scripts.GROW_BATCH.size > host.getRamAvailable()) {
                growThreads = Math.floor(host.getRamAvailable() / Scripts.GROW_BATCH.size * 0.5);
            }

            let weakenGrowThreads = hackingFormulas.calculateWeakenThreads(
                target,
                host,
                hackingFormulas.getGrowSecurity(growThreads)
            ) * 1.5;

            if (weakenGrowThreads * Scripts.WEAKEN_BATCH.size > host.getRamAvailable() * 0.3) {
                weakenGrowThreads = Math.floor(host.getRamAvailable() / Scripts.WEAKEN_BATCH.size * 0.20);
            }

            this.action.push({
                    script: Scripts.GROW_BATCH,
                    sleepTime: hackingFormulas.getGrowSleepTime(target),
                    threads: Math.ceil(growThreads),
                    duration: hackingFormulas.calculateGrowTime(target)
                },
                {
                    script: Scripts.WEAKEN_BATCH,
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

        this.duration = weakenTime + (this.action.length - 1) * BatchConfig.BATCH_SEPARATION;
    }
}