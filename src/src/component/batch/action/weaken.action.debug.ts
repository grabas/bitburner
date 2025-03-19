import { NS } from "@ns";
import { FileLogger } from "/src/logger/file.logger";
import { LoggerPrefixes } from "/src/enum/logger-prefixes.enum";
import {ActionArgs, ActionLog} from "/src/component/batch/action/action.type";
import {ServerRepository} from "/src/repository/server.repository";

export async function main(ns: NS): Promise<void> {
    const scriptStart = Date.now();
    const [
        id,
        target,
        sleepTime,
        minSecLevel,
        expectedDuration,
        operationId,
        batchId,
        waitFlag
    ] = ns.args as ActionArgs;

    await ns.sleep(sleepTime);

    const serverSecurity = ns.getServerSecurityLevel(target) - minSecLevel;
    const operationsStart = Date.now();
    await ns.weaken(target);
    const duration = Date.now() - operationsStart;

    const targetServer = await (new ServerRepository(ns)).getById(target);
    const log: ActionLog = {
        id,
        operation: "weaken",
        batchId,
        target: targetServer,
        sleepTime,
        serverSecurity,
        expectedDuration,
        actualDuration: duration,
        totalDuration: Date.now() - scriptStart,
        scriptStart,
    };

    (new FileLogger(ns))
        .log(LoggerPrefixes.BATCHATTACK + operationId, "," + JSON.stringify(log, null, 2));
}