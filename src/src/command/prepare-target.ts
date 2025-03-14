import { NS } from "@ns";
import { ServerRepository } from "/src/repository/server.repository";
import { ScriptsEnum } from "/src/enum/scripts.enum";

export async function prepare(ns: NS, targetHostname: string): Promise<boolean> {
    const repository = new ServerRepository(ns);
    const home = await repository.getById("home");
    const target = await repository.getById(targetHostname);
    ns.run(
        ScriptsEnum.PREPARATOR.path,
        Math.floor(home.getRamAvailable() / ScriptsEnum.PREPARATOR.size),
        target.hostname,
        target.security.min,
        target.money.max
    );

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
