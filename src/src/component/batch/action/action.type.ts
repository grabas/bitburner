import {ServerDto} from "/src/entity/server/server.dto";

export type ActionArgs = [
    id: number,
    target: string,
    sleepTime: number,
    minSecLevel: number,
    expectedDuration: number,
    operationId: string,
    batchId: number,
    waitFlag: number
];

export type ActionLog = {
    id: number;
    operation: string;
    batchId: number;
    target: ServerDto;
    sleepTime: number;
    serverSecurity: number;
    expectedDuration: number;
    actualDuration: number;
    totalDuration: number;
    scriptStart: number;
};