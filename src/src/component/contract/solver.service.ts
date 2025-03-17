import {CodingContractObject, NS} from "@ns";
import {Crawler} from "/src/utils/crawler";
import {getSolver} from "/src/component/contract/solver.registry";
import {CodingContractName} from "/src/enum/contract-names.enum";

export async function solve(ns: NS, loop = false) {
    ns.ui.openTail()
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

export const solveContract = (ns: NS, contract: CodingContractObject): void => {
    const solver = getSolver(contract.type);
    if (!solver) return;

    const result: string = contract.submit((solver.solve(contract.data)).toString());
    const message = result.length ? result : `Failed to solve contract ${contract.type}`

    ns.print(message);
    ns.toast(message, result.length ? "success" : "error");
}
