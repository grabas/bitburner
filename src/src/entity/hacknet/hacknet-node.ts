import {NS} from "@ns";

export class HacknetNode {
    index: number;
    name: string;
    level: number;
    ram: number;
    cores: number;
    production: number;
    timeOnline: number;
    totalProduction: number;

    constructor(ns: NS, index: number) {
        if (index > -1) {
            const data = ns.hacknet.getNodeStats(index);

            this.index = index;
            this.name = data.name;
            this.level = data.level;
            this.ram = data.ram;
            this.cores = data.cores;
            this.production = data.production;
            this.timeOnline = data.timeOnline;
            this.totalProduction = data.totalProduction;
        } else {
            this.index = -1;
            this.name = "New Node";
            this.level = 1;
            this.ram = 1;
            this.cores = 1;
            this.production = 0;
            this.timeOnline = 0;
            this.totalProduction = 0;
        }
    }

    public incrementLevel = (): this => {
        this.level++;
        return this;
    }

    public incrementRam = (): this => {
        this.ram++;
        return this;
    }

    public incrementCores = (): this => {
        this.cores++;
        return this;
    }
}