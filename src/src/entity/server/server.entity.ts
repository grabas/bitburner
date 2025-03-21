import { Server } from "@ns";
import {MoneyData, RamData, SecurityData} from "./server.interfaces";
import {setNumberOfCores} from "/src/utils/home-cores";

export class ServerEntity {
    hostname: string;
    isHome: boolean;
    purchased: boolean;
    ram: RamData;
    security: SecurityData;
    money: MoneyData;
    cores: number;

    constructor(server: Server) {
        this.hostname = server.hostname;
        this.isHome = server.hostname === "home";
        this.purchased = server.purchasedByPlayer;
        this.cores = server.cpuCores;

        this.ram = {
            level: Math.log2(server.maxRam),
            max: server.maxRam,
            realMax: server.maxRam,
            used: server.ramUsed,
            free: 0
        };

        this.ram.free = this.ram.max - this.ram.used;

        this.security = {
            access: server.hasAdminRights,
            portsRequired: server.numOpenPortsRequired ?? 0,
            level: server.hackDifficulty ?? 1,
            min: server.minDifficulty ?? 1,
            levelRequired: server.requiredHackingSkill ?? 1
        };

        this.money = {
            available: server.moneyAvailable ?? 0,
            max: server.moneyMax ?? 0,
            growth: server.serverGrowth ?? 0
        };

        setNumberOfCores(this.cores);
    }
}
