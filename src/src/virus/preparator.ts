import {NS} from "@ns";

export async function main(ns: NS): Promise<void> {
    const target = ns.args[0] as string
    const securityThreshold = ns.args[1] as number;
    const moneyThreshold = ns.args[2] as number * 0.9;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (ns.getServerSecurityLevel(target) > (securityThreshold + 5)) {
            await ns.weaken(target);
        } else if (ns.getServerMoneyAvailable(target) < moneyThreshold) {
            await ns.grow(target);
        } else {
            if (ns.getServerSecurityLevel(target) !== securityThreshold) {
                await ns.weaken(target);
            } else { break; }
        }
    }
}