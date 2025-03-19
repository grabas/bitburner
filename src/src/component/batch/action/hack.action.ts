import { NS } from "@ns";
import {ActionArgs} from "/src/component/batch/action/action.type";

export async function main(ns: NS): Promise<void> {
    const [
        id,
        target,
        sleepTime,
        minSecLevel,
        expectedDuration,
        operationId,
        batchId,
        waitFlag
    ] = ns.args as ActionArgs;

    await ns.sleep(sleepTime);

    if (waitFlag) {
        while (ns.getServerSecurityLevel(target) !== minSecLevel) {
            await ns.sleep(1);
        }
    }

    await ns.hack(target);
}