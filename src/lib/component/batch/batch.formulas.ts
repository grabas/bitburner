import {NS, Player} from "@ns";
import {ServerDto} from "/lib/entity/server/server.dto";
import {BatchConfig} from "/lib/component/batch/batch.config";
import {ServerConstants} from "/lib/enum/server-constants.enum";
import {Scripts} from "/lib/enum/scripts.enum";
import {getBitnode} from "/lib/repository/bitnode.repository";
import {Bitnode} from "/lib/entity/bitnode/bitnode";
import {Batch} from "/lib/component/batch/batch";
import {clampNumber} from "/lib/utils/helpers/clamp-number";

export class HackingFormulas{
    private readonly ns: NS;
    private readonly bitnode: Bitnode;

    constructor(ns: NS) {
        this.ns = ns;
        this.bitnode = getBitnode();
    }

    /* ############ BATCH ############ */


    public static getWaveSize(batch: Batch, host: ServerDto, maxRam = false): number {
        const whatCanYouFitInRam = Math.floor((maxRam ? host.refresh().ram.max : host.getRamAvailable()) / batch.ramCost);
        const whatCanYouFitInDuration = Math.ceil(batch.duration / BatchConfig.BATCH_SEPARATION)

        return Math.min(
            whatCanYouFitInRam,
            whatCanYouFitInDuration,
            BatchConfig.MAX_WAVE_SIZE // before the sync goes to hell because of exp gain and/or host core/ram upgrades
        );
    }


    /* ############ WEAKEN ############ */


    public calculateWeakenTime = (target: ServerDto, idealistic = false): number => {
        const hackTime = this.calculateHackTime(target, idealistic);
        return hackTime * 4;
    }

    public getWeakenSleepTime = (multiplier = 0): number => {
        return BatchConfig.TICK * multiplier;
    }

    public calculateWeakenThreads = (target: ServerDto, host: ServerDto, decrease?: number): number => {
        const coreBonus = this.getCoreBonus(host.cores);
        const multiplier = ServerConstants.ServerWeakenAmount * coreBonus * this.bitnode.multipliers.ServerWeakenRate;

        decrease = decrease ?? (target.getSecurityLevel() - target.security.min);
        return Math.max(Math.ceil(decrease / multiplier), 1);
    }

    public getWeakenEffect(host: ServerDto, threads: number): number {
        const coreBonus = this.getCoreBonus(host.cores);
        return ServerConstants.ServerWeakenAmount * threads * coreBonus * this.bitnode.multipliers.ServerWeakenRate;
    }


    /* ############ HACK ############ */


    public calculateHackTime = (target: ServerDto, idealistic = false): number => {
        const player = this.ns.getPlayer();
        const hackDifficulty = idealistic ? target.security.min : target.getSecurityLevel();
        const requiredHackingSkill = target.security.levelRequired;

        const difficultyMult = requiredHackingSkill * hackDifficulty;

        const baseDiff = 500;
        const baseSkill = 50;
        const diffFactor = 2.5;
        let skillFactor = diffFactor * difficultyMult + baseDiff;
        skillFactor /= player.skills.hacking + baseSkill;

        const hackTimeMultiplier = 5;
        const hackingTime =
            (hackTimeMultiplier * skillFactor) /
            (player.mults.hacking_speed *
                this.bitnode.multipliers.HackingSpeedMultiplier *
                this.calculateIntelligenceBonus(player, 1));

        return hackingTime * 1000;
    }

    public getHackSleepTime = (target: ServerDto, idealistic = false): number => {
        const hacktime = this.calculateHackTime(target, idealistic);
        return this.calculateWeakenTime(target, idealistic) - BatchConfig.TICK - hacktime;
    }

    public getHackThreads = (target: ServerDto, multiplier: number, idealistic = false): number => {
        const targetMoney = clampNumber(target.money.max * multiplier, 1, target.money.max);
        const percentHacked = this.calculatePercentMoneyHacked(target, idealistic);

        return Math.max(Math.floor(targetMoney / (target.money.max * percentHacked)), 1);
    }

    public getHackMoney = (target: ServerDto, threads: number, idealistic = false): number => {
        const multiplier = this.calculatePercentMoneyHacked(target, idealistic) * threads;
        return target.money.max * multiplier;
    }

    public getHackSecurity = (hackThreads: number): number => {
        return ServerConstants.ServerFortifyAmount * hackThreads;
    }

    public calculatePercentMoneyHacked(target: ServerDto, idealistic = false): number {
        const player = this.ns.getPlayer();
        const hackDifficulty = (idealistic ? target.security.min : target.getSecurityLevel()) ?? 100;

        if (hackDifficulty >= 100) return 0;

        const requiredHackingSkill = target.security.levelRequired ?? 1e9;
        const balanceFactor = 240;

        const difficultyMult = (100 - hackDifficulty) / 100;
        const skillMult = (player.skills.hacking - (requiredHackingSkill - 1)) / player.skills.hacking;
        const percentMoneyHacked =
            (difficultyMult * skillMult * player.mults.hacking_money * this.bitnode.multipliers.ScriptHackMoney) / balanceFactor;

        return Math.min(1, Math.max(percentMoneyHacked, 0));
    }

    public getHackChance = (target: ServerDto, idealistic = false): number => {
        const player = this.ns.getPlayer();

        const hackDifficulty = (idealistic ? target.security.min : target.getSecurityLevel()) ?? 100;
        const requiredHackingSkill = target.security.levelRequired ?? 1e9;

        if (!target.security.access || hackDifficulty >= 100) return 0;

        const hackFactor = 1.75;
        const difficultyMult = (100 - hackDifficulty) / 100;
        const skillMult = clampNumber(hackFactor * player.skills.hacking, 1);
        const skillChance = (skillMult - requiredHackingSkill) / skillMult;
        const chance =
            skillChance *
            difficultyMult *
            player.mults.hacking_chance *
            this.calculateIntelligenceBonus(player, 1);

        return clampNumber(chance, 0, 1);
    }


    /* ############ GROW ############ */



    public calculateGrowTime = (target: ServerDto, idealistic = false): number => {
        const hackTime =  this.calculateHackTime(target, idealistic);
        return hackTime * 3.2;
    }

    public getGrowSleepTime = (target: ServerDto, idealistic = false): number => {
        return this.calculateWeakenTime(target, idealistic) + BatchConfig.TICK - this.calculateGrowTime(target, idealistic);
    }

    public getGrowSecurity = (growThreads: number): number => {
        return 3 * ServerConstants.ServerFortifyAmount * growThreads;
    }

    public getGrowThreads = (server: ServerDto, host: ServerDto, startMoney: number, idealistic = false): number => {
        const threads = this.numCycleForGrowthCorrected(server, host, startMoney, idealistic) * BatchConfig.GROW_BUFFER;
        return Math.max(Math.ceil(threads), 1);
    }

    private numCycleForGrowthCorrected(
        target: ServerDto,
        host: ServerDto,
        startMoney: number,
        idealistic = false
    ): number {
        if (!target.money.growth) return Infinity;
        const targetMoney = target.money.max ?? 1;
        startMoney = Math.max(startMoney, 1);

        const k = this.calculateServerGrowthLog(target, 1, host.cores, idealistic);
        let x = (targetMoney - startMoney) / (1 + (targetMoney * (1 / 16) + startMoney * (15 / 16)) * k);
        let diff;
        do {
            const ox = startMoney + x;
            const newx = (x - ox * Math.log(ox / targetMoney)) / (1 + ox * k);
            diff = newx - x;
            x = newx;
        } while (diff < -1 || diff > 1);
        const ccycle = Math.ceil(x);
        if (ccycle - x > 0.999999) {
            const fcycle = ccycle - 1;
            if (targetMoney <= (startMoney + fcycle) * Math.exp(k * fcycle)) {
                return fcycle;
            }
        }
        if (ccycle >= x + ((diff <= 0 ? -diff : diff) + 0.000001)) {
            return ccycle;
        }
        if (targetMoney <= (startMoney + ccycle) * Math.exp(k * ccycle)) {
            return ccycle;
        }
        return ccycle + 1;
    }

    private calculateServerGrowthLog(target: ServerDto, threads: number, cores = 1, idealistic = true): number {
        const player = this.ns.getPlayer();
        if (!target.money.growth) return -Infinity;
        const hackDifficulty = idealistic ? target.security.min : target.getSecurityLevel()
        const numServerGrowthCycles = Math.max(threads, 0);

        let adjGrowthLog = Math.log1p(ServerConstants.ServerBaseGrowthIncr / hackDifficulty);
        if (adjGrowthLog >= ServerConstants.ServerMaxGrowthLog) {
            adjGrowthLog = ServerConstants.ServerMaxGrowthLog;
        }

        const serverGrowthPercentage = target.money.growth / 100;
        const serverGrowthPercentageAdjusted = this.bitnode.multipliers.ServerGrowthRate * serverGrowthPercentage;

        const coreBonus = 1 + (cores - 1) * (1 / 16);
        return adjGrowthLog * serverGrowthPercentageAdjusted * player.mults.hacking_grow * coreBonus * numServerGrowthCycles;
    }


    /* ############ GENERAL ############ */


    public getHackMultiplier(target: ServerDto, host: ServerDto, idealistic = false): number {
        const candidates = Array.from({ length: 999 }, (_, i) => {
            const hackMultiplier = (i + 1) / 1000;
            const value = this.getBatchIncomePerSecond(target, host, hackMultiplier, idealistic);
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
        idealistic = false
    ): number | null => {
        const weakenTime = this.calculateWeakenTime(target, idealistic);
        const duration =  weakenTime + 2 * BatchConfig.TICK;

        const hackingThreads = this.getHackThreads(target, hackMultiplier, idealistic);
        const targetAmount = this.getHackMoney(target, hackingThreads, idealistic);

        const growThreads = this.getGrowThreads(target, host, target.money.max - targetAmount, idealistic)
        const weakenHackThreads = this.calculateWeakenThreads(target, host, this.getHackSecurity(hackingThreads));
        const weakenGrowThreads = this.calculateWeakenThreads(target, host, this.getGrowSecurity(growThreads))

        const totalRam =
            (Scripts.WEAKEN_BATCH.size * weakenHackThreads + weakenGrowThreads) +
            (Scripts.HACK_BATCH.size * hackingThreads) +
            (Scripts.GROW_BATCH.size * growThreads);

        const batchSize = Math.min(
            Math.floor(host.refresh().ram.max / totalRam),
            Math.ceil(duration / BatchConfig.BATCH_SEPARATION),
            BatchConfig.MAX_WAVE_SIZE
        );

        const cycleDuration = (batchSize - 1) * BatchConfig.BATCH_SEPARATION + duration + BatchConfig.TIME_BUFFER;
        const incomePerCycle = batchSize * targetAmount

        return incomePerCycle / (cycleDuration / 1000);
    }

    public getHackSkillGain(server: ServerDto, initialExp?: number): number {
        const player = this.ns.getPlayer();
        initialExp = initialExp ?? player.skills.hacking;
        const baseDifficulty = server.security.min;
        if (!baseDifficulty) return 0;
        const baseExpGain = 3;
        const diffFactor = 0.3;
        let expGain = baseExpGain;
        expGain += baseDifficulty * diffFactor;
        expGain = expGain * player.mults.hacking_exp * this.bitnode.multipliers.HackExpGain;

        return initialExp + expGain;
    }

    private calculateIntelligenceBonus = (player: Player, weight = 1): number => {
        const intelligence = player.skills.intelligence;
        const intelligenceOverride = this.bitnode.options.intelligenceOverride;
        const effectiveIntelligence =
            intelligenceOverride !== undefined
                ? Math.min(intelligenceOverride, intelligence)
                : intelligence;

        return 1 + (weight * Math.pow(effectiveIntelligence, 0.8)) / 600;
    }

    private calculateSkill(exp: number, mult = 1): number {
        const value = Math.floor(mult * (32 * Math.log(exp + 534.6) - 200));
        return clampNumber(value, 1);
    }
    
    private getCoreBonus(cores = 1): number {
        return 1 + (cores - 1) / 16;
    }
}