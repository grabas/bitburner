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

    let growThreads = hackingFormulas.getGrowThreads(target, host, target.getMoneyAvailable());

    if (growThreads * ScriptsEnum.GROW_BATCH.size > host.getRamAvailable()) {
        growThreads = Math.floor(host.getRamAvailable() / ScriptsEnum.GROW_BATCH.size * 0.5);
    }

    const weakenTime = hackingFormulas.getWeakenTime(target);

    let action = [];
    if (target.getMoneyAvailable() === target.money.max) {
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
            threads: hackingFormulas.getWeakenThreads(target, host),
            duration: weakenTime
        }, {
            script: ScriptsEnum.WEAKEN_BATCH,
            sleepTime: hackingFormulas.getWeakenSleepTime(2),
            threads: hackingFormulas.getWeakenThreads(
                target,
                host,
                hackingFormulas.getGrowSecurity(growThreads)
            ),
            duration: weakenTime
        }]
    }

    let part = 0;
    const operationId = uuidv4();

    const pids: number[] = []
    action.forEach((action) => {
        const pid = ns.run(
            action.script.path,
            action.threads,
            part++,
            target.hostname,
            action.sleepTime,
            target.security.min,
            action.duration ?? 0,
            operationId,
            0
        );

        pids.push(pid);
    });


    while (!target.isPrepared()) {
        const allScriptsFinished = pids.map((pid) => ns.isRunning(pid)).every((isRunning) => !isRunning);

        if (allScriptsFinished) {
            await main(ns);
        }

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
