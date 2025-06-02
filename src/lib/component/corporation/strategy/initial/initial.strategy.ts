import {IStrategy} from "/lib/component/corporation/strategy/strategy.interface";
import {NS} from "@ns";
import {DivisionConfig, StrategyConfig} from "/lib/component/corporation/strategy/initial/initial.config";
import {StrategyBase} from "/lib/component/corporation/strategy/strategy.base";
import {Round1Strategy} from "/lib/component/corporation/strategy/round-1/round-1.strategy";

export class InitialStrategy extends StrategyBase implements IStrategy {
    constructor(ns: NS) {
       super(ns);
    }

    public skip(): boolean {
        return this.investmentRoundCheck(StrategyConfig);
    }

    public async prep(): Promise<void> {
        this.createDivisions(StrategyConfig.NewDivisions)
        this.expandCities()
        this.upgradeWarehouseLevel(DivisionConfig, "InitialWarehouseLevel");
        this.upgradeOfficeSpace(DivisionConfig, "InitialNumEmployees");
        this.hireEmployees();
        this.purchaseCorpUpgrades(StrategyConfig.PrepCorpUpgrades);
        this.buyAdverts(DivisionConfig, "InitialNumAdverts");
    }

    public async start(): Promise<void> {
        this.upgradeWarehouseLevel(DivisionConfig, "MaxWarehouseLevel");
        this.upgradeOfficeSpace(DivisionConfig, "MaxNumEmployees");
        this.hireEmployees();
        this.assignEmployees(DivisionConfig);
        this.purchaseCorpUpgrades(StrategyConfig.CorpUpgrades);
        this.buyAdverts(DivisionConfig, "MaxNumAdverts");
    }

    public async purchase(): Promise<void> {
        this.purchaseBoostMaterials(DivisionConfig);
        this.purchaseRequiredMaterials();
    }

    public async export(): Promise<void> {
        return Promise.resolve(undefined);
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
        return new Round1Strategy(this.ns);
    }

    public async finalStep(): Promise<void> {
        this.corporationApi.acceptInvestmentOffer();
    }
}