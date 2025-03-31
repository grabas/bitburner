export enum UniversityClassType {
    computerScience = "Computer Science",
    dataStructures = "Data Structures",
    networks = "Networks",
    algorithms = "Algorithms",
    management = "Management",
    leadership = "Leadership",
}

export enum GymType {
    strength = "str",
    defense = "def",
    dexterity = "dex",
    agility = "agi",
}

export type ClassType = UniversityClassType | GymType;

export interface WorkStats {
    money: number;
    reputation: number;
    hackExp: number;
    strExp: number;
    defExp: number;
    dexExp: number;
    agiExp: number;
    chaExp: number;
    intExp: number;
}

export const newWorkStats = (params?: Partial<WorkStats>): WorkStats => {
    return {
        money: params?.money ?? 0,
        reputation: params?.reputation ?? 0,
        hackExp: params?.hackExp ?? 0,
        strExp: params?.strExp ?? 0,
        defExp: params?.defExp ?? 0,
        dexExp: params?.dexExp ?? 0,
        agiExp: params?.agiExp ?? 0,
        chaExp: params?.chaExp ?? 0,
        intExp: params?.intExp ?? 0,
    };
};

export interface Class {
    type: ClassType;
    earnings: WorkStats;
}

export const Classes: Record<ClassType, Class> = {
    [UniversityClassType.computerScience]: {
        type: UniversityClassType.computerScience,
        earnings: newWorkStats({ hackExp: 0.5, intExp: 0.01 }),
    },
    [UniversityClassType.dataStructures]: {
        type: UniversityClassType.dataStructures,
        earnings: newWorkStats({ money: -40, hackExp: 1, intExp: 0.01 }),
    },
    [UniversityClassType.networks]: {
        type: UniversityClassType.networks,
        earnings: newWorkStats({ money: -80, hackExp: 2, intExp: 0.01 }),
    },
    [UniversityClassType.algorithms]: {
        type: UniversityClassType.algorithms,
        earnings: newWorkStats({ money: -320, hackExp: 4, intExp: 0.01 }),
    },
    [UniversityClassType.management]: {
        type: UniversityClassType.management,
        earnings: newWorkStats({ money: -160, chaExp: 2, intExp: 0.01 }),
    },
    [UniversityClassType.leadership]: {
        type: UniversityClassType.leadership,
        earnings: newWorkStats({ money: -320, chaExp: 4, intExp: 0.01 }),
    },
    [GymType.strength]: {
        type: GymType.strength,
        earnings: newWorkStats({ money: -120, strExp: 1 }),
    },
    [GymType.defense]: {
        type: GymType.defense,
        earnings: newWorkStats({ money: -120, defExp: 1 }),
    },
    [GymType.dexterity]: {
        type: GymType.dexterity,
        earnings: newWorkStats({ money: -120, dexExp: 1 }),
    },
    [GymType.agility]: {
        type: GymType.agility,
        earnings: newWorkStats({ money: -120, agiExp: 1 }),
    },
};