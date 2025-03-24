import {ActionScript} from "/lib/enum/scripts.enum";
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
    script: ActionScript;
    sleepTime: number;
    threads: number;
    duration?: number;
}

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