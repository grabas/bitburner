import {NS} from "@ns";
import {Crawler} from "/src/utils/crawler";
import {getSolver} from "/src/contract/solver";

export async function main(ns: NS) {
    ns.disableLog("ALL");
    ns.ui.openTail()
    const loop = ns.args[0] === "-l";
    const servers = (new Crawler(ns)).getNetwork()


    do {
        servers
            .forEach(server => {
                ns.ls(server)
                    .filter(file => file.endsWith(".cct"))
                    .forEach(file => solveContract(ns, file, server))
            })

        await ns.sleep(500);
    } while (loop);
}

const solveContract = (ns: NS, file: string, server: string): void => {
    const type = ns.codingcontract.getContractType(file, server);
    const solver = getSolver(type);

    if (!solver) {
        ns.tprint(`No solver found for ${type} @ ${server}`); return;
    }

    const data = ns.codingcontract.getData(file, server);
    const solution = solver.solve(data);

    attempt(ns, file, solution, server, type);
}

const attempt = (ns: NS, file: string, solution: any, server: string, type: string): void => {
    const result = ns.codingcontract.attempt(solution, file, server);

    if (result && result.length > 0) {
        ns.print(result);
        ns.toast(result, "success");
    } else {
        ns.print(`Failed to solve ${type} @ ${server}`);
        ns.toast(`Failed to solve ${type} @ ${server}`, "error");
    }
}