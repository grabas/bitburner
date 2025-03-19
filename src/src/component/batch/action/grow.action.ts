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

    if (waitFlag) {
        while (ns.getServerSecurityLevel(target) !== minSecLevel) {
            await ns.sleep(1);
        }
    }

    await ns.grow(target);
}