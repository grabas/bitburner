export interface RamData {
    level: number;
    max: number;
    used: number;
    free: number;
    realMax: number;
}

export interface SecurityData {
    access: boolean;
    portsRequired: number;
    level: number;
    min: number;
    levelRequired: number;
}

export interface MoneyData {
    available: number;
    max: number;
    growth: number;
}

export interface ServerData {
    hostname: string;
    isHome: boolean;
    purchased: boolean;
    cores: number;
    ram: RamData;
    security: SecurityData;
    money: MoneyData;
}
