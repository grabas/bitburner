import {NS} from "@ns";
import {TapewormManager} from "/lib/component/tapeworm-attack/tapeworm.manager";

export async function main(ns: NS): Promise<void> {
    await (new TapewormManager(ns)).execute();
}
