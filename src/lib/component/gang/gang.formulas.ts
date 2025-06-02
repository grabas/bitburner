import {NS} from "@ns";
import {IMemberUpgrade, IMults, MemberUpdagrades, MemberUpgradeNames, UpgradeType} from "./enum/gang-equipment.enum";
import {getBitnode} from "/lib/repository/bitnode.repository";
import {Bitnode} from "/lib/entity/bitnode/bitnode";
import {GangMemberTasks, IGangTask} from "/lib/component/gang/enum/gang-task.enum";
import {GangMember} from "/lib/component/gang/gang-member";

export class GangFormulas {
    private readonly ns: NS;
    private readonly bitnode: Bitnode

    constructor(ns: NS) {
        this.ns = ns;
        this.bitnode = getBitnode();
    }

    getWantedPenalty(): number {
        const gangInfo = this.ns.gang.getGangInformation();
        return gangInfo.wantedPenalty;
    }

    public calculateUpgradeCPR(
        upgrade: IMemberUpgrade,
        stats: Array<keyof IMults>
    ): number {
        const totalImprovement = stats.reduce((acc, stat) => {
            const multiplier = upgrade.mults[stat];
            return acc + (multiplier && multiplier > 1 ? multiplier - 1 : 0);
        }, 0);

        if (totalImprovement === 0) return Infinity;
        return this.getUpgradeCost(upgrade) / totalImprovement;
    }

    public getSortedUpgradesByCPR(
        stats: Array<keyof IMults>
    ): Array<{ name: MemberUpgradeNames; cost: number; ratio: number; type: UpgradeType }> {
        return Object.entries(MemberUpdagrades)
            .filter(([_, upg]) =>
                stats.some(stat => upg.mults[stat] !== undefined)
            )
            .map(([key, upgrade]) => ({
                name: key as MemberUpgradeNames,
                cost: this.getUpgradeCost(upgrade),
                type: upgrade.upgType,
                ratio: this.calculateUpgradeCPR(upgrade, stats),
            }))
            .sort((a, b) => a.ratio - b.ratio);
    }

    public getUpgradeCost(upgrade: IMemberUpgrade): number {
        return upgrade.cost / this.getDiscount();
    }

    public getDiscount(): number {
        const gangInfo = this.ns.gang.getGangInformation();

        const power = gangInfo.power
        const respect = gangInfo.respect

        const respectLinearFac = 5e6;
        const powerLinearFac = 1e6;
        const discount =
            Math.pow(respect, 0.01) + respect / respectLinearFac + Math.pow(power, 0.01) + power / powerLinearFac - 1;

        return Math.max(1, discount);
    }

    public getDiscountPercentage(): number {
        const discount = this.getDiscount();
        return Math.max(0, (1 - 1 / discount));
    }

    public getBestTaskByRespect(member: GangMember, hackingFilter = false): IGangTask | null {
        let tasks = Object.values(GangMemberTasks);
        tasks = tasks.filter(task => hackingFilter ? task.isHacking : task.isCombat);

        let bestTask: IGangTask | null = null;
        let highestRespect = -Infinity;

        for (const task of tasks) {
            const respectGain = this.calculateRespectGain(member, task);
            const wantedGain = this.calculateWantedLevelGain(member, task);

            if (respectGain === 0) continue;

            const ratio = wantedGain / respectGain;
            if (ratio > 2) continue;

            if (respectGain > highestRespect) {
                highestRespect = respectGain;
                bestTask = task;
            }
        }

        return bestTask;
    }

    public getBestTaskByMoney(member: GangMember, hackingFilter = false): IGangTask | null {
        let tasks = Object.values(GangMemberTasks);
        tasks = tasks.filter(task => hackingFilter ? task.isHacking : task.isCombat);

        let bestTask: IGangTask | null = null;
        let highestRespect = -Infinity;

        for (const task of tasks) {
            const moneyGain = this.calculateMoneyGain(member, task);
            const wantedGain = this.calculateWantedLevelGain(member, task);

            if (moneyGain === 0) continue;

            const ratio = wantedGain / moneyGain;
            if (ratio > 2) continue;

            if (moneyGain > highestRespect) {
                highestRespect = moneyGain;
                bestTask = task;
            }
        }

        return bestTask;
    }

    public getTaskWithLowestWantedGain(member: GangMember): IGangTask | null {
        const tasks = Object.values(GangMemberTasks)

        let bestTask: IGangTask | null = null;
        let lowestWantedGain = Infinity;

        for (const task of tasks) {
            const wantedGain = this.calculateWantedLevelGain(member, task);
            if (wantedGain < lowestWantedGain) {
                lowestWantedGain = wantedGain;
                bestTask = task;
            }
        }

        return bestTask;
    }

    public calculateRespectGain(member: GangMember, task: IGangTask): number {
        const gang = this.ns.gang.getGangInformation()
        if (task.params.baseRespect === 0) return 0;
        let statWeight = this.getStatWeight(member, task);
        statWeight -= 4 * task.params.difficulty;
        if (statWeight <= 0) return 0;
        const territoryMult = Math.max(0.005, Math.pow(gang.territory * 100, task.params.territory.respect) / 100);
        const territoryPenalty = (0.2 * gang.territory + 0.8) * this.bitnode.multipliers.GangSoftcap;
        if (isNaN(territoryMult) || territoryMult <= 0) return 0;
        const respectMult = this.getWantedPenalty();
        return Math.pow(11 * task.params.baseRespect * statWeight * territoryMult * respectMult, territoryPenalty);
    }

    public calculateWantedLevelGain(member: GangMember, task: IGangTask): number {
        const gang = this.ns.gang.getGangInformation()
        if (task.params.baseWanted === 0) return 0;
        let statWeight = this.getStatWeight(member, task);
        statWeight -= 3.5 * task.params.difficulty;
        if (statWeight <= 0) return 0;
        const territoryMult = Math.max(0.005, Math.pow(gang.territory * 100, task.params.territory.wanted) / 100);
        if (isNaN(territoryMult) || territoryMult <= 0) return 0;
        if (task.params.baseWanted < 0) {
            return 0.4 * task.params.baseWanted * statWeight * territoryMult;
        }
        const calc = (7 * task.params.baseWanted) / Math.pow(3 * statWeight * territoryMult, 0.8);

        return Math.min(100, calc);
    }

    public calculateMoneyGain(member: GangMember, task: IGangTask): number {
        const gang = this.ns.gang.getGangInformation()
        if (task.params.baseMoney === 0) return 0;
        let statWeight = this.getStatWeight(member, task);

        statWeight -= 3.2 * task.params.difficulty;
        if (statWeight <= 0) return 0;
        const territoryMult = Math.max(0.005, Math.pow(gang.territory * 100, task.params.territory.money) / 100);
        if (isNaN(territoryMult) || territoryMult <= 0) return 0;
        const respectMult = this.getWantedPenalty();
        const territoryPenalty = (0.2 * gang.territory + 0.8) * this.bitnode.multipliers.GangSoftcap;
        return Math.pow(5 * task.params.baseMoney * statWeight * territoryMult * respectMult, territoryPenalty);
    }

    private getStatWeight(member: GangMember, task: IGangTask): number {
        const memberInfo = member.getMemberInformation();
        return (task.params.hackWeight / 100) * memberInfo.hack +
            (task.params.strWeight / 100) * memberInfo.str +
            (task.params.defWeight / 100) * memberInfo.def +
            (task.params.dexWeight / 100) * memberInfo.dex +
            (task.params.agiWeight / 100) * memberInfo.agi +
            (task.params.chaWeight / 100) * memberInfo.cha;
    }
}