import {NS} from "@ns";

export async function main(ns: NS): Promise<void> {
    await ns.sleep(parseInt(ns.args[1].toString()));
    await ns.grow(ns.args[0].toString());
}