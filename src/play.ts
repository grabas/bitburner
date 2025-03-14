
import {NS} from "@ns";
import {HacknetBroker} from "/src/component/broker/hacknetBroker";

export async function main(ns: NS): Promise<void> {
    await (new HacknetBroker(ns)).test();
}