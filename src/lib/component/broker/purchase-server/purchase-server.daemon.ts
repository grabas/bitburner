import {NS} from "@ns";
import {PurchaseServerBroker} from "/lib/component/broker/purchase-server/purchase-server.broker";
import {ServerBrokerConfig as Config} from "/lib/component/broker/purchase-server/purchase-server.config";
import {ServerConstants} from "/lib/enum/server-constants.enum";

export async function main(ns: NS) {
    ns.disableLog("ALL");
    const broker = new PurchaseServerBroker(ns);

    let ram = Config.DEFAULT_RAM as number;
    while (ram <= ServerConstants.PurchasedServerMaxRam) {
        let i = 0
        while (i < ServerConstants.PurchasedServerLimit) {
            await broker.upgradeServer(Config.SERVER_PREFIX + i++, ram);
        }
        ram *= 2;
    }
}