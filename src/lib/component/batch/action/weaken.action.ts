import { NS } from "@ns";
import {parseActionArgs} from "/lib/component/batch/batch.args";

export async function main(ns: NS, args = parseActionArgs(ns.args)): Promise<void> {
    await ns.weaken(args.target, {additionalMsec: args.sleepTime});
}