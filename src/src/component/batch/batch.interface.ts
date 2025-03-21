import {BatchScript} from "/src/enum/scripts.enum";
import {MoneyData, SecurityData} from "/src/entity/server/server.interfaces";

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