import {NS} from "@ns";
import {HacknetBroker} from "/lib/component/broker/hacknet/hacknet.broker";
import {parseArgs} from "/lib/component/broker/hacknet/hacknet.args";

export async function main(ns: NS, args = parseArgs(ns.args)) {
    ns.disableLog("ALL");

    const broker = new HacknetBroker(ns);

    try {
        do {
            await broker.actOnBestDeal();
            await ns.sleep(100);
        } while (args.loop);
    } catch (e) {
        ns.tprint(`${e}`);
    }
}