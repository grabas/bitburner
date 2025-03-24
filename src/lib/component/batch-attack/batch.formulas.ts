import {ServerDto} from "/lib/entity/server/server.dto";
import {BatchConfig} from "/lib/component/batch-attack/batch.config";
import {NS} from "@ns";
import {HackingFormulas} from "/lib/formulas/hacking.formulas";
import {ActionScripts} from "/lib/enum/scripts.enum";

export class BatchHackingFormulas extends HackingFormulas {
    constructor(ns: NS) {
        super(ns);
    }

    public static getWaveSize(host: ServerDto, ramCost: number, duration: number, maxRam = false): number {
        const whatCanYouFitInRam = Math.floor((maxRam ? host.refresh().ram.max : host.getRamAvailable()) / ramCost);
        const whatCanYouFitInDuration = Math.ceil(duration / BatchConfig.BATCH_SEPARATION)

        return Math.min(
            whatCanYouFitInRam,
            whatCanYouFitInDuration,
            BatchConfig.MAX_WAVE_SIZE // before the sync goes to hell because of exp gain and/or host core/ram upgrades
        );
    }

    public getWeakenSleepTime = (multiplier = 0): number => {
        return BatchConfig.TICK * multiplier;
    }

    public getGrowSleepTime = (target: ServerDto, idealistic = false): number => {
        return this.calculateWeakenTime(target, idealistic) + BatchConfig.TICK - this.calculateGrowTime(target, idealistic);
    }

    public getHackSleepTime = (target: ServerDto, idealistic = false): number => {
        const hacktime = this.calculateHackTime(target, idealistic);
        return this.calculateWeakenTime(target, idealistic) - BatchConfig.TICK - hacktime;
    }

    public getHackMultiplier(target: ServerDto, host: ServerDto, monitor = false, idealistic = false): number {
        const candidates = Array.from({ length: BatchConfig.MAX_MULTIPLIER * 1000 }, (_, i) => {
            const hackMultiplier = (i + 1) / 1000;
            const value = this.getBatchIncomePerSecond(target, host, hackMultiplier, monitor, idealistic);
            return { multiplier: hackMultiplier, value };
        }).filter(entry => entry.value !== null);

        if (candidates.length === 0) return 0;

        const best = candidates.reduce((acc, cur) => (cur.value! > acc.value! ? cur : acc));
        return best.multiplier;
    }

    public getBatchIncomePerSecond = (
        target: ServerDto,
        host: ServerDto,
        hackMultiplier: number,
        monitor = false,
        idealistic = false
    ): number => {
        const weakenTime = this.calculateWeakenTime(target, idealistic);
        const duration =  weakenTime + 2 * BatchConfig.TICK;

        const hackingThreads = this.getHackThreads(target, hackMultiplier, idealistic);
        const targetAmount = this.getHackMoney(target, hackingThreads, idealistic);

        const growThreads = this.getGrowThreads(target, host, target.money.max - targetAmount, idealistic)
        const weakenHackThreads = this.calculateWeakenThreads(target, host, this.getHackSecurity(hackingThreads));
        const weakenGrowThreads = this.calculateWeakenThreads(target, host, this.getGrowSecurity(growThreads))

        const totalWeakenThreads = weakenHackThreads + weakenGrowThreads;


        const weakenScript = monitor ? ActionScripts.WEAKEN_BATCH_MONITOR : ActionScripts.WEAKEN_BATCH;
        const growScript = monitor ? ActionScripts.GROW_BATCH_MONITOR : ActionScripts.GROW_BATCH;
        const hackScript = monitor ? ActionScripts.HACK_BATCH_MONITOR : ActionScripts.HACK_BATCH;

        const totalRam =
            (weakenScript.size * totalWeakenThreads) +
            (hackScript.size * hackingThreads) +
            (growScript.size * growThreads);

        const batchSize = BatchHackingFormulas.getWaveSize(host, totalRam, duration, idealistic);

        if (batchSize === 0) return 0;

        const cycleDuration = (batchSize - 1) * BatchConfig.BATCH_SEPARATION + duration + BatchConfig.TIME_BUFFER;
        const incomePerCycle = batchSize * targetAmount

        return incomePerCycle / (cycleDuration / 1000);
    }

}