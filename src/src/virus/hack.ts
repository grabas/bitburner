import {NS} from "@ns";

export async function main(ns: NS): Promise<void> {
    const target: string = ns.args[0].toString();
    const securityThreshold: number = parseInt(ns.args[1].toString()) + 5;
    const moneyThreshold: number = parseInt(ns.args[2].toString()) * 0.9;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (ns.getServerSecurityLevel(target) > securityThreshold || ns.getServerMoneyAvailable(target) < moneyThreshold) {
            await ns.sleep(10);
        } else {
            await ns.hack(target, {stock: true});
        }
    }
}