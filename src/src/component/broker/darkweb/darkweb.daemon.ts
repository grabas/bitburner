import {NS} from "@ns";
import {DarkwebBroker} from "/src/component/broker/darkweb/darkweb.broker";
import {parseArgs} from "/src/component/broker/darkweb/darkweb.args";

export async function main(ns: NS, args = parseArgs(ns.args)): Promise<void> {
    try {
        ns.disableLog("ALL");

        const broker = new DarkwebBroker(ns);
        await broker.purchasePrograms(args.noUtility, args.noFormulas);
    } catch (e) {
        ns.print(`Error: ${e}`);
    }
}