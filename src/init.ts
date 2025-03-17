import {NS} from "@ns";
import { main as buildDatabase } from '/src/command/build-server-database';
import { main as gainAccess } from '/src/command/gain-access';

export async function main(ns: NS): Promise<void> {
    await buildDatabase(ns).then(() => gainAccess(ns));

    ns.tprint("Running contract solver");
    ns.run('/src/command/solve-contracts.js', 1, "-l");

    ns.run("/src/command/batch-attack.js", 1, "n00dles")
}