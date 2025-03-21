import { NS } from "@ns";
import {parseActionArgs} from "/lib/component/batch/batch.args";
import {BatchMonitorLog} from "/lib/component/batch/batch.interface";

export async function main(ns: NS, args = parseActionArgs(ns.args)): Promise<void> {
    await ns.sleep(args.sleepTime);

    const serverSecurity = ns.getServerSecurityLevel(args.target) - args.minSecLevel;
    if (serverSecurity) {
        while (ns.getServerSecurityLevel(args.target) !== args.minSecLevel) {
            await ns.sleep(1);
        }
    }

    const operationsStart = Date.now();
    await ns.hack(args.target);
    const duration = Date.now() - operationsStart

    const log: BatchMonitorLog = {
        id: args.id,
        operation: "hack",
        securityMin: args.minSecLevel,
        securityLevel: ns.getServerSecurityLevel(args.target),
        moneyMax: args.moneyMax,
        moneyAvailable: ns.getServerMoneyAvailable(args.target),
        expectedDuration: args.expectedDuration,
        actualDuration: duration
    }

    const monitorPortHandle = ns.getPortHandle(args.monitorPortNumber as number)
    monitorPortHandle.write(JSON.stringify(log));
}