import {NS} from "@ns";
import {BatchManager} from "/lib/component/batch-attack/batch.manager";
import {parseArgs} from "/lib/component/batch-attack/batch.args";

export async function main(ns: NS, args = parseArgs(ns)): Promise<void> {
    await batchAttack(ns, args.target, args.switchTarget, args.monitor);
}

export function autocomplete(data: any): string[] {
    return [...data.servers];
}

export async function batchAttack(ns: NS, target: string|null|undefined, switchTarget = false, debug = false): Promise<void> {
    ns.disableLog("ALL");

    ns.ui.openTail();
    ns.ui.resizeTail(360, 300);
    ns.ui.moveTail(debug ? 640 : 1160, 20);

    const manager = new BatchManager(ns);
    await manager.batchAttack(target, switchTarget, debug);
}
