import {NS} from "@ns";

export async function main(ns: NS): Promise<void> {
    const target = ns.args[0] as string
    const securityThreshold = ns.args[1] as number + 5;
    const moneyThreshold = ns.args[2] as number * 0.9;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (ns.getServerSecurityLevel(target) > securityThreshold || ns.getServerMoneyAvailable(target) < moneyThreshold) {
            await ns.sleep(10);
        } else {
            await ns.hack(target, {stock: true});
        }
    }
}