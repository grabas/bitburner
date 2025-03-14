import {NS} from "@ns";

export async function main(ns: NS): Promise<void> {
    const target = ns.args[0] as string;
    const securityThreshold = ns.args[1] as number + 5;

    while (ns.getServerSecurityLevel(target) < securityThreshold) {
        await ns.weaken(target);
    }
}