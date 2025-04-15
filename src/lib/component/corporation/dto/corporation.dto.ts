import {Corporation, CorporationInfo, CorpStateName, NS} from "@ns";
import {DivisionDto} from "/lib/component/corporation/dto/division/division.dto";
import {CorpUnlockName, CorpUpgradeName, IndustryType} from "/lib/component/corporation/corporation.enum";
import {CityName} from "/lib/enum/location.enum";
import {OfficeDto} from "/lib/component/corporation/dto/office.dto";

export class CorporationDto {
    public readonly name: string;

    private readonly ns: NS;
    private data: () => CorporationInfo;
    private corporationApi: Corporation;

    constructor(ns: NS) {
        this.ns = ns;
        this.corporationApi = ns.corporation;
        this.data = ns.corporation.getCorporation;
        this.name = this.data().name;
    }

    public getFunds(): number {
        return this.data().funds;
    }

    public canAfford(amount: number): boolean {
        return this.getFunds() >= amount;
    }

    public getState(): CorpStateName {
        return this.data().nextState;
    }

    public getDivisions(): DivisionDto[] {
        return this.data().divisions.map(division => new DivisionDto(this.ns, division));
    }

    public hasExpandedToIndustry(industry: IndustryType) {
        return this.getDivisions().some((division) => {
            return division.industry.name === industry;
        });
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

    private getMultipler(upgrade: CorpUpgradeName, effect: number): number {
        return 1 + this.getUpgradeLevel(upgrade) * effect
    }

    public hasUnlock(unlock: CorpUnlockName) {
        return this.corporationApi.hasUnlock(unlock);
    }

    public getOffice(division: string, city: CityName) {
        return new OfficeDto(this.ns, division, city);
    }

    public isPublic() {
        return this.data().public;
    }
}