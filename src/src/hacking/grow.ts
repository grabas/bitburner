import {NS} from "@ns";

export async function main(ns: NS): Promise<void> {
    const target = ns.args[0] as string;
    const securityThreshold = ns.args[1] as number + 5;
    const serverMaxMoney = ns.args[2] as number + 5;

    while (ns.getServerMoneyAvailable(target) < serverMaxMoney) {
        ns.getServerSecurityLevel(target) > securityThreshold ? await ns.sleep(10) : await ns.grow(target);
    }
}