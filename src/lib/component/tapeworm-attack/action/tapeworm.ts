import {NS, } from "@ns";
import {parseArgs} from "/lib/component/tapeworm-attack/tapeworm.args";

export async function main(ns: NS, args = parseArgs(ns.args)): Promise<void> {
    try {
        const target = args.target
        const securityThreshold = args.minSecurityLevel + 3;
        const moneyThreshold = args.maxMoney * 0.9;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (ns.getServerSecurityLevel(target) > securityThreshold) {
                await ns.weaken(target);
            } else if (ns.getServerMoneyAvailable(target) < moneyThreshold) {
                await ns.grow(target);
            } else {
                await ns.hack(target);
            }
        }
    } catch (error) {
        ns.print(error instanceof Error ? error.message : error);
    }
}