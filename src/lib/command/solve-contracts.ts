import {NS} from "@ns";
import {parseArgs} from "/lib/component/contract/solver.args";

export async function main(ns: NS, args = parseArgs(ns.args)) {
    if (args.safe) {
        ns.run("/src/component/contract/solver.test.js", 1, ...ns.args, "--run"); return;
    }

    ns.run("/src/component/contract/solver.daemon.js", 1, ...ns.args);
}