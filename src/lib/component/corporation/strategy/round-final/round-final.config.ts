import {
    DivisionStrategyConfig,
    StrategyConfigType,
    StrategyDivisionEntry
} from "/lib/component/corporation/strategy/strategy.interface";
import {CityName} from "/lib/enum/location.enum";
import {
    CorpMaterialName,
    CorpResearchName,
    CorpUpgradeName,
} from "/lib/component/corporation/corporation.enum";

export const StrategyConfig: StrategyConfigType = {
    Round: 4,
    InvestmentFunds: -Infinity,
    NewDivisions: [] as StrategyDivisionEntry[],

    Unlocks: [],

    PrepCorpUpgrades: {
        [CorpUpgradeName.SmartStorage]: 200,
        [CorpUpgradeName.SmartFactories]: 200,
        [CorpUpgradeName.WilsonAnalytics]: 20,
        [CorpUpgradeName.FocusWires]: 200,
        [CorpUpgradeName.ProjectInsight]: 100,
        [CorpUpgradeName.ABCSalesBots]: 200,
        [CorpUpgradeName.NeuralAccelerators]: 200,
        [CorpUpgradeName.DreamSense]: 100,
        [CorpUpgradeName.NuoptimalNootropicInjectorImplants]: 200,
        [CorpUpgradeName.SpeechProcessorImplants]: 200
    },

    CorpUpgrades: {
        [CorpUpgradeName.WilsonAnalytics]: Infinity,
        [CorpUpgradeName.ProjectInsight]: Infinity,
        [CorpUpgradeName.ABCSalesBots]: Infinity,
        [CorpUpgradeName.SmartStorage]: Infinity,
        [CorpUpgradeName.SmartFactories]: Infinity,
        [CorpUpgradeName.FocusWires]: 200,
        [CorpUpgradeName.NeuralAccelerators]: 200,
        [CorpUpgradeName.DreamSense]: 200,
        [CorpUpgradeName.NuoptimalNootropicInjectorImplants]: 200,
        [CorpUpgradeName.SpeechProcessorImplants]: 200
    }
};

const AgroDefaultOfficeConfig = {
    InitialWarehouseLevel: 20,
    MaxWarehouseLevel: 40,
    InitialNumEmployees: 8,
    MaxNumEmployees: 32,
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
    MaxNumEmployees: 32,

    MinResearch: 100,
    ExportMaterials: [{
        importDivision: "Agro",
        material: CorpMaterialName.Chemicals
    }]
}

const TobaccoMainOfficeConfig = {
    InitialWarehouseLevel: 32,
    MaxWarehouseLevel: 64,

    InitialNumEmployees: 64,
    MaxNumEmployees: Infinity,

    MinResearch: 100,
    ExportMaterials: []
}

const TobaccoDefaultOfficeConfig = {
    InitialWarehouseLevel: 32,
    MaxWarehouseLevel: 64,

    InitialNumEmployees: 64,
    MaxNumEmployees: 128,

    MinResearch: 100,
    ExportMaterials: []
}

export const DivisionConfig: Record<string, DivisionStrategyConfig> = {
    Agro: {
        InitialNumAdverts: 30,
        MaxNumAdverts: 30,
        Research: [
            CorpResearchName.Lab,
            CorpResearchName.AutoBrew,
            CorpResearchName.AutoParty,
            CorpResearchName.AutoDrug,
            CorpResearchName.CPH4Inject,
            CorpResearchName.Drones,
            CorpResearchName.DronesAssembly,
            CorpResearchName.GoJuice,
            CorpResearchName.Overclock,
            CorpResearchName.SelfCorrectAssemblers,
            CorpResearchName.Stimu
        ],
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
        Research: [
            CorpResearchName.Lab,
            CorpResearchName.AutoBrew,
            CorpResearchName.AutoParty,
            CorpResearchName.AutoDrug,
            CorpResearchName.CPH4Inject,
            CorpResearchName.Drones,
            CorpResearchName.DronesAssembly,
            CorpResearchName.DronesTransport,
            CorpResearchName.GoJuice,
            CorpResearchName.Overclock,
            CorpResearchName.SelfCorrectAssemblers,
            CorpResearchName.Stimu
        ],
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
        InitialNumAdverts: 100,
        MaxNumAdverts: Infinity,
        Research: [
           CorpResearchName.Lab,
           CorpResearchName.AutoBrew,
           CorpResearchName.AutoParty,
           CorpResearchName.AutoDrug,
           CorpResearchName.CPH4Inject,
           CorpResearchName.Drones,
           CorpResearchName.DronesAssembly,
           CorpResearchName.DronesTransport,
           CorpResearchName.GoJuice,
           CorpResearchName.MarketTa1,
           CorpResearchName.MarketTa2,
           CorpResearchName.Overclock,
           CorpResearchName.SelfCorrectAssemblers,
           CorpResearchName.Stimu,
           CorpResearchName.Fulcrum
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