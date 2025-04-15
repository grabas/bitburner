import {
    DivisionStrategyConfig, StrategyConfigType,
    StrategyDivisionEntry
} from "/lib/component/corporation/strategy/strategy.interface";
import {CityName} from "/lib/enum/location.enum";
import {
    CorpMaterialName,
    CorpUnlockName,
    CorpUpgradeName,
    IndustryType
} from "/lib/component/corporation/corporation.enum";

export const StrategyConfig: StrategyConfigType = {
    Round: 2,
    InvestmentFunds: 4.5e12,
    NewDivisions: [
        {
            industry: IndustryType.Chemical,
            name: "Chem"
        },
    ] as StrategyDivisionEntry[],

    Unlocks: [
        CorpUnlockName.Export
    ],

    PrepCorpUpgrades: {
        [CorpUpgradeName.SmartStorage]: 10,
        [CorpUpgradeName.SmartFactories]: 10,
    },

    CorpUpgrades: {
        [CorpUpgradeName.SmartStorage]: 10,
        [CorpUpgradeName.SmartFactories]: 10,
    }
};

const AgroDefaultOfficeConfig = {
    InitialWarehouseLevel: 14,
    MaxWarehouseLevel: 14,
    InitialNumEmployees: 8,
    MaxNumEmployees: 8,
    MinResearch: 100,
    ExportMaterials: [{
        importDivision: "Chem",
        material: CorpMaterialName.Plants
    }]
}

const ChemDefaultOfficeConfig = {
    InitialWarehouseLevel: 5,
    MaxWarehouseLevel: 5,

    InitialNumEmployees: 6,
    MaxNumEmployees: 6,

    MinResearch: 100,
    ExportMaterials: [{
        importDivision: "Agro",
        material: CorpMaterialName.Chemicals
    }]
}

export const DivisionConfig: Record<string, DivisionStrategyConfig> = {
    Agro: {
        InitialNumAdverts: 1,
        MaxNumAdverts: 1,
        Research: [],
        ProductCity: null,
        Office: {
            [CityName.Sector12]: AgroDefaultOfficeConfig,
            [CityName.Aevum]: AgroDefaultOfficeConfig,
            [CityName.Chongqing]: AgroDefaultOfficeConfig,
            [CityName.NewTokyo]: AgroDefaultOfficeConfig,
            [CityName.Ishima]: AgroDefaultOfficeConfig,
            [CityName.Volhaven]: AgroDefaultOfficeConfig,
        },
    },
    Chem: {
        InitialNumAdverts: 1,
        MaxNumAdverts: 1,
        Research: [],
        ProductCity: null,
        Office: {
            [CityName.Sector12]: ChemDefaultOfficeConfig,
            [CityName.Aevum]: ChemDefaultOfficeConfig,
            [CityName.Chongqing]: ChemDefaultOfficeConfig,
            [CityName.NewTokyo]: ChemDefaultOfficeConfig,
            [CityName.Ishima]: ChemDefaultOfficeConfig,
            [CityName.Volhaven]: ChemDefaultOfficeConfig,
        },
    },
}