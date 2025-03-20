import {NS} from "@ns";
import {solve} from "/src/component/contract/solver.service";
import {parseArgs} from "/src/component/contract/solver.args";

export async function main(ns: NS, args = parseArgs(ns.args)) {
    ns.disableLog("ALL");

    do {
        await solve(ns, args.safe);
        await ns.sleep(500);
    } while (args.loop);
}