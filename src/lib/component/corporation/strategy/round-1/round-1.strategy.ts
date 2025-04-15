import {IStrategy} from "/lib/component/corporation/strategy/strategy.interface";
import {NS} from "@ns";
import {DivisionConfig, StrategyConfig} from "/lib/component/corporation/strategy/round-1/round-1.config";
import {StrategyBase} from "/lib/component/corporation/strategy/strategy.base";
import {Round2Strategy} from "/lib/component/corporation/strategy/round-2/round-2.strategy";

export class Round1Strategy extends StrategyBase implements IStrategy {
    constructor(ns: NS) {
       super(ns);
    }

    public skip(): boolean {
        return this.investmentRoundCheck(StrategyConfig);
    }

    public async prep(): Promise<void> {
        this.buyUnlocks(StrategyConfig.Unlocks);
        this.createDivisions(StrategyConfig.NewDivisions)
        this.expandCities()
        this.upgradeWarehouseLevel(DivisionConfig, "InitialWarehouseLevel");
        this.upgradeOfficeSpace(DivisionConfig, "InitialNumEmployees");
        this.buyAdverts(DivisionConfig, "InitialNumAdverts");
        this.hireEmployees();
        this.purchaseCorpUpgrades(StrategyConfig.PrepCorpUpgrades);
    }

    public async start(): Promise<void> {
        this.buyAdverts(DivisionConfig, "MaxNumAdverts");
        this.upgradeWarehouseLevel(DivisionConfig, "MaxWarehouseLevel");
        this.upgradeOfficeSpace(DivisionConfig, "MaxNumEmployees");
        this.hireEmployees();
        this.assignEmployees(DivisionConfig);
        this.purchaseCorpUpgrades(StrategyConfig.CorpUpgrades);
        this.buyResearch(DivisionConfig);
    }

    public async purchase(): Promise<void> {
        //this.purchaseBoostMaterials();
        this.purchaseRequiredMaterials();
    }

    public async export(): Promise<void> {
        this.setExport(DivisionConfig);
    }

    public async production(): Promise<void> {
        return Promise.resolve(undefined);
    }

    public async sale(): Promise<void> {
        this.setOptimalPrices();
    }

    public conditionSatisfied(): boolean {
        return this.conditionsSatisfied(StrategyConfig, DivisionConfig);
    }

    public getNextStrategy(): IStrategy | null {
        return new Round2Strategy(this.ns);
    }

    public async finalStep(): Promise<void> {
        this.corporationApi.acceptInvestmentOffer();
    }
}