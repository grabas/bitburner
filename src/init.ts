import { NS } from "@ns";
import { main as buildDatabase } from '/src/command/build-server-database';
import { setBitnode } from "/src/repository/bitnode.repository";

export async function main(ns: NS): Promise<void> {
    ns.run('/src/command/solve-contracts.js', 1, "--loop", "--safe");

    await setBitnode();
    await buildDatabase(ns);
    ns.run("/src/command/gain-access.js", 1);

    ns.run("/src/component/broker/darkweb/darkweb.daemon.js", 1);
    ns.run("/src/component/broker/hacknet/hacknet.daemon.js", 1, "--loop");

    ns.run("/src/component/batch/batch.daemon.js", 1);
}