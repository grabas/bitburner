import { NS } from "@ns";
import { FileLogger } from "/lib/logger/file.logger";
import { LoggerPrefixes } from "/lib/enum/logger-prefixes.enum";
import {ServerRepository} from "/lib/repository/server.repository";
import {parseActionArgs} from "/lib/component/batch/batch.args";
import {BatchLog} from "/lib/component/batch/batch.interface";

export async function main(ns: NS, args = parseActionArgs(ns.args)): Promise<void> {
    const scriptStart = Date.now();

    await ns.sleep(args.sleepTime);

    const serverSecurity = ns.getServerSecurityLevel(args.target) - args.minSecLevel;
    if (args.waitFlag && serverSecurity) {
        while (ns.getServerSecurityLevel(args.target) !== args.minSecLevel) {
            await ns.sleep(1);
        }
    }

    const operationsStart = Date.now();
    await ns.hack(args.target);
    const duration = Date.now() - operationsStart;


    const targetServer = await (new ServerRepository(ns)).getById(args.target);
    const log: BatchLog = {
        id: args.id,
        operation: "hack",
        batchId: args.batchId,
        security: targetServer.security,
        money: targetServer.money,
        sleepTime: args.sleepTime,
        serverSecurity,
        expectedDuration: args.expectedDuration,
        actualDuration: duration,
        totalDuration: Date.now() - scriptStart,
        expectedTotalDuration: args.expectedDuration + args.sleepTime,
        scriptStart,
        threads: args.threads,
    };

    const portHandle = ns.getPortHandle(args.debugPortNumber as number)
    portHandle.write(JSON.stringify(log));

    (new FileLogger(ns))
        .log(LoggerPrefixes.BATCHATTACK + args.operationId, "," + JSON.stringify(log, null, 2));
}