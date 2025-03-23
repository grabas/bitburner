import {NS} from "@ns";
import {HomeUpgradeBroker} from "/lib/component/broker/home-upgrade/home-upgrade.broker";
import {ServerRepository} from "/lib/repository/server.repository";
import {parseArgs} from "/lib/component/broker/home-upgrade/home-upgrade.args";

export async function main(ns: NS, args = parseArgs(ns.args)): Promise<void> {
    ns.disableLog("ALL");
    try {
        const broker = new HomeUpgradeBroker(ns);

        do {
            await broker.upgradeHome();
            await ns.sleep(100)
        } while (args.loop);
    } catch (e) {
        ns.tprint(`Error: ${e}`);
    }
}