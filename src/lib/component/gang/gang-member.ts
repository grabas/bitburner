import {Gang as GangApi, NS} from "@ns";
import {GangConfig} from "/lib/component/gang/gang.config";
import {GangTaskNames} from "/lib/component/gang/enum/gang-task.enum";
import {
    getCombatAugmentations,
    getHackingAugmentations,
    MemberUpgradeNames
} from "/lib/component/gang/enum/gang-equipment.enum";

export class GangMember {
    private readonly gangApi: GangApi;
    public readonly name: string;
    private ns: NS;

    constructor(name: string, ns: NS) {
        this.name = name;
        this.gangApi = ns.gang;
        this.ns = ns
    }

    private getMainStats() {
        return this.gangApi.getGangInformation().isHacking ? "hack" : "str";
    }

    public getMemberInformation() {
        return this.gangApi.getMemberInformation(this.name);
    }

    private getAscensionResults() {
        return this.gangApi.getAscensionResult(this.name);
    }

    public getAugmentations() {
        return this.getMemberInformation().augmentations;
    }

    public getUpgrades() {
        return this.getMemberInformation().upgrades;
    }

    public hasAugmentation(augmentation: MemberUpgradeNames): boolean {
        return this.getAugmentations().includes(augmentation);
    }

    public hasAllAugs(): boolean {
        const augs = this.getMainStats() === "hack" ? getHackingAugmentations() : getCombatAugmentations();
        return augs.length === this.getAugmentations().length;
    }

    public hasUpgrade(upgrade: MemberUpgradeNames): boolean {
        return this.getUpgrades().includes(upgrade);
    }

    public purchaseEquipment(equipment: MemberUpgradeNames): void {
        if (this.hasUpgrade(equipment) || this.hasAugmentation(equipment)) return;
        this.gangApi.purchaseEquipment(this.name, equipment);
    }

    public canAscend(): boolean {
        const accessionResults = this.getAscensionResults();

        if (!accessionResults) return false;

        const mainStatCondition = accessionResults[this.getMainStats()] >= GangConfig.AscentionMainStatThresholdMultiplier;
        const secondaryStatCondition = accessionResults["cha"] >= GangConfig.AscentionCharStatThresholdMultiplier;
        const hasAtleastOneAugmentation = this.getAugmentations().length > 0;

        return mainStatCondition && secondaryStatCondition && hasAtleastOneAugmentation;
    }

    public ascend(): void {
        if (this.canAscend()) {
            this.gangApi.ascendMember(this.name);
            this.train();
        }
    }

    public setTask(task: GangTaskNames): void {
        this.gangApi.setMemberTask(this.name, task);
    }

    public getBasicTask(): GangTaskNames {
        return this.getMainStats() === "hack" ? GangTaskNames.Ransomware : GangTaskNames.MugPeople;
    }

    public doBasicTask(): void {
        this.setTask(this.getBasicTask());
    }

    public getTrainingTask(): GangTaskNames {
        return this.getMainStats() === "hack" ? GangTaskNames.TrainHacking : GangTaskNames.TrainCombat;
    }

    public shouldTrain(): boolean {
        const ascensionResults = this.getAscensionResults();
        return !ascensionResults || ascensionResults[this.getMainStats()] < GangConfig.TrainingThreshold;
    }

    public train(): void {
        this.setTask(this.getTrainingTask());
    }
}