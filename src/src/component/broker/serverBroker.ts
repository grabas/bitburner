import { Broker } from "/src/component/broker/broker.js"
import {NS} from "@ns";

export const SERVER_PREFIX = "pserv-";
export const SERVER_LIMIT = 25;

export const DEFAULT_RAM = 8;
export const MAX_RAM = 1048576;

export async function main(ns: NS) {
    ns.disableLog("ALL");
    await (new ServerBroker(ns)).start();
}

export class ServerBroker extends Broker {
    private purchaseRam: number;

    constructor(ns: NS) {
        super(ns);
        this.purchaseRam = DEFAULT_RAM;
    }

    private shutdownServer = (server: string) => {
        try {
            this.ns.killall(server);
            this.ns.deleteServer(server);
        } catch (error) { }
    }

    private getServerRam = (server: string) => {
        try {
            return this.ns.getServerMaxRam(server);
        } catch (error) { return null }
    }

    private purchaseServer = async (server: string) => {
        const cost = this.ns.getPurchasedServerCost(this.purchaseRam);

        await this.secureFunds(cost);

        this.shutdownServer(server);
        this.ns.purchaseServer(server, this.purchaseRam);
    }

    private autoUpgrade = async () => {
        let i = 0;
        while (i < SERVER_LIMIT) {
            const server = SERVER_PREFIX + i++;
            const serverRam = this.getServerRam(server);

            if (serverRam === null || serverRam < this.purchaseRam) {
                await this.purchaseServer(server);
            }
        }
    }

    start = async () => {
        while (this.purchaseRam <= MAX_RAM) {
            await this.autoUpgrade();
            this.purchaseRam *= 2;
        }
    }
}
