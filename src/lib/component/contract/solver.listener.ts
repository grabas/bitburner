import {NS} from "@ns";
import {ContractSolution} from "/lib/component/contract/solver.interface";
import {Ports} from "/lib/enum/ports.enum";
import {setColor} from "/lib/utils/helpers/set-color";
import {Colors} from "/lib/enum/colors.enum";

export async function main(ns: NS): Promise<void> {
    ns.disableLog("ALL");
    const portHandler = ns.getPortHandle(Ports.SOLVER_PORT);

    while (true) {
        const portMessage = portHandler.read();

        if (portMessage !== "NULL PORT DATA") {
            const {type, file, server, solution} = JSON.parse(portMessage) as ContractSolution;

            if (!ns.fileExists(file, server)) continue;

            ns.print(setColor(`Solving ${type}...`, Colors.ORANGE));

            const result = ns.codingcontract.attempt(solution, file, server);
            const success = result.length > 0;
            const message = success? result : `Failed to solve contract ${type}`

            ns.print(setColor(message, Colors.GREEN));
            ns.toast(message, success ? "success" : "error");
        }

        await ns.sleep(200);
    }
}