import {NS} from "@ns";
import {HomeUpgradeBroker} from "/src/component/broker/home-upgrade/home-upgrade.broker";
import {ServerRepository} from "/src/repository/server.repository";

export async function main(ns: NS) {
    ns.disableLog("ALL");
    const broker = new HomeUpgradeBroker(ns);
    const home = await (new ServerRepository(ns)).getById(ns.getHostname());

    while (true) {
        await broker.upgradeHome(home);
    }
}