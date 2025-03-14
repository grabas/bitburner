import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
    const flags = ns.flags([
        ['refreshrate', 200],
        ['help', false],
    ]);

    ns.disableLog("ALL");
    ns.ui.openTail()
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const server: string = flags._[0] as string;
        let money = ns.getServerMoneyAvailable(server);
        if (money === 0) money = 1;
        const maxMoney = ns.getServerMaxMoney(server);
        const minSec = ns.getServerMinSecurityLevel(server);
        const sec = ns.getServerSecurityLevel(server);
        ns.clearLog();
        ns.print(`${server}:`);
        ns.print(` $_______: ${ns.formatNumber(money)} (${(money / maxMoney * 100).toFixed(2)}%)`);
        ns.print(` security: +${(sec - minSec).toFixed(2)}`);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await ns.sleep(flags.refreshrate);
    }
}

export function autocomplete(data: any): string[] {
    return data.servers;
}
