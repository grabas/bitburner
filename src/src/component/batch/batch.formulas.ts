import {NS, Player} from "@ns";
import {ServerDto} from "/src/entity/server/server.dto";
import {BatchConfig} from "/src/component/batch/batch.config";
import {ServerConstants} from "/src/enum/server-constants.enum";
import {Scripts} from "/src/enum/scripts.enum";
import {getBitnode} from "/src/repository/bitnode.repository";
import {Bitnode} from "/src/entity/bitnode/bitnode";
import {Batch} from "/src/component/batch/batch";

export class HackingFormulas{
    private readonly ns: NS;
    private readonly bitnode: Bitnode;

    constructor(ns: NS) {
        this.ns = ns;
        this.bitnode = getBitnode();
    }

    public static getWaveSize(batch: Batch, host: ServerDto, maxRam = false, debug = false): number {
        const size = Math.min(
            Math.floor((maxRam ? host.refresh().ram.max : host.getRamAvailable()) / batch.ramCost),
            Math.ceil(batch.duration / BatchConfig.BATCH_SEPARATION)
        );

        return debug ? Math.min(size, BatchConfig.DEBUG_LOOP) : size;
    }

    public calculateWeakenTime = (target: ServerDto, playerHackingExprience?: number): number => {
        const hackTime = this.calculateHackTime(target, playerHackingExprience);
        return hackTime * 4;
    }

    public getWeakenSleepTime = (multiplier = 0): number => {
        return BatchConfig.TICK * multiplier;
    }

    public calculateWeakenThreads = (target: ServerDto, home: ServerDto, decrease?: number): number => {
        const coreBonus = 1 + (home.cores - 1) / 16;
        const multiplier = ServerConstants.ServerWeakenAmount * coreBonus * this.bitnode.multipliers.ServerWeakenRate;

        decrease = decrease ?? (target.getSecurityLevel() - target.security.min);
        return Math.max(Math.ceil(decrease / multiplier), 1);
    }

    public calculateGrowTime = (target: ServerDto, playerHackingExprience?: number): number => {
        const hackTime =  this.calculateHackTime(target, playerHackingExprience);
        return hackTime * 3.2;
    }

    public getGrowSleepTime = (target: ServerDto): number => {
        return this.calculateWeakenTime(target) + BatchConfig.TICK - this.calculateGrowTime(target);
    }

    public getGrowSecurity = (growThreads: number): number => {
        return 2 * ServerConstants.ServerFortifyAmount * growThreads;
    }

    public getHackSleepTime = (target: ServerDto): number => {
        const hacktime = this.calculateHackTime(target);
        return this.calculateWeakenTime(target) - BatchConfig.TICK - hacktime;
    }

    public getHackThreads = (target: ServerDto, multiplier: number): number => {
        const targetMoney = target.money.max * multiplier;

        if (targetMoney < 0 || targetMoney > target.money.max) {
            return -1;
        } else if (targetMoney === 0) {
            return 0;
        }

        const percentHacked = this.calculatePercentMoneyHacked(target);

        if (percentHacked === 0 || target.money.max === 0) {
            return -1;
        }

        return Math.max(Math.floor(targetMoney / (target.money.max * percentHacked)), 1);
    }

    public calculatePercentMoneyHacked(target: ServerDto): number {
        const person = this.ns.getPlayer();
        const hackDifficulty = target.security.min ?? 100;
        if (hackDifficulty >= 100) return 0;
        const requiredHackingSkill = target.security.levelRequired ?? 1e9;
        const balanceFactor = 240;

        const difficultyMult = (100 - hackDifficulty) / 100;
        const skillMult = (person.skills.hacking - (requiredHackingSkill - 1)) / person.skills.hacking;
        const percentMoneyHacked =
            (difficultyMult * skillMult * person.mults.hacking_money * this.bitnode.multipliers.ScriptHackMoney) / balanceFactor;

        return Math.min(1, Math.max(percentMoneyHacked, 0));
    }

    public getHackSecurity = (hackThreads: number): number => {
        return ServerConstants.ServerFortifyAmount * hackThreads;
    }

    public getHackChance = (target: ServerDto): number => {
        const player = this.ns.getPlayer();
        const hackDifficulty = target.security.min ?? 100;
        const requiredHackingSkill = target.security.levelRequired ?? 1e9;
        if (!target.security.access || hackDifficulty >= 100) return 0;
        const hackFactor = 1.75;
        const difficultyMult = (100 - hackDifficulty) / 100;
        const skillMult = Math.max(Math.min(hackFactor * player.skills.hacking, Number.MAX_VALUE), 1);
        const skillChance = (skillMult - requiredHackingSkill) / skillMult;
        const chance =
            skillChance *
            difficultyMult *
            player.mults.hacking_chance *
            this.calculateIntelligenceBonus(player, 1);

        return Math.max(Math.min(chance, Number.MAX_VALUE), 1);
    }

    public getHackMoney = (target: ServerDto, threads: number): number => {
        const multiplier = this.calculatePercentMoneyHacked(target) * threads;
        return target.money.max * multiplier;
    }

    public calculateHackTime = (target: ServerDto, playerHackingExprience?: number): number => {
        const player = this.ns.getPlayer();
        const hackDifficulty = target.security.min;
        const requiredHackingSkill = target.security.levelRequired;

        const difficultyMult = requiredHackingSkill * hackDifficulty;

        const baseDiff = 500;
        const baseSkill = 50;
        const diffFactor = 2.5;
        let skillFactor = diffFactor * difficultyMult + baseDiff;
        skillFactor /= this.calculateSkill(
            playerHackingExprience ?? player.exp.hacking,
            player.mults.hacking * this.bitnode.multipliers.HackingLevelMultiplier
        ) + baseSkill;

        const hackTimeMultiplier = 5;
        const result = (hackTimeMultiplier * skillFactor) /
            (player.mults.hacking_speed *
                this.bitnode.multipliers.HackingSpeedMultiplier *
                this.calculateIntelligenceBonus(player));

        return result * 1000;
    }

    public calculateIntelligenceBonus = (player: Player, weight = 1): number => {
        const effectiveIntelligence =
            this.bitnode.options.intelligenceOverride !== undefined
                ? Math.min(this.bitnode.options.intelligenceOverride, player.skills.intelligence)
                : player.skills.intelligence;
        return 1 + (weight * Math.pow(effectiveIntelligence, 0.8)) / 600;
    }

    public getGrowThreads = (server: ServerDto, home: ServerDto, startMoney: number, minSecLevel = true): number => {
        const cores = home.cores;
        const targetMoney = server.money.max;

        if (!server.money.growth) return Infinity;

        const player = this.ns.getPlayer();
        const k = this.calculateServerGrowthLog(server, 1, player, cores, minSecLevel);
        const guess = (targetMoney - startMoney) / (1 + (targetMoney * (1 / 16) + startMoney * (15 / 16)) * k);
        let x = guess;
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
                return Math.ceil((fcycle) * BatchConfig.GROW_BUFFER);
            }
        }
        if (ccycle >= x + ((diff <= 0 ? -diff : diff) + 0.000001)) {
            return Math.ceil((ccycle) * BatchConfig.GROW_BUFFER);
        }
        if (targetMoney <= (startMoney + ccycle) * Math.exp(k * ccycle)) {
            return Math.ceil((ccycle) * BatchConfig.GROW_BUFFER);
        }
        return Math.ceil((ccycle + 1) * BatchConfig.GROW_BUFFER);
    }

    private calculateServerGrowthLog(server: ServerDto, threads: number, p: Player, cores = 1, minSecLevel = true): number {
        if (!server.money.growth) return -Infinity;
        const hackDifficulty = minSecLevel ? server.security.min : server.security.level;
        const numServerGrowthCycles = Math.max(threads, 0);

        let adjGrowthLog = Math.log1p(ServerConstants.ServerBaseGrowthIncr / hackDifficulty);
        if (adjGrowthLog >= ServerConstants.ServerMaxGrowthLog) {
            adjGrowthLog = ServerConstants.ServerMaxGrowthLog;
        }

        const serverGrowthPercentage = server.money.growth / 100;
        const serverGrowthPercentageAdjusted = this.bitnode.multipliers.ServerGrowthRate * serverGrowthPercentage;

        const coreBonus = 1 + (cores - 1) * (1 / 16);
        return adjGrowthLog * serverGrowthPercentageAdjusted * p.mults.hacking_grow * coreBonus * numServerGrowthCycles;
    }

    getHackMultiplier = (target: ServerDto, home: ServerDto): number => {
        const candidates = Array.from({ length: 999 }, (_, i) => {
            const hackMultiplier = (i + 1) / 1000;
            const value = this.getBatchIncomePerSecond(target, home, hackMultiplier);
            return { multiplier: hackMultiplier, value };
        }).filter(entry => entry.value !== null);

        if (candidates.length === 0) return 0;

        const best = candidates.reduce((acc, cur) => (cur.value! > acc.value! ? cur : acc));
        return best.multiplier;
    };

    public getBatchIncomePerSecond = (
        target: ServerDto,
        host: ServerDto,
        hackMultiplier: number
    ): number | null => {
        const weakenTime = this.calculateWeakenTime(target);
        const duration =  weakenTime + 2 * BatchConfig.TICK;

        const hackingThreads = this.getHackThreads(target, hackMultiplier);
        const targetAmount = this.getHackMoney(target, hackingThreads);

        const growThreads = this.getGrowThreads(target, host, target.money.max - targetAmount)
        const weakenHackThreads = this.calculateWeakenThreads(target, host, this.getHackSecurity(hackingThreads));
        const weakenGrowThreads = this.calculateWeakenThreads(target, host, this.getGrowSecurity(growThreads))

        const totalRam =
            (Scripts.WEAKEN_BATCH.size * weakenHackThreads + weakenGrowThreads) +
            (Scripts.HACK_BATCH.size * hackingThreads) +
            (Scripts.GROW_BATCH.size * growThreads);

        const batchSize = Math.min(
            Math.floor(host.refresh().ram.max / totalRam),
            Math.ceil(duration / BatchConfig.BATCH_SEPARATION)
        );

        const cycleDuration = (batchSize - 1) * BatchConfig.BATCH_SEPARATION + duration + BatchConfig.TIME_BUFFER;
        const incomePerCycle = batchSize * targetAmount;

        return incomePerCycle / (cycleDuration / 1000);
    }

    public getHackSkillGain = (server: ServerDto, initialExp?: number): number => {
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

    public calculateSkill(exp: number, mult = 1): number {
        const value = Math.floor(mult * (32 * Math.log(exp + 534.6) - 200));
        return Math.max(Math.min(value, Number.MAX_VALUE), 1);
    }
}