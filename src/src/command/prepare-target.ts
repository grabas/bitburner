import { NS } from "@ns";
import { ServerRepository } from "/src/repository/server.repository";
import {uuidv4} from "/src/utils/uuidv4";
import {Action} from "/src/component/batch/action";


export async function prepare(ns: NS, targetHostname: string): Promise<boolean> {
    const repository = new ServerRepository(ns);
    const host = await repository.getById("home");
    const target = await repository.getById(targetHostname);

    const batch = await Action.createPrepareActions(ns, target, host);

    let part = 0;
    const operationId = uuidv4();
    batch.action.forEach((action) => {
        ns.run(
            action.script.path,
            action.threads,
            part++,
            target.hostname,
            action.sleepTime,
            target.security.min,
            action.duration ?? 0,
            operationId
        );
    });


    while (!target.isPrepared()) {
        await ns.sleep(100);
    }

    ns.toast(targetHostname + " is prepared");

    return true;
}

export async function main(ns: NS): Promise<void> {
    await prepare(ns, ns.args[0] as string);
}

export function autocomplete(data: any): string[] {
    return [...data.servers];
}
