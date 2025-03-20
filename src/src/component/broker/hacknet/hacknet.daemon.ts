import {NS} from "@ns";
import {HacknetBroker} from "/src/component/broker/hacknet/hacknet.broker";
import {parseArgs} from "/src/component/broker/hacknet/hacknet.args";

export async function main(ns: NS, args = parseArgs(ns.args)) {
    ns.disableLog("ALL");
    const broker = new HacknetBroker(ns);

    do {
        await broker.actOnBestDeal();
        await ns.sleep(100);
    } while (args.loop);
}