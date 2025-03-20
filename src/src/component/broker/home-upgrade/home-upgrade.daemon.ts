import {NS} from "@ns";
import {HomeUpgradeBroker} from "/src/component/broker/home-upgrade/home-upgrade.broker";
import {ServerRepository} from "/src/repository/server.repository";
import {parseArgs} from "/src/component/broker/home-upgrade/home-upgrade.args";

export async function main(ns: NS, args = parseArgs(ns.args)): Promise<void> {
    ns.disableLog("ALL");
    try {
        const broker = new HomeUpgradeBroker(ns);
        const home = await (new ServerRepository(ns)).getById(ns.getHostname());

        do {
            await broker.upgradeHome(home);
        } while (args.loop);
    } catch (e) {
        ns.tprint(`Error: ${e}`);
    }
}