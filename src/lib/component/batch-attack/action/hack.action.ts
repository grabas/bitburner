import { NS } from "@ns";
import {parseActionArgs} from "/lib/component/batch-attack/batch.args";

export async function main(ns: NS, args = parseActionArgs(ns.args)): Promise<void> {
    if (args.waitFlag) {
        while (ns.getServerSecurityLevel(args.target) !== args.minSecLevel) {
            await ns.sleep(1);
        }
    }

    await ns.hack(args.target, { additionalMsec: args.sleepTime });
}