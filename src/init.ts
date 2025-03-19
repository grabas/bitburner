import { NS } from "@ns";
import { main as buildDatabase } from '/src/command/build-server-database';
import { main as gainAccess } from '/src/command/gain-access';
import { setBitnode } from "/src/repository/bitnode.repository";

export async function main(ns: NS): Promise<void> {
    ns.run('/src/command/solve-contracts.js', 1, "--loop", "--safe");

    await setBitnode();
    await buildDatabase(ns);
    await gainAccess(ns);

    ns.run("/src/component/batch/batch.daemon.js", 1);
}