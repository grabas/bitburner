import {NS} from "@ns";
import {ServerRepository} from "/src/repository/server.repository";
import {Action} from "/src/component/batch/action";
import {getSave} from "/src/database/save.database";
import {HackingFormulas} from "/src/component/batch/hacking-formulas";
import {HackingFormulasNew} from "/src/component/batch/hacking-formulas.new";

export async function main(ns: NS): Promise<void> {
    const repo = new ServerRepository(ns);

    print(ns, (await repo.getMonetaryServers())[0])
}

const print = (ns: NS, string: any) => ns.tprint(JSON.stringify(string, null, 2));