import {NS} from "@ns";
import {parseActionArgs} from "/lib/component/tapeworm-attack/tapeworm.args";

export async function main(ns: NS, args = parseActionArgs(ns.args)): Promise<void> {
    while (true) {
        await ns.sleep(args.sleepTime);
        await ns.hack(args.target);
    }
}