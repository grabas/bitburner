import { NS } from "@ns";
import {MoneyData, RamData, SecurityData, ServerData} from "./server.interfaces";
import {ServerConstants} from "/lib/enum/server-constants.enum";
import {getNumberOfCores} from "/lib/utils/home-cores";

export class ServerDto {
    ns: NS;
    hostname: string;
    isHome: boolean;
    purchased: boolean;
    cores: number;
    ram: RamData;
    security: SecurityData;
    money: MoneyData;

    constructor(ns: NS, data: ServerData) {
        this.ns = ns;
        this.hostname = data.hostname;
        this.isHome = data.isHome;
        this.purchased = data.purchased;
        this.cores = data.cores;
        this.ram = data.ram;
        this.security = data.security;
        this.money = data.money;

        this.refresh();
    }

    refresh(): ServerDto {
        this.security.access = this.ns.hasRootAccess(this.hostname);
        this.security.level = this.ns.getServerSecurityLevel(this.hostname);
        this.money.available = this.ns.getServerMoneyAvailable(this.hostname);

        this.ram.used =  this.isHome ?
            Math.max(ServerConstants.HomeComputerRamReselve, this.ns.getServerUsedRam(this.hostname)) :
            this.ns.getServerUsedRam(this.hostname);

        const realMax = this.ns.getServerMaxRam(this.hostname);
        this.ram.max = this.isHome ? realMax - ServerConstants.HomeComputerRamReselve : realMax;
        this.ram.free = realMax - this.ram.used;

        if (this.isHome) {
            this.cores = getNumberOfCores();
        }

        return this;
    }

    getSecurityLevel(): number {
        this.refresh();
        return this.security.level;
    }

    getMoneyAvailable(): number {
        this.refresh();
        return this.money.available;
    }

    getRamAvailable(): number {
        this.refresh();
        return this.ram.free;
    }

    isWeak(): boolean {
        return this.getSecurityLevel() === this.security.min;
    }

    isMaxedOut(): boolean {
        return this.getMoneyAvailable() === this.money.max;
    }

    isPrepared(): boolean {
        return this.isWeak() && this.isMaxedOut();
    }

    print(): void {
        this.ns.tprint(JSON.stringify(this, null, 2));
    }

    serialize(): ServerData {
        return {
            hostname: this.hostname,
            isHome: this.isHome,
            purchased: this.purchased,
            cores: this.cores,
            ram: this.ram,
            security: this.security,
            money: this.money
        };
    }
}
