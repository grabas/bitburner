import {
    DivisionStrategyConfig, OfficeSettings, StrategyConfigType,
    StrategyDivisionEntry
} from "/lib/component/corporation/strategy/strategy.interface";
import { CityName } from "/lib/enum/location.enum";
import {
    CorpUpgradeName,
    IndustryType,
} from "/lib/component/corporation/corporation.enum";

export const StrategyConfig: StrategyConfigType = {
    Round: 1,
    InvestmentFunds: 340e9,
    NewDivisions: [
        {
            industry: IndustryType.Agriculture,
            name: "Agro",
        },
    ] as StrategyDivisionEntry[],

    Unlocks: [],

    PrepCorpUpgrades: {
        [CorpUpgradeName.SmartStorage]: 3,
        [CorpUpgradeName.SmartFactories]: 0,
    },

    CorpUpgrades: {
        [CorpUpgradeName.SmartStorage]: 3,
        [CorpUpgradeName.SmartFactories]: 0,
    },
};

const AgroDefaultOfficeConfig: OfficeSettings = {
    InitialWarehouseLevel: 4,
    MaxWarehouseLevel: 4,
    InitialNumEmployees: 7,
    MaxNumEmployees: 7,
    MinResearch: 10,
};

export const DivisionConfig: Record<string, DivisionStrategyConfig> = {
    Agro: {
        InitialNumAdverts: 1,
        MaxNumAdverts: 1,
        Research: [],
        ProductCity: null,
        PurchaseBoostMaterials: true,
        Office: {
            [CityName.Sector12]: AgroDefaultOfficeConfig,
            [CityName.Aevum]: AgroDefaultOfficeConfig,
            [CityName.Chongqing]: AgroDefaultOfficeConfig,
            [CityName.NewTokyo]: AgroDefaultOfficeConfig,
            [CityName.Ishima]: AgroDefaultOfficeConfig,
            [CityName.Volhaven]: AgroDefaultOfficeConfig,
        },
    },
};