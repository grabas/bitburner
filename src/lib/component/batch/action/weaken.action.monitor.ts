import { NS } from "@ns";
import {parseActionArgs} from "/lib/component/batch/batch.args";
import { BatchMonitorLog } from "/lib/component/batch/batch.interface";

export async function main(ns: NS, args = parseActionArgs(ns.args)): Promise<void> {
    const operationsStart = Date.now();
    await ns.weaken(args.target, {additionalMsec: args.sleepTime});
    const duration = Date.now() - operationsStart

    const log: BatchMonitorLog = {
        id: args.id,
        operation: "weaken",
        securityMin: args.minSecLevel,
        securityLevel: ns.getServerSecurityLevel(args.target),
        moneyMax: args.moneyMax,
        moneyAvailable: ns.getServerMoneyAvailable(args.target),
        expectedDuration: args.expectedDuration + args.sleepTime,
        actualDuration: duration
    }

    const monitorPortHandle = ns.getPortHandle(args.monitorPortNumber as number)
    monitorPortHandle.write(JSON.stringify(log));
}