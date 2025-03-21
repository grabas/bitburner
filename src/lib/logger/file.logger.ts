import {Config} from "/lib/logger/logger.config";
import {ILogger} from "/lib/logger/logger.interface";
import {NS} from "@ns";

export class FileLogger implements ILogger {
    private readonly ns: NS;
    constructor(ns: NS) {
        this.ns = ns;
    }

    read(file: string): string {
        return this.ns.read(this.getFileLocation(file));
    }

    log(file: string, message: string): void {
        this.ns.write(this.getFileLocation(file), message);
    }

    getFileLocation(file: string): string {
        return Config.DIR + file + Config.EXT;
    }
}