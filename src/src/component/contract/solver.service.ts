import {CodingContractObject, NS} from "@ns";
import {Crawler} from "/src/utils/crawler";
import {getSolver} from "/src/component/contract/solver.registry";

export async function solve(ns: NS, loop = false) {
    ns.disableLog("ALL");

    do {
        getContracts(ns).forEach((contract: CodingContractObject) => solveContract(ns, contract));
        await ns.sleep(500);
    } while (loop);
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

    const result: string = contract.submit(serialize(solver.solve(contract.data)));
    const success = result.length > 0;
    const message = success? result : `Failed to solve contract ${contract.type}`

    if (verbose) {
        ns.print(message);
        ns.toast(message, success ? "success" : "error");
    }

    return success;
}

const serialize = (data: any): string => {
    const type = typeof data;
    if (type === "string") return data;
    if (type === "number" || type === "bigint" || type === "boolean") return data.toString();
    return JSON.stringify(data);
}