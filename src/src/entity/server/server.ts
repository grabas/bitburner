import { NS } from "@ns";
import {MoneyData, RamData, SecurityData} from "./serverInterfaces";

const RAM_RESERVE = 16;
const HACKNET_PREFIX = "hacknet-server-";
const PURCHASED_PREFIX = "pserv-";

export class Server {
    hostname: string;
    isHome: boolean;
    purchased: boolean;
    ram: RamData;
    security: SecurityData;
    money: MoneyData;

    constructor(ns: NS, host: string) {
        this.hostname = host;
        this.isHome = host === "home";
        this.purchased = host.includes(HACKNET_PREFIX) || host.includes(PURCHASED_PREFIX);

        const maxRam = ns.getServerMaxRam(host);

        this.ram = {
            level: Math.log2(maxRam),
            max: this.isHome ? maxRam - RAM_RESERVE : maxRam,
            used: ns.getServerUsedRam(host),
            free: 0
        };

        this.ram.free = this.ram.max - this.ram.used;

        this.security = {
            access: ns.hasRootAccess(host),
            portsRequired: ns.getServerNumPortsRequired(host),
            level: ns.getServerSecurityLevel(host),
            min: ns.getServerMinSecurityLevel(host),
            levelRequired: ns.getServerRequiredHackingLevel(host)
        };

        this.money = {
            available: ns.getServerMoneyAvailable(host),
            max: ns.getServerMaxMoney(host),
            growth: ns.getServerGrowth(host)
        };
    }
}
