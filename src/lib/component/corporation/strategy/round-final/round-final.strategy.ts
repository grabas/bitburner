import {IStrategy} from "/lib/component/corporation/strategy/strategy.interface";
import {NS} from "@ns";
import {DivisionConfig, StrategyConfig} from "/lib/component/corporation/strategy/round-final/round-final.config";
import {StrategyBase} from "/lib/component/corporation/strategy/strategy.base";


export class RoundFinalStrategy extends StrategyBase implements IStrategy {
    constructor(ns: NS) {
       super(ns);
    }

    public skip(): boolean {
        return false
    }

    public async prep(): Promise<void> {
        this.buyUnlocks(StrategyConfig.Unlocks);
        this.createDivisions(StrategyConfig.NewDivisions)
        this.expandCities()
        this.upgradeWarehouseLevel(DivisionConfig, "InitialWarehouseLevel");
        this.upgradeOfficeSpace(DivisionConfig, "InitialNumEmployees");
        this.hireEmployees();
        this.purchaseCorpUpgrades(StrategyConfig.PrepCorpUpgrades);
        this.assignEmployees(DivisionConfig);
        this.buyAdverts(DivisionConfig, "InitialNumAdverts");
    }

    public async start(): Promise<void> {
        this.buyAdverts(DivisionConfig, "MaxNumAdverts");
        this.upgradeWarehouseLevel(DivisionConfig, "MaxWarehouseLevel");
        this.upgradeOfficeSpace(DivisionConfig, "MaxNumEmployees");
        this.hireEmployees();
        //this.assignEmployees(DivisionConfig);
        this.purchaseCorpUpgrades(StrategyConfig.CorpUpgrades);
        this.buyResearch(DivisionConfig);
        this.handleProduct(DivisionConfig);
    }

    public async purchase(): Promise<void> {
        //this.purchaseBoostMaterials(DivisionConfig);
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
        return false;
    }

    public getNextStrategy(): IStrategy | null {
        return null;
    }

    public async finalStep(): Promise<void> {
        return Promise.resolve(undefined);
    }
}
