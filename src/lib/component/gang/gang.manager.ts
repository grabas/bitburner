import {Gang, NS} from "@ns";
import {GangFormulas} from "/lib/component/gang/gang.formulas";
import {GangTaskNames} from "/lib/component/gang/enum/gang-task.enum";
import {GangConstants} from "/lib/component/gang/enum/gang.enum";
import {getUpgradesByTypeAndMults, IMults, UpgradeType} from "/lib/component/gang/enum/gang-equipment.enum";

export async function main(ns: NS): Promise<void> {
    ns.disableLog("ALL");
    const manager = new GangManager(ns);
    await manager.manage();
}

export class GangManager {
    private readonly ns: NS;
    private readonly gang: Gang;
    private readonly formulas: GangFormulas;
    private readonly faction: string
    private readonly isHacking: boolean

    constructor(ns: NS) {
        this.ns = ns;
        this.gang = ns.gang
        this.formulas = new GangFormulas(ns);
        this.faction = ns.gang.getGangInformation().faction;
        this.isHacking = ns.gang.getGangInformation().isHacking;
    }

    public async manage() {
        const targetGang = "Speakers for the Dead";
        let prevPower = this.gang.getOtherGangInformation()[targetGang].power;
        let lastTickTime = Date.now();
        let tickInterval = 0;
        let lowestInterval = Infinity;
        let firstTick = true;
        let notifiedForNextTick = false;

        let cycle = 0
        while (true) {
            this.recruit();
            this.equipMembers();
            const gangMembers = this.gang.getMemberNames();

            const currentTime = Date.now();
            const currentPower = this.gang.getOtherGangInformation()[targetGang].power;

            if (currentPower !== prevPower) {
                this.engageInTerritoryClashes();

                for (const memberName of gangMembers) {
                    this.decideMemberAction(memberName);
                }

                tickInterval = currentTime - lastTickTime;
                lastTickTime = currentTime;
                notifiedForNextTick = false;

                if (!firstTick) {
                    lowestInterval = cycle % 5 === 0 ? tickInterval : Math.min(lowestInterval, tickInterval);
                } else {
                    firstTick = false;
                }

                prevPower = currentPower;
            }

            if (lowestInterval !== Infinity) {
                const predictedNextTickTime = lastTickTime + lowestInterval;
                const timeUntilNextTick = predictedNextTickTime - currentTime;

                if (timeUntilNextTick <= 1000 && !notifiedForNextTick && this.gang.getGangInformation().territory !== 1) {
                    for (const memberName of gangMembers) {
                        this.gang.setMemberTask(memberName, GangTaskNames.TerritoryWarfare);
                    }
                    notifiedForNextTick = true;
                }
            }

            cycle++;
            await this.ns.sleep(10);
        }
    }

    private decideMemberAction = (memberName: string): void => {
        if (this.gang.getMemberNames().length < 6) {
            this.gang.setMemberTask(memberName, this.isHacking ? GangTaskNames.Ransomware : GangTaskNames.MugPeople);
            return;
        }

        const mainStat = this.isHacking ? "hack" : "str";
        const trainingTask = this.isHacking ? GangTaskNames.TrainHacking : GangTaskNames.TrainCombat;

        const ascensionResult = this.gang.getAscensionResult(memberName);

        if (!ascensionResult || ascensionResult[mainStat] < 1.10) {
            this.gang.setMemberTask(memberName, trainingTask);
            return;
        }

        if (ascensionResult[mainStat] >= 1.15 && ascensionResult["cha"] >= 1.05 && this.gang.getMemberInformation(memberName).augmentations.length > 1) {
            this.gang.ascendMember(memberName);
            this.gang.setMemberTask(memberName, trainingTask);
            return;
        }

        const task = this.maximizeMoney() ?
            this.formulas.getBestTaskByMoney(memberName) :
            this.formulas.getBestTaskByRespect(memberName) ;

        this.gang.setMemberTask(memberName, task ? task.name : trainingTask);
    }

    private maximizeMoney = (): boolean => {
        const gangInformation = this.gang.getGangInformation();

        if (this.gang.getMemberNames().length < 10) {
            return false;
        }

        if (((1 - this.gang.getGangInformation().wantedPenalty) * 100) > 1.5) {
            return false;
        }

        /*const medianAugReqs = this.getGangMedianAugReqs();
        if (medianAugReqs && medianAugReqs > this.ns.singularity.getFactionRep(this.faction)) {
            return false;
        }*/

        const augCount = getUpgradesByTypeAndMults(UpgradeType.Augmentation, this.getSkills()).length
        for (const memberName of this.gang.getMemberNames()) {
            if (this.gang.getMemberInformation(memberName).augmentations.length !== augCount) {
                return true;
            }
        }

        return gangInformation.respect > 5e4 || gangInformation.territory === 1;
    }

    private engageInTerritoryClashes = (): void => {
        for (const gangName in this.gang.getOtherGangInformation()) {
            const gang = this.gang.getOtherGangInformation()[gangName]
            const thisGang = this.gang.getGangInformation();

            if (gangName === thisGang.faction) continue;

            if ((thisGang.power / (thisGang.power + gang.power)) < 0.9) {
                this.gang.setTerritoryWarfare(false);
                return;
            }
        }

        this.gang.setTerritoryWarfare(true);
    }

    private recruit = (): void => {
        const memberCount = this.gang.getMemberNames().length;
        if (memberCount < GangConstants.MaximumGangMembers) {
            const memberName = memberCount.toString();
            if (this.ns.gang.recruitMember(memberName)) {
                this.gang.setMemberTask(memberName, this.isHacking ? GangTaskNames.TrainHacking : GangTaskNames.TrainCombat);
            }
        }
    }

    private getSkills = (): Array<keyof IMults> => {
        return this.isHacking
            ? ["hck", "cha"]
            : ["str", "def", "dex", "agi", "cha"];
    }

    private equipMembers(): void {
        for (const equipment of this.formulas.getSortedUpgradesByCPR(this.getSkills())) {
            for (const memberName of this.gang.getMemberNames()) {
                const member = this.ns.gang.getMemberInformation(memberName)
                if (member.upgrades.includes(equipment.name)) continue;
                if (member.augmentations.includes(equipment.name)) continue;

                this.ns.gang.purchaseEquipment(member.name, equipment.name)
            }
        }
    }
/*
    private getGangMedianAugReqs = (): number|null => {
        const repReqs: number[] = this.ns.singularity.getAugmentationsFromFaction(this.faction)
            .filter(aug => !this.ns.singularity.getOwnedAugmentations(true).includes(aug))
            .map(aug => this.ns.singularity.getAugmentationRepReq(aug))
            .sort((a, b) => a - b);

        if (repReqs.length === 0) {
            return null;
        }

        const len = repReqs.length;
        return (len % 2 === 0) ?
            (repReqs[len / 2 - 1] + repReqs[len / 2]) / 2 :
            repReqs[Math.floor(len / 2)];
    }*/
}