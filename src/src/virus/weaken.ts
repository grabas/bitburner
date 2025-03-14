import {NS} from "@ns";

export async function main(ns: NS): Promise<void> {
    const target: string = ns.args[0].toString();
    const securityThreshold: number = parseInt(ns.args[1].toString()) + 5;

    while (ns.getServerSecurityLevel(target) < securityThreshold) {
        await ns.weaken(target);
    }
}