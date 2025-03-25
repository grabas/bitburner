import {NS} from "@ns";
import {Crawler} from "/lib/utils/crawler";
import {getSolver} from "/lib/component/contract/solver.registry";
import {CodingContractName} from "/lib/component/contract/contract-names.enum";
import {ContractSolution} from "/lib/component/contract/solver.interface";
import {toString} from "/lib/utils/helpers/serialize-to-string";
import {Ports} from "/lib/enum/ports.enum";

export async function main(ns: NS): Promise<void> {
    const portHandler = ns.getPortHandle(Ports.SOLVER_PORT);
    const network = (new Crawler(ns)).getNetwork();
    while (true) {
        const contracts= network
            .map(server => {
                    return ns.ls(server)
                        .filter(file => file.endsWith(".cct"))
                        .map(file => getSolution(ns, file, server))
                }
            ).flat().filter((contract) => contract !== null);

        for (const contract of contracts) {
            portHandler.write(JSON.stringify(contract));
        }

        await ns.sleep(1000);
    }
}

const getSolution = (ns: NS, file: string, server: string): ContractSolution|null => {
    const type = ns.codingcontract.getContractType(file, server) as CodingContractName;

    const solver = getSolver(type);

    if (!solver) return null;

    const data = ns.codingcontract.getData(file, server);
    const solution = toString(solver.solve(data));

    return {
        type,
        file,
        server,
        solution
    };
}