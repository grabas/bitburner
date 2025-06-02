import {Gang as GangApi, NS} from "@ns";
import {GangFormulas} from "/lib/component/gang/gang.formulas";
import {FactionName} from "/lib/enum/faction.enum";
import {GangMember} from "/lib/component/gang/gang-member";
import {GangConfig} from "/lib/component/gang/gang.config";
import {GangTaskNames} from "/lib/component/gang/enum/gang-task.enum";
import {IMults} from "/lib/component/gang/enum/gang-equipment.enum";
import {GangConstants} from "/lib/component/gang/enum/gang.enum";

export class Gang {
    private readonly ns: NS;
    private readonly gangApi: GangApi;
    private readonly formulas: GangFormulas;
    public readonly faction: FactionName
    public readonly isHacking: boolean

    constructor(ns: NS) {
        this.ns = ns;
        this.gangApi = ns.gang
        this.formulas = new GangFormulas(ns);
        this.faction = this.gangApi.getGangInformation().faction as FactionName;
        this.isHacking = this.gangApi.getGangInformation().isHacking;
    }

    private getSkills = (): Array<keyof IMults> => {
        if (this.isHacking && this.controlsTerritory()) {
            return ["hck", "cha"] as Array<keyof IMults>;
        }

        const skills = ["str", "def", "dex", "agi", "cha"];

        if (this.isHacking) {
            skills.push("hck");
        }

        return skills as Array<keyof IMults>;
    }

    public getGangInformation() {
        return this.gangApi.getGangInformation();
    }

    public getPower(): number {
        return this.getGangInformation().power;
    }

    public getTerritory(): number {
        return this.getGangInformation().territory;
    }

    public controlsTerritory(): boolean {
        return this.getTerritory() === 1;
    }

    public getWantedPenaltyPercent(): number {
        return (1 - this.getGangInformation().wantedPenalty) * 100;
    }

    public getGangMemberCount(): number {
        return this.gangApi.getMemberNames().length;
    }

    public getGangMembers() {
        return this.gangApi.getMemberNames().map(name => new GangMember(name, this.ns));
    }

    public engageInTerritoryWarfare(): void {
        this.getGangMembers().forEach(member => member.setTask(GangTaskNames.TerritoryWarfare));
    }

    public engageInTerritoryClash(): void {
        if (this.getGangMemberCount() < GangConstants.MaximumGangMembers / 2) {
            this.assignTasks();
            return;
        }

        this.gangApi.setTerritoryWarfare(this.canEngageInTerritoryClash())
    }

    private canEngageInTerritoryClash(): boolean {
        for (const [name, info] of Object.entries(this.gangApi.getOtherGangInformation())) {
            if (name === this.faction) continue;

            if (this.getPower() / (this.getPower() + info.power) < GangConfig.TerritoryClashChanceThreshold) {
                return false
            }
        }

        return true
    }

    private shouldPrioritizeRespect(): boolean {
        const discountCondition = !this.everyGangMemberHasAllAugs() &&
            this.formulas.getDiscountPercentage() < Math.min(0.80, this.getTerritory() * 2) &&
            !this.controlsTerritory();

        return this.getGangMemberCount() < GangConstants.MaximumGangMembers ||
            this.getWantedPenaltyPercent() > GangConfig.MaxWantedPenaltyPercent ||
            discountCondition
    }

    public assignTasks(): void {
        this.getGangMembers().forEach(member => this.decideMemberAction(member));
    }

    private decideMemberAction(member: GangMember): void {
        if (this.getGangMemberCount() < GangConstants.MaximumGangMembers / 2) {
            const task = this.formulas.getBestTaskByRespect(member, this.isHacking);
            task ? member.setTask(task.name) : member.doBasicTask();
            return;
        }

        if (member.shouldTrain()) {
            member.train();
            return;
        }

        if (member.canAscend()) {
            member.ascend();
            return;
        }

        const task = this.shouldPrioritizeRespect() ?
            this.formulas.getBestTaskByRespect(member, this.isHacking) :
            this.formulas.getBestTaskByMoney(member, this.isHacking);

        task ? member.setTask(task.name) : member.doBasicTask();
    }

    public recruit(): void {
        const memberCount = this.getGangMemberCount();
        if (memberCount === GangConstants.MaximumGangMembers) {
            return;
        }

        const newMemberName = memberCount.toString();
        if (this.gangApi.recruitMember(newMemberName)) {
            (new GangMember(newMemberName, this.ns)).train();
        }
    }

    public equipMembers(): void {
        for (const equipment of this.formulas.getSortedUpgradesByCPR(this.getSkills())) {
            this.getGangMembers().forEach(member => member.purchaseEquipment(equipment.name))
        }
    }

    private everyGangMemberHasAllAugs(): boolean {
        return this.getGangMemberCount() === GangConstants.MaximumGangMembers &&
            this.getGangMembers().every(member => member.hasAllAugs())
    }
}