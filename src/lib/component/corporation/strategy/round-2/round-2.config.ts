import {
    DivisionStrategyConfig, StrategyConfigType,
    StrategyDivisionEntry
} from "/lib/component/corporation/strategy/strategy.interface";
import {CityName} from "/lib/enum/location.enum";
import {
    CorpMaterialName, CorpResearchName,
    CorpUnlockName,
    CorpUpgradeName,
    IndustryType
} from "/lib/component/corporation/corporation.enum";

export const StrategyConfig: StrategyConfigType = {
    Round: 3,
    InvestmentFunds: -Infinity,
    NewDivisions: [
        {
            industry: IndustryType.Tobacco,
            name: "Tobacco"
        },
    ] as StrategyDivisionEntry[],

    Unlocks: [
        CorpUnlockName.Export
    ],

    PrepCorpUpgrades: {
        [CorpUpgradeName.SmartStorage]: 50,
        [CorpUpgradeName.SmartFactories]: 50,
        [CorpUpgradeName.WilsonAnalytics]: 10,
        [CorpUpgradeName.ProjectInsight]: 20,
        [CorpUpgradeName.ABCSalesBots]: 30,
    },

    CorpUpgrades: {
        [CorpUpgradeName.SmartStorage]: 50,
        [CorpUpgradeName.SmartFactories]: 50,
        [CorpUpgradeName.WilsonAnalytics]: 10,
        [CorpUpgradeName.ProjectInsight]: 20,
        [CorpUpgradeName.ABCSalesBots]: 30,
    }
};

const AgroDefaultOfficeConfig = {
    InitialWarehouseLevel: 11,
    MaxWarehouseLevel: 20,
    InitialNumEmployees: 8,
    MaxNumEmployees: 24,
    MinResearch: 100,
    ExportMaterials: [{
        importDivision: "Chem",
        material: CorpMaterialName.Plants
    }, {
        importDivision: "Tobacco",
        material: CorpMaterialName.Plants
    }]
}

const ChemDefaultOfficeConfig = {
    InitialWarehouseLevel: 32,
    MaxWarehouseLevel: 40,

    InitialNumEmployees: 8,
    MaxNumEmployees: 64,

    MinResearch: 100,
    ExportMaterials: [{
        importDivision: "Agro",
        material: CorpMaterialName.Chemicals
    }]
}

const TobaccoMainOfficeConfig = {
    InitialWarehouseLevel: 32,
    MaxWarehouseLevel: 32,

    InitialNumEmployees: 64,
    MaxNumEmployees: 128,

    MinResearch: 100,
    ExportMaterials: []
}

const TobaccoDefaultOfficeConfig = {
    InitialWarehouseLevel: 32,
    MaxWarehouseLevel: 32,

    InitialNumEmployees: 64,
    MaxNumEmployees: 64,

    MinResearch: 100,
    ExportMaterials: []
}

export const DivisionConfig: Record<string, DivisionStrategyConfig> = {
    Agro: {
        InitialNumAdverts: 30,
        MaxNumAdverts: 30,
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
        InitialNumAdverts: 5,
        MaxNumAdverts: 5,
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
    Tobacco: {
        InitialNumAdverts: 30,
        MaxNumAdverts: 30,
        Research: [
            CorpResearchName.Lab,
            CorpResearchName.MarketTa1,
            CorpResearchName.MarketTa2,
        ],
        ProductCity: CityName.Aevum,
        Office: {
            [CityName.Sector12]: TobaccoDefaultOfficeConfig,
            [CityName.Aevum]: TobaccoMainOfficeConfig,
            [CityName.Chongqing]: TobaccoDefaultOfficeConfig,
            [CityName.NewTokyo]: TobaccoDefaultOfficeConfig,
            [CityName.Ishima]: TobaccoDefaultOfficeConfig,
            [CityName.Volhaven]: TobaccoDefaultOfficeConfig,
        },
    },
}