import {NS} from "@ns";
import {solveContract} from "/lib/component/contract/solver.service";
import {parseArgs} from "/lib/component/contract/solver.args";

export async function main(ns: NS, args = parseArgs(ns.args)) {
    let allPassed = true;
    const contractsTypes = ns.codingcontract.getContractTypes();
    for (let i = 0; i < 100; i++) {
        for (const contractType of contractsTypes) {
            const fileName = ns.codingcontract.createDummyContract(contractType);
            const contract = ns.codingcontract.getContract(fileName);

            if (!solveContract(ns, contract, false, false)) {
                ns.toast(`Failed to solve contract ${contractType}`, "error");
                allPassed = false;
                break;
            }
        }
    }

    ns.toast("Test completed", allPassed ? "success" : "error");

    if (allPassed && args.run) {
        ns.run("/lib/component/contract/solver.daemon.js", 1, ...ns.args);
    }

    return allPassed;
}
