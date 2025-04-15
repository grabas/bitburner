import {Corporation, NS} from "@ns";
import {CorpUpgradeName} from "/lib/component/corporation/corporation.enum";

export class CorporationMultiplers {
    private readonly corporationApi: Corporation;

    constructor(ns: NS) {
        this.corporationApi = ns.corporation;
    }

    private getMultipler(upgrade: CorpUpgradeName, effect: number): number {
        return (upgrade === CorpUpgradeName.DreamSense ? 0 : 1) + this.getUpgradeLevel(upgrade) * effect
    }

    public getUpgradeLevel(upgrade: CorpUpgradeName): number {
        return this.corporationApi.getUpgradeLevel(upgrade);
    }

    public getEmployeeCreMultiplier() {
        return this.getMultipler(CorpUpgradeName.NuoptimalNootropicInjectorImplants, 0.1);
    }

    public getEmployeeChaMultiplier() {
        return this.getMultipler(CorpUpgradeName.SpeechProcessorImplants, 0.1);
    }

    public getEmployeeIntMultiplier() {
        return this.getMultipler(CorpUpgradeName.NeuralAccelerators, 0.1);
    }

    public getEmployeeEffMultiplier() {
        return this.getMultipler(CorpUpgradeName.FocusWires, 0.1);
    }

    public getProdMultiplier() {
        return this.getMultipler(CorpUpgradeName.SmartFactories, 0.03);
    }

    public getStorageMultiplier() {
        return this.getMultipler(CorpUpgradeName.SmartStorage, 0.1);
    }

    public getAdvertMultiplier() {
        return this.getMultipler(CorpUpgradeName.WilsonAnalytics, 0.005);
    }

    public getAwarenessMultiplier() {
        return this.getMultipler(CorpUpgradeName.DreamSense, 0.001);
    }

    public getPopularityMultiplier() {
        return this.getMultipler(CorpUpgradeName.DreamSense, 0.001);
    }

    public getSalesMultiplier() {
        return this.getMultipler(CorpUpgradeName.ABCSalesBots, 0.1);
    }

    public getResearchMultiplier() {
        return this.getMultipler(CorpUpgradeName.ProjectInsight, 0.25);
    }
}