import {NS} from "@ns";
import { main as buildDatabase } from '/src/command/buildServerDatabase';
import { main as gainAccess } from '/src/command/gainAccess';

export async function main(ns: NS): Promise<void> {
    await buildDatabase(ns).then(() => gainAccess(ns));

    ns.tprint("Running contract solver");
    ns.run('/src/command/solveContracts.js', 1, "-l");

    ns.run("/src/command/batchAttack.js", 1, "n00dles")
}