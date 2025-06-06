import {CodingContractObject, NS} from "@ns";
import {Crawler} from "/lib/utils/crawler";
import {getSolver} from "/lib/component/contract/solver.registry";
import {toString} from "/lib/utils/helpers/serialize-to-string";

export async function solve(ns: NS, safe = true, verbose = true): Promise<void> {
    ns.disableLog("ALL");
    getContracts(ns).forEach((contract: CodingContractObject) => solveContract(ns, contract, safe, verbose));
}

const getContracts = (ns: NS): CodingContractObject[] => {
    return (new Crawler(ns)).getNetwork()
        .map(server => {
            return ns.ls(server)
                .filter(file => file.endsWith(".cct"))
                .map(file => ns.codingcontract.getContract(file, server))
            }
        ).flat();
}

export const solveContract = (ns: NS, contract: CodingContractObject, safe = true, verbose = true): boolean => {
    const solver = getSolver(contract.type);
    if (!solver) return false;

    if (safe && contract.numTriesRemaining() <= 2) {
        if (verbose) {
            ns.print(`Skipping contract ${contract.type} with ${contract.numTriesRemaining()} tries remaining`);
        }
        return false;
    }

    const result: string = contract.submit(toString(solver.solve(contract.data)));
    const success = result.length > 0;
    const message = success? result : `Failed to solve contract ${contract.type}`

    if (verbose) {
        ns.print(message);
        ns.toast(message, success ? "success" : "error");
    }

    return success;
}