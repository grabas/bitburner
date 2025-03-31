export interface ITerritory {
    money: number;
    respect: number;
    wanted: number;
}

export interface ITaskParams {
    baseRespect: number;
    baseWanted: number;
    baseMoney: number;
    hackWeight: number;
    strWeight: number;
    defWeight: number;
    dexWeight: number;
    agiWeight: number;
    chaWeight: number;
    difficulty: number;
    territory: ITerritory;
}

export interface IGangTask {
    isCombat: boolean;
    isHacking: boolean;
    name: string;
    params: ITaskParams;
}

export const getTaskParams = (params?: Partial<ITaskParams>): ITaskParams => {
    return {
        baseRespect: params?.baseRespect ?? 0,
        baseWanted: params?.baseWanted ?? 0,
        baseMoney: params?.baseMoney ?? 0,
        hackWeight: params?.hackWeight ?? 0,
        strWeight: params?.strWeight ?? 0,
        defWeight: params?.defWeight ?? 0,
        dexWeight: params?.dexWeight ?? 0,
        agiWeight: params?.agiWeight ?? 0,
        chaWeight: params?.chaWeight ?? 0,
        difficulty: params?.difficulty ?? 0,
        territory: params?.territory ?? { money: 1, respect: 1, wanted: 1 }
    };
};

export enum GangTaskNames {
    Unassigned = "Unassigned",
    Ransomware = "Ransomware",
    Phishing = "Phishing",
    IdentityTheft = "Identity Theft",
    DDoSAttacks = "DDoS Attacks",
    PlantVirus = "Plant Virus",
    FraudAndCounterfeiting = "Fraud & Counterfeiting",
    MoneyLaundering = "Money Laundering",
    Cyberterrorism = "Cyberterrorism",
    EthicalHacking = "Ethical Hacking",
    MugPeople = "Mug People",
    DealDrugs = "Deal Drugs",
    StrongarmCivilians = "Strongarm Civilians",
    RunACon = "Run a Con",
    ArmedRobbery = "Armed Robbery",
    TraffickIllegalArms = "Traffick Illegal Arms",
    ThreatenAndBlackmail = "Threaten & Blackmail",
    HumanTrafficking = "Human Trafficking",
    Terrorism = "Terrorism",
    VigilanteJustice = "Vigilante Justice",
    TrainCombat = "Train Combat",
    TrainHacking = "Train Hacking",
    TrainCharisma = "Train Charisma",
    TerritoryWarfare = "Territory Warfare",
}

export const GangMemberTasks: { [key in GangTaskNames]: IGangTask } = {
    [GangTaskNames.Unassigned]: {
        isCombat: true,
        isHacking: true,
        name: GangTaskNames.Unassigned,
        params: getTaskParams({ hackWeight: 100 }),
    },
    [GangTaskNames.Ransomware]: {
        isCombat: false,
        isHacking: true,
        name: GangTaskNames.Ransomware,
        params: getTaskParams({
            baseRespect: 0.00005,
            baseWanted: 0.0001,
            baseMoney: 3,
            hackWeight: 100,
            difficulty: 1,
        }),
    },
    [GangTaskNames.Phishing]: {
        isCombat: false,
        isHacking: true,
        name: GangTaskNames.Phishing,
        params: getTaskParams({
            baseRespect: 0.00008,
            baseWanted: 0.003,
            baseMoney: 7.5,
            hackWeight: 85,
            chaWeight: 15,
            difficulty: 3.5,
        }),
    },
    [GangTaskNames.IdentityTheft]: {
        isCombat: false,
        isHacking: true,
        name: GangTaskNames.IdentityTheft,
        params: getTaskParams({
            baseRespect: 0.0001,
            baseWanted: 0.075,
            baseMoney: 18,
            hackWeight: 80,
            chaWeight: 20,
            difficulty: 5,
        }),
    },
    [GangTaskNames.DDoSAttacks]: {
        isCombat: false,
        isHacking: true,
        name: GangTaskNames.DDoSAttacks,
        params: getTaskParams({
            baseRespect: 0.0004,
            baseWanted: 0.2,
            hackWeight: 100,
            difficulty: 8,
        }),
    },
    [GangTaskNames.PlantVirus]: {
        isCombat: false,
        isHacking: true,
        name: GangTaskNames.PlantVirus,
        params: getTaskParams({
            baseRespect: 0.0006,
            baseWanted: 0.4,
            hackWeight: 100,
            difficulty: 12,
        }),
    },
    [GangTaskNames.FraudAndCounterfeiting]: {
        isCombat: false,
        isHacking: true,
        name: GangTaskNames.FraudAndCounterfeiting,
        params: getTaskParams({
            baseRespect: 0.0004,
            baseWanted: 0.3,
            baseMoney: 45,
            hackWeight: 80,
            chaWeight: 20,
            difficulty: 20,
        }),
    },
    [GangTaskNames.MoneyLaundering]: {
        isCombat: false,
        isHacking: true,
        name: GangTaskNames.MoneyLaundering,
        params: getTaskParams({
            baseRespect: 0.001,
            baseWanted: 1.25,
            baseMoney: 360,
            hackWeight: 75,
            chaWeight: 25,
            difficulty: 25,
        }),
    },
    [GangTaskNames.Cyberterrorism]: {
        isCombat: false,
        isHacking: true,
        name: GangTaskNames.Cyberterrorism,
        params: getTaskParams({
            baseRespect: 0.01,
            baseWanted: 6,
            hackWeight: 80,
            chaWeight: 20,
            difficulty: 36,
        }),
    },
    [GangTaskNames.EthicalHacking]: {
        isCombat: false,
        isHacking: true,
        name: GangTaskNames.EthicalHacking,
        params: getTaskParams({
            baseWanted: -0.001,
            baseMoney: 3,
            hackWeight: 90,
            chaWeight: 10,
            difficulty: 1,
        }),
    },
    [GangTaskNames.MugPeople]: {
        isCombat: true,
        isHacking: false,
        name: GangTaskNames.MugPeople,
        params: getTaskParams({
            baseRespect: 0.00005,
            baseWanted: 0.00005,
            baseMoney: 3.6,
            strWeight: 25,
            defWeight: 25,
            dexWeight: 25,
            agiWeight: 10,
            chaWeight: 15,
            difficulty: 1,
        }),
    },
    [GangTaskNames.DealDrugs]: {
        isCombat: true,
        isHacking: false,
        name: GangTaskNames.DealDrugs,
        params: getTaskParams({
            baseRespect: 0.00006,
            baseWanted: 0.002,
            baseMoney: 15,
            agiWeight: 20,
            dexWeight: 20,
            chaWeight: 60,
            difficulty: 3.5,
            territory: {
                money: 1.2,
                respect: 1,
                wanted: 1.15,
            },
        }),
    },
    [GangTaskNames.StrongarmCivilians]: {
        isCombat: true,
        isHacking: false,
        name: GangTaskNames.StrongarmCivilians,
        params: getTaskParams({
            baseRespect: 0.00004,
            baseWanted: 0.02,
            baseMoney: 7.5,
            hackWeight: 10,
            strWeight: 25,
            defWeight: 25,
            dexWeight: 20,
            agiWeight: 10,
            chaWeight: 10,
            difficulty: 5,
            territory: {
                money: 1.6,
                respect: 1.1,
                wanted: 1.5,
            },
        }),
    },
    [GangTaskNames.RunACon]: {
        isCombat: true,
        isHacking: false,
        name: GangTaskNames.RunACon,
        params: getTaskParams({
            baseRespect: 0.00012,
            baseWanted: 0.05,
            baseMoney: 45,
            strWeight: 5,
            defWeight: 5,
            agiWeight: 25,
            dexWeight: 25,
            chaWeight: 40,
            difficulty: 14,
        }),
    },
    [GangTaskNames.ArmedRobbery]: {
        isCombat: true,
        isHacking: false,
        name: GangTaskNames.ArmedRobbery,
        params: getTaskParams({
            baseRespect: 0.00014,
            baseWanted: 0.1,
            baseMoney: 114,
            hackWeight: 20,
            strWeight: 15,
            defWeight: 15,
            agiWeight: 10,
            dexWeight: 20,
            chaWeight: 20,
            difficulty: 20,
        }),
    },
    [GangTaskNames.TraffickIllegalArms]: {
        isCombat: true,
        isHacking: false,
        name: GangTaskNames.TraffickIllegalArms,
        params: getTaskParams({
            baseRespect: 0.0002,
            baseWanted: 0.24,
            baseMoney: 174,
            hackWeight: 15,
            strWeight: 20,
            defWeight: 20,
            dexWeight: 20,
            chaWeight: 25,
            difficulty: 32,
            territory: {
                money: 1.4,
                respect: 1.3,
                wanted: 1.25,
            },
        }),
    },
    [GangTaskNames.ThreatenAndBlackmail]: {
        isCombat: true,
        isHacking: false,
        name: GangTaskNames.ThreatenAndBlackmail,
        params: getTaskParams({
            baseRespect: 0.0002,
            baseWanted: 0.125,
            baseMoney: 72,
            hackWeight: 25,
            strWeight: 25,
            dexWeight: 25,
            chaWeight: 25,
            difficulty: 28,
        }),
    },
    [GangTaskNames.HumanTrafficking]: {
        isCombat: true,
        isHacking: false,
        name: GangTaskNames.HumanTrafficking,
        params: getTaskParams({
            baseRespect: 0.004,
            baseWanted: 1.25,
            baseMoney: 360,
            hackWeight: 30,
            strWeight: 5,
            defWeight: 5,
            dexWeight: 30,
            chaWeight: 30,
            difficulty: 36,
            territory: {
                money: 1.5,
                respect: 1.5,
                wanted: 1.6,
            },
        }),
    },
    [GangTaskNames.Terrorism]: {
        isCombat: true,
        isHacking: false,
        name: GangTaskNames.Terrorism,
        params: getTaskParams({
            baseRespect: 0.01,
            baseWanted: 6,
            hackWeight: 20,
            strWeight: 20,
            defWeight: 20,
            dexWeight: 20,
            chaWeight: 20,
            difficulty: 36,
            territory: {
                money: 1,
                respect: 2,
                wanted: 2,
            },
        }),
    },
    [GangTaskNames.VigilanteJustice]: {
        isCombat: true,
        isHacking: true,
        name: GangTaskNames.VigilanteJustice,
        params: getTaskParams({
            baseWanted: -0.001,
            hackWeight: 20,
            strWeight: 20,
            defWeight: 20,
            dexWeight: 20,
            agiWeight: 20,
            difficulty: 1,
            territory: {
                money: 1,
                respect: 1,
                wanted: 0.9,
            },
        }),
    },
    [GangTaskNames.TrainCombat]: {
        isCombat: true,
        isHacking: true,
        name: GangTaskNames.TrainCombat,
        params: getTaskParams({
            strWeight: 25,
            defWeight: 25,
            dexWeight: 25,
            agiWeight: 25,
            difficulty: 100,
        }),
    },
    [GangTaskNames.TrainHacking]: {
        isCombat: true,
        isHacking: true,
        name: GangTaskNames.TrainHacking,
        params: getTaskParams({ hackWeight: 100, difficulty: 45 }),
    },
    [GangTaskNames.TrainCharisma]: {
        isCombat: true,
        isHacking: true,
        name: GangTaskNames.TrainCharisma,
        params: getTaskParams({ chaWeight: 100, difficulty: 8 }),
    },
    [GangTaskNames.TerritoryWarfare]: {
        isCombat: true,
        isHacking: true,
        name: GangTaskNames.TerritoryWarfare,
        params: getTaskParams({
            hackWeight: 15,
            strWeight: 20,
            defWeight: 20,
            dexWeight: 20,
            agiWeight: 20,
            chaWeight: 5,
            difficulty: 5,
        }),
    },
};
