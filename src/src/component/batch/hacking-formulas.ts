import {NS} from "@ns";
import {ServerDto} from "/src/entity/server/server.dto";
import {Config} from "/src/component/batch/config";
import {ServerConstants} from "/src/enum/server-constants.enum";
import {ScriptsEnum} from "/src/enum/scripts.enum";
import {getPlayerDto} from "/src/repository/player.repository";
import {PlayerDto} from "/src/entity/player/player.dto";

export class HackingFormulas {
    protected readonly ns: NS;

    constructor(ns: NS) {
        this.ns = ns;
    }

    public getWeakenTime = async (target: ServerDto): Promise<number> => {
        const hackTime = await this.getHackTime(target);
        return hackTime * 4;
    }

    public getWeakenSleepTime = (multiplier = 0): number => {
        return Config.TICK * multiplier;
    }

    public getWeakenThreads = (target: ServerDto, home: ServerDto, decrease?: number): number => {
        const multiplier = this.ns.weakenAnalyze(1, home.cores);
        decrease = decrease ?? (target.getSecurityLevel() - target.security.min);
        return Math.max(Math.ceil(decrease / multiplier), 1);
    }

    public getGrowTime = async (target: ServerDto): Promise<number> => {
        const hackTime = await this.getHackTime(target);
        return hackTime * 3.2;
    }

    public getGrowSleepTime = async (target: ServerDto): Promise<number> => {
        return (await this.getWeakenTime(target)) + Config.TICK - (await this.getGrowTime(target));
    }

    public getGrowSecurity = (growThreads: number): number => {
        return 2 * ServerConstants.ServerFortifyAmount * growThreads;
    }

    public getHackSleepTime = async (target: ServerDto): Promise<number> => {
        const hacktime = await this.getHackTime(target);
        return (await this.getWeakenTime(target)) - Config.TICK - hacktime;
    }

    public getHackThreads = (target: ServerDto, multiplier: number): number => {
        const targetMoney = target.money.max * multiplier;
        return Math.max(Math.floor(this.ns.hackAnalyzeThreads(target.hostname, targetMoney)), 1);
    }

    public getHackSecurity = (hackThreads: number): number => {
        return ServerConstants.ServerFortifyAmount * hackThreads;
    }

    public getHackChance = (target: ServerDto): number => {
        return this.ns.hackAnalyzeChance(target.hostname);
    }

    public getHackMoney = (target: ServerDto, threads: number): number => {
        return this.ns.hackAnalyze(target.hostname) * threads;
    }

    public getHackTime = async (target: ServerDto, playerHackingSkill?: number): Promise<number> => {
        const player = await getPlayerDto();
        const hackDifficulty = target.security.level;
        const requiredHackingSkill = target.security.levelRequired;

        const difficultyMult = requiredHackingSkill * hackDifficulty;

        const baseDiff = 500;
        const baseSkill = 50;
        const diffFactor = 2.5;
        let skillFactor = diffFactor * difficultyMult + baseDiff;
        skillFactor /= (playerHackingSkill ?? player.skills.hacking) + baseSkill;

        const hackTimeMultiplier = 5;
        const result = (hackTimeMultiplier * skillFactor) /
               (player.mults.hacking_speed *
                    player.bitnode.multipliers.HackingSpeedMultiplier *
                    this.calculateIntelligenceBonus(player));

        return result * 1000;
    }

    public calculateIntelligenceBonus = (player: PlayerDto, weight = 1): number => {
        const effectiveIntelligence =
            player.bitNodeOptions.intelligenceOverride !== undefined
                ? Math.min(player.bitNodeOptions.intelligenceOverride, player.skills.intelligence)
                : player.skills.intelligence;
        return 1 + (weight * Math.pow(effectiveIntelligence, 0.8)) / 600;
    }

    public getGrowThreads = async (server: ServerDto, home: ServerDto, startMoney: number, minSecLevel = true): Promise<number> => {
        const cores = home.cores;
        const targetMoney = server.money.max;

        if (!server.money.growth) return Infinity;

        const player = await getPlayerDto();
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

    private calculateServerGrowthLog(server: ServerDto, threads: number, p: PlayerDto, cores = 1, minSecLevel = true): number {
        if (!server.money.growth) return -Infinity;
        const hackDifficulty = minSecLevel ? server.security.min : server.security.level;
        const numServerGrowthCycles = Math.max(threads, 0);

        let adjGrowthLog = Math.log1p(ServerConstants.ServerBaseGrowthIncr / hackDifficulty);
        if (adjGrowthLog >= ServerConstants.ServerMaxGrowthLog) {
            adjGrowthLog = ServerConstants.ServerMaxGrowthLog;
        }

        const serverGrowthPercentage = server.money.growth / 100;
        const serverGrowthPercentageAdjusted = p.bitnode.multipliers.ServerGrowthRate * serverGrowthPercentage;

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

    public getBatchIncomePerSecond = async (
        target: ServerDto,
        host: ServerDto,
        hackMultiplier: number
    ): Promise<number | null> => {
        const availableRam = host.getRamAvailable();
        const targetAmount = target.money.max * hackMultiplier;
        const hackThreads = this.getHackThreads(target, hackMultiplier);

        if (hackThreads === -1) return null;

        const growThreads = await this.getGrowThreads(
            target,
            host,
            this.getHackMoney(target, hackThreads)
        );

        const weakenTime = await this.getWeakenTime(target);
        const duration = weakenTime + 2 * Config.TICK;
        const hackRam = hackThreads * ScriptsEnum.HACK_BATCH.size;
        const growRam = growThreads * ScriptsEnum.GROW_BATCH.size;
        const weakenRam = Math.ceil(growThreads * Config.WEAKEN_BUFFER) * ScriptsEnum.GROW_BATCH.size * 2;
        const ramPerBatch = hackRam + growRam + weakenRam;

        const maxBatchesByRam = Math.floor(availableRam / ramPerBatch);
        const maxBatchesByTime = Math.ceil(duration / Config.BATCH_SEPARATION);
        const batchSize = Math.min(maxBatchesByRam, maxBatchesByTime);

        const cycleDuration = (batchSize - 1) * Config.BATCH_SEPARATION + duration + Config.TIME_BUFFER;
        const incomePerCycle = batchSize * targetAmount;

        return incomePerCycle / (cycleDuration / 1000);
    }

    public calculateHackingSkillGain = async (server: ServerDto): Promise<number> => {
        const player = await getPlayerDto();
        const baseDifficulty = server.security.min;
        if (!baseDifficulty) return 0;
        const baseExpGain = 3;
        const diffFactor = 0.3;
        let expGain = baseExpGain;
        expGain += baseDifficulty * diffFactor;
        expGain = expGain * player.mults.hacking_exp * player.bitnode.multipliers.HackExpGain;

        return this.calculateSkill(
            player.exp.hacking + expGain,
            player.mults.hacking * player.bitnode.multipliers.HackingLevelMultiplier,
        );
    }

    private calculateSkill(exp: number, mult = 1): number {
        const value = Math.floor(mult * (32 * Math.log(exp + 534.6) - 200));
        return  Math.max(Math.min(value, Number.MAX_VALUE), 1);
    }
}