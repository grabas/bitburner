export interface IMults {
    hck?: number;
    str?: number;
    def?: number;
    dex?: number;
    agi?: number;
    cha?: number;
}

export enum UpgradeType {
    Weapon = "weapon",
    Armor = "armor",
    Vehicle = "vehicle",
    Rootkit = "rootkit",
    Augmentation = "augmentation",
}

export interface IMemberUpgrade {
    cost: number;
    mults: IMults;
    upgType: UpgradeType;
}

export enum MemberUpgradeNames {
    BaseballBat = "Baseball Bat",
    Katana = "Katana",
    Glock18C = "Glock 18C",
    P90C = "P90C",
    SteyrAUG = "Steyr AUG",
    AK47 = "AK-47",
    M15A10AssaultRifle = "M15A10 Assault Rifle",
    AWMSniperRifle = "AWM Sniper Rifle",
    BulletproofVest = "Bulletproof Vest",
    FullBodyArmor = "Full Body Armor",
    LiquidBodyArmor = "Liquid Body Armor",
    GraphenePlatingArmor = "Graphene Plating Armor",
    FordFlexV20 = "Ford Flex V20",
    ATX1070Superbike = "ATX1070 Superbike",
    MercedesBenzS9001 = "Mercedes-Benz S9001",
    WhiteFerrari = "White Ferrari",
    NUKERootkit = "NUKE Rootkit",
    SoulstealerRootkit = "Soulstealer Rootkit",
    DemonRootkit = "Demon Rootkit",
    HmapNode = "Hmap Node",
    JackTheRipper = "Jack the Ripper",
    BionicArms = "Bionic Arms",
    BionicLegs = "Bionic Legs",
    BionicSpine = "Bionic Spine",
    BrachiBlades = "BrachiBlades",
    NanofiberWeave = "Nanofiber Weave",
    SyntheticHeart = "Synthetic Heart",
    SynfibrilMuscle = "Synfibril Muscle",
    BitWire = "BitWire",
    Neuralstimulator = "Neuralstimulator",
    DataJack = "DataJack",
    GrapheneBoneLacings = "Graphene Bone Lacings",
}

export const MemberUpdagrades: { [key in MemberUpgradeNames]: IMemberUpgrade } = {
    [MemberUpgradeNames.BaseballBat]: {
        cost: 1e6,
        mults: { str: 1.04, def: 1.04 },
        upgType: UpgradeType.Weapon,
    },
    [MemberUpgradeNames.Katana]: {
        cost: 12e6,
        mults: { str: 1.08, def: 1.08, dex: 1.08 },
        upgType: UpgradeType.Weapon,
    },
    [MemberUpgradeNames.Glock18C]: {
        cost: 25e6,
        mults: { str: 1.1, def: 1.1, dex: 1.1, agi: 1.1 },
        upgType: UpgradeType.Weapon,
    },
    [MemberUpgradeNames.P90C]: {
        cost: 50e6,
        mults: { str: 1.12, def: 1.1, agi: 1.1 },
        upgType: UpgradeType.Weapon,
    },
    [MemberUpgradeNames.SteyrAUG]: {
        cost: 60e6,
        mults: { str: 1.2, def: 1.15 },
        upgType: UpgradeType.Weapon,
    },
    [MemberUpgradeNames.AK47]: {
        cost: 100e6,
        mults: { str: 1.25, def: 1.2 },
        upgType: UpgradeType.Weapon,
    },
    [MemberUpgradeNames.M15A10AssaultRifle]: {
        cost: 150e6,
        mults: { str: 1.3, def: 1.25 },
        upgType: UpgradeType.Weapon,
    },
    [MemberUpgradeNames.AWMSniperRifle]: {
        cost: 225e6,
        mults: { str: 1.3, dex: 1.25, agi: 1.3 },
        upgType: UpgradeType.Weapon,
    },
    [MemberUpgradeNames.BulletproofVest]: {
        cost: 2e6,
        mults: { def: 1.04 },
        upgType: UpgradeType.Armor,
    },
    [MemberUpgradeNames.FullBodyArmor]: {
        cost: 5e6,
        mults: { def: 1.08 },
        upgType: UpgradeType.Armor,
    },
    [MemberUpgradeNames.LiquidBodyArmor]: {
        cost: 25e6,
        mults: { def: 1.15, agi: 1.15 },
        upgType: UpgradeType.Armor,
    },
    [MemberUpgradeNames.GraphenePlatingArmor]: {
        cost: 40e6,
        mults: { def: 1.2 },
        upgType: UpgradeType.Armor,
    },
    [MemberUpgradeNames.FordFlexV20]: {
        cost: 3e6,
        mults: { agi: 1.04, cha: 1.04 },
        upgType: UpgradeType.Vehicle,
    },
    [MemberUpgradeNames.ATX1070Superbike]: {
        cost: 9e6,
        mults: { agi: 1.08, cha: 1.08 },
        upgType: UpgradeType.Vehicle,
    },
    [MemberUpgradeNames.MercedesBenzS9001]: {
        cost: 18e6,
        mults: { agi: 1.12, cha: 1.12 },
        upgType: UpgradeType.Vehicle,
    },
    [MemberUpgradeNames.WhiteFerrari]: {
        cost: 30e6,
        mults: { agi: 1.16, cha: 1.16 },
        upgType: UpgradeType.Vehicle,
    },
    [MemberUpgradeNames.NUKERootkit]: {
        cost: 5e6,
        mults: { hck: 1.05 },
        upgType: UpgradeType.Rootkit,
    },
    [MemberUpgradeNames.SoulstealerRootkit]: {
        cost: 25e6,
        mults: { hck: 1.1 },
        upgType: UpgradeType.Rootkit,
    },
    [MemberUpgradeNames.DemonRootkit]: {
        cost: 75e6,
        mults: { hck: 1.15 },
        upgType: UpgradeType.Rootkit,
    },
    [MemberUpgradeNames.HmapNode]: {
        cost: 40e6,
        mults: { hck: 1.12 },
        upgType: UpgradeType.Rootkit,
    },
    [MemberUpgradeNames.JackTheRipper]: {
        cost: 75e6,
        mults: { hck: 1.15 },
        upgType: UpgradeType.Rootkit,
    },
    [MemberUpgradeNames.BionicArms]: {
        cost: 10e9,
        mults: { str: 1.3, dex: 1.3 },
        upgType: UpgradeType.Augmentation,
    },
    [MemberUpgradeNames.BionicLegs]: {
        cost: 10e9,
        mults: { agi: 1.6 },
        upgType: UpgradeType.Augmentation,
    },
    [MemberUpgradeNames.BionicSpine]: {
        cost: 15e9,
        mults: { str: 1.15, def: 1.15, dex: 1.15, agi: 1.15 },
        upgType: UpgradeType.Augmentation,
    },
    [MemberUpgradeNames.BrachiBlades]: {
        cost: 20e9,
        mults: { str: 1.4, def: 1.4 },
        upgType: UpgradeType.Augmentation,
    },
    [MemberUpgradeNames.NanofiberWeave]: {
        cost: 12e9,
        mults: { str: 1.2, def: 1.2 },
        upgType: UpgradeType.Augmentation,
    },
    [MemberUpgradeNames.SyntheticHeart]: {
        cost: 25e9,
        mults: { str: 1.5, agi: 1.5 },
        upgType: UpgradeType.Augmentation,
    },
    [MemberUpgradeNames.SynfibrilMuscle]: {
        cost: 15e9,
        mults: { str: 1.3, def: 1.3 },
        upgType: UpgradeType.Augmentation,
    },
    [MemberUpgradeNames.BitWire]: {
        cost: 5e9,
        mults: { hck: 1.05 },
        upgType: UpgradeType.Augmentation,
    },
    [MemberUpgradeNames.Neuralstimulator]: {
        cost: 10e9,
        mults: { hck: 1.15 },
        upgType: UpgradeType.Augmentation,
    },
    [MemberUpgradeNames.DataJack]: {
        cost: 7.5e9,
        mults: { hck: 1.1 },
        upgType: UpgradeType.Augmentation,
    },
    [MemberUpgradeNames.GrapheneBoneLacings]: {
        cost: 50e9,
        mults: { str: 1.7, def: 1.7 },
        upgType: UpgradeType.Augmentation,
    }
}

export function getUpgradesByType(upgradeType: UpgradeType): IMemberUpgrade[] {
    return Object.values(MemberUpdagrades).filter(upgrade => upgrade.upgType === upgradeType);
}

export function getUpgradesByMult(multKey: keyof IMults): IMemberUpgrade[] {
    return Object.values(MemberUpdagrades).filter(
        upgrade => upgrade.mults && upgrade.mults[multKey] !== undefined
    );
}

export function getUpgradesByTypeAndMults(
    upgradeType: UpgradeType,
    multKeys: (keyof IMults)[]
): IMemberUpgrade[] {
    return Object.values(MemberUpdagrades).filter(
        upgrade =>
            upgrade.upgType === upgradeType &&
            multKeys.some(key => upgrade.mults && upgrade.mults[key] !== undefined)
    );
}