import {Corporation, NS} from "@ns";
import {CorpBaseResearchName, CorpUpgradeName} from "/lib/component/corporation/corporation.enum";

export class DivisionMultiplers {
    private readonly corporationApi: Corporation;
    private readonly division: string;

    constructor(ns: NS, division: string) {
        this.corporationApi = ns.corporation;
        this.division = division;
    }

    public getDivisionData() {
        return this.corporationApi.getDivision(this.division);
    }

    public hasResearched(research: CorpBaseResearchName): boolean {
        return this.corporationApi.hasResearched(this.division, research);
    }

    public getEmployeeCreMultiplier() {
        return this.hasResearched(CorpBaseResearchName.CPH4Inject) ? 1.1 : 1;
    }

    public getEmployeeChaMultiplier() {
        return this.hasResearched(CorpBaseResearchName.CPH4Inject) ? 1.1 : 1;
    }

    public getEmployeeIntMultiplier() {
        return (this.hasResearched(CorpBaseResearchName.CPH4Inject) ? 1.1 : 1) * (this.hasResearched(CorpBaseResearchName.Overclock) ? 1.25 : 1);
    }

    public getEmployeeEffMultiplier() {
        return (this.hasResearched(CorpBaseResearchName.CPH4Inject) ? 1.1 : 1) * (this.hasResearched(CorpBaseResearchName.Overclock) ? 1.25 : 1);
    }

    public getProductionMultiplier() {
        return this.getDivisionData().productionMult;
    }

    public getResearchProducionMultiplier(): number {
        const assemblyMultipler = this.hasResearched(CorpBaseResearchName.SelfCorrectAssemblers) ? 1.1 : 1;
        const droneAssemblyMultiplier = this.hasResearched(CorpBaseResearchName.DronesAssembly) ? 1.2 : 1;

        return assemblyMultipler * droneAssemblyMultiplier;
    }
}