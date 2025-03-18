import { NS } from "@ns";
import { ServerRepository } from "/src/repository/server.repository";
import { ScriptsEnum } from "/src/enum/scripts.enum";
import {HackingFormulas} from "/src/component/batch/hacking-formulas";
import {uuidv4} from "/src/utils/uuidv4";


export async function prepare(ns: NS, targetHostname: string): Promise<boolean> {
    const repository = new ServerRepository(ns);
    const host = await repository.getById("home");
    const target = await repository.getById(targetHostname);

    const hackingFormulas = new HackingFormulas(ns);
    const growThreads = hackingFormulas.getGrowThreads(target, host, target.getMoneyAvailable());
    const weakenTime = hackingFormulas.getWeakenTime(target);

    let action = [];
    if (growThreads === 0) {
        action = [{
            script: ScriptsEnum.WEAKEN_BATCH,
            sleepTime: hackingFormulas.getWeakenSleepTime(),
            threads: hackingFormulas.getWeakenThreads(target, host) * 2,
            duration: weakenTime
        }]
    } else {
        action = [{
            script: ScriptsEnum.GROW_BATCH,
            sleepTime: hackingFormulas.getGrowSleepTime(target),
            threads: growThreads,
            duration: hackingFormulas.getGrowTime(target)
        }, {
            script: ScriptsEnum.WEAKEN_BATCH,
            sleepTime: hackingFormulas.getWeakenSleepTime(),
            threads: hackingFormulas.getWeakenThreads(target, host) * 2,
            duration: weakenTime
        }, {
            script: ScriptsEnum.WEAKEN_BATCH,
            sleepTime: hackingFormulas.getWeakenSleepTime(2),
            threads: hackingFormulas.getWeakenThreads(
                target,
                host,
                hackingFormulas.getGrowSecurity(growThreads)
            ) * 2,
            duration: weakenTime
        }]
    }

    let part = 0;
    const operationId = uuidv4();
    action.forEach((action) => {
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
