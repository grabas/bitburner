import {NS} from "@ns";
import {solve} from "/src/component/contract/solver.service";

export async function main(ns: NS) {
    await solve(ns, ns.args[0] === "-l");
}