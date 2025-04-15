import {Corporation, Division, NS} from "@ns";
import {
    CorpBaseResearchName,
    CorpIndustryData, CorpProductResearchName,
    IndustriesData,
    IndustryType
} from "/lib/component/corporation/corporation.enum";
import {DivisionMultiplers} from "/lib/component/corporation/dto/division/division-multiplers";
import {CityName} from "/lib/enum/location.enum";

export class DivisionBase {
    protected readonly ns: NS;
    protected readonly data: (divisionName: string) => Division;
    protected readonly corporationApi: Corporation

    public readonly multipliers: DivisionMultiplers;
    public readonly industry: CorpIndustryData;
    public readonly name: string;

    constructor(ns: NS, name: string) {
        this.ns = ns;
        this.corporationApi = ns.corporation;
        this.data = ns.corporation.getDivision;

        this.name = name;
        this.industry = IndustriesData[this.data(name).type as IndustryType];
        this.multipliers = new DivisionMultiplers(ns, name);
    }

    public getData(): Division {
        return this.data(this.name);
    }

    public getAwareness(): number {
        return this.getData().awareness;
    }

    public getPopularity() {
        return this.getData().popularity;
    }

    public getResearchPoint() {
        return this.getData().researchPoints;
    }

    public getLastCycleRevenue() {
        return this.getData().lastCycleRevenue;
    }

    public getLastCycleExpenses() {
        return this.getData().lastCycleExpenses;
    }

    public hasCity(city: CityName) {
        return this.getData().cities.includes(city);
    }

    public getAdvertLevel() {
        return this.getData().numAdVerts;
    }

    public makesProduct() {
        return this.getData().makesProducts
    }

    public canAffordResearch(researchName: CorpBaseResearchName|CorpProductResearchName) {
        return this.getResearchPoint() >= this.corporationApi.getResearchCost(this.name, researchName);
    }

    public getProducts(city: CityName) {
        return this.getData().products.map(product => this.corporationApi.getProduct(this.name, city, product));
    }

    public getMaxProducts() {
        return this.getData().maxProducts;
    }

    public hasResearched(researchName: CorpBaseResearchName|CorpProductResearchName) {
        return this.corporationApi.hasResearched(this.name, researchName);
    }
}