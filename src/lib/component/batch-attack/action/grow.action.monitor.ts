import { NS } from "@ns";
import {parseActionArgs} from "/lib/component/batch-attack/batch.args";
import {BatchMonitorLog} from "/lib/component/batch-attack/batch.interface";

export async function main(ns: NS, args = parseActionArgs(ns.args)): Promise<void> {
    const operationsStart = Date.now();
    await ns.grow(args.target, {additionalMsec: Math.max(0, args.sleepTime), stock: true});
    const duration = Date.now() - operationsStart;

    const log: BatchMonitorLog = {
        id: args.id,
        operation: "grow",
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