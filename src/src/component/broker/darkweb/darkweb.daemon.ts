import {NS} from "@ns";
import {DarkwebBroker} from "/src/component/broker/darkweb/darkweb.broker";

export async function main(ns: NS) {
    try {
        ns.disableLog("ALL");

        const broker = new DarkwebBroker(ns);
        await broker.purchasePrograms();
    } catch (e) {
        ns.print(`Error: ${e}`);
    }
}