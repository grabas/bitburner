import {NS} from "@ns";
import {DarkwebBroker} from "/src/component/broker/darkweb/darkweb.broker";

export async function main(ns: NS) {
    ns.disableLog("ALL");
    const broker = new DarkwebBroker(ns);
    await broker.purchasePrograms();
}