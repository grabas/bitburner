import {BatchScript} from "/lib/enum/scripts.enum";
import {MoneyData, SecurityData} from "/lib/entity/server/server.interfaces";
import {ServerDto} from "/lib/entity/server/server.dto";

export enum BatchType {
    ATTACK = "hack",
    PREPARE = "prep"
}

export interface IBatch {
    type: BatchType
    target: ServerDto;
    host: ServerDto;
    duration: number;
    ramCost: number;
    targetAmount: number;
    action: BatchAction[];
}

export interface BatchAction {
    script: BatchScript;
    sleepTime: number;
    threads: number;
    duration?: number;
}

export type BatchLog = {
    id: number;
    operation: string;
    batchId: number;
    security: SecurityData;
    money: MoneyData;
    sleepTime: number;
    serverSecurity: number;
    expectedDuration: number;
    actualDuration: number;
    totalDuration: number;
    expectedTotalDuration: number;
    scriptStart: number;
    threads: number;
};

export type BatchMonitorLog = {
    id: number;
    operation: string;
    moneyMax: number;
    moneyAvailable: number;
    securityMin: number;
    securityLevel: number;
    expectedDuration: number;
    actualDuration: number;
};