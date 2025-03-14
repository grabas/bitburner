import {NS} from "@ns";
import {Manager} from "/src/component/batch/manager";

export async function main(ns: NS): Promise<void> {
    await batchAttack(ns, ns.args[0]?.toString() || null);
}

export async function batchAttack(ns: NS, target: string|null): Promise<void> {
    ns.ui.openTail();
    const manager = new Manager(ns);
    await manager.batchAttack(target);
}

export function autocomplete(data: any): string[] {
    return [...data.servers];
}
