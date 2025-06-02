import {
    CorpBaseResearchName,
    CorpMaterialName, CorpProductResearchName,
    CorpUnlockName, CorpUpgradeName,
    IndustryType
} from "/lib/component/corporation/corporation.enum";
import {CityName} from "/lib/enum/location.enum";

export interface IStrategy {
    skip(): boolean;
    prep(): Promise<void>;
    start(): Promise<void>;
    purchase(): Promise<void>;
    production(): Promise<void>;
    export(): Promise<void>;
    sale(): Promise<void>;
    finalStep(): Promise<void>;
    conditionSatisfied(): boolean;
    getNextStrategy(): IStrategy|null;
}

export type StrategyConfigType = {
    Round: number;
    InvestmentFunds: number;
    NewDivisions: StrategyDivisionEntry[];
    Unlocks: CorpUnlockName[];
    PrepCorpUpgrades: Partial<Record<CorpUpgradeName, number>>;
    CorpUpgrades: Partial<Record<CorpUpgradeName, number>>;
};


export interface DivisionOfficeCofiguration {
    InitialWarehouseLevel: number;
    MaxWarehouseLevel: number;

    InitialNumEmployees: number;
    MaxNumEmployees: number;

    MinResearch: number;
    ExportMaterials?: ExportMaterial[];
}

export interface DivisionStrategyConfig {
    InitialNumAdverts: number;
    MaxNumAdverts: number;
    PurchaseBoostMaterials: boolean,
    Research: (CorpBaseResearchName|CorpProductResearchName)[];
    Office: DivisionOfficeConfig;
    ProductCity: CityName|null,
}

export interface StrategyDivisionEntry {
    industry: IndustryType;
    name: string;
}

export type OfficeSettings = DivisionOfficeCofiguration;
export type DivisionOfficeConfig = Record<CityName, OfficeSettings>;
export type ExportMaterial = {importDivision: string; material: CorpMaterialName;};

export const DefaultOfficeConfiguration: DivisionOfficeCofiguration = {
    InitialWarehouseLevel: 1,
    MaxWarehouseLevel: 1,

    InitialNumEmployees: 3,
    MaxNumEmployees: 8,

    MinResearch: 50,
    ExportMaterials: []
};