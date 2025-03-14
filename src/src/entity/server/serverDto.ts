import { NS } from "@ns";
import {MoneyData, RamData, SecurityData, ServerData} from "./serverInterfaces";

export class ServerDto {
    #ns: NS;
    hostname: string;
    isHome: boolean;
    purchased: boolean;
    ram: RamData;
    security: SecurityData;
    money: MoneyData;

    constructor(ns: NS, data: ServerData) {
        this.#ns = ns;
        this.hostname = data.hostname;
        this.isHome = data.isHome;
        this.purchased = data.purchased;
        this.ram = data.ram;
        this.security = data.security;
        this.money = data.money;

        this.refresh();
    }

    refresh(): void {
        this.security.access = this.#ns.hasRootAccess(this.hostname);
        this.security.level = this.#ns.getServerSecurityLevel(this.hostname);
        this.money.available = this.#ns.getServerMoneyAvailable(this.hostname);
        this.ram.used = this.#ns.getServerUsedRam(this.hostname);
        this.ram.max = this.#ns.getServerMaxRam(this.hostname);
        this.ram.free = this.ram.max - this.ram.used;
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
        this.#ns.tprint(JSON.stringify(this, null, 2));
    }
}
