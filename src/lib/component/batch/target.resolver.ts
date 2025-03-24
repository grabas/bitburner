import { NS } from "@ns";
import { Batch } from "./batch";
import { ServerRepository } from "/lib/repository/server.repository";
import { ServerDto } from "/lib/entity/server/server.dto";
import {HackingFormulas} from "/lib/component/batch/batch.formulas";
import {PrepareBatch} from "/lib/component/batch/prepare-batch";

interface BatchStats {
    target: string;
    income: number;
    ram: number;
    duration: number;
    prepDuration: number;
}

const getPossibleActions = async (ns: NS, monitor = false): Promise<BatchStats[]> => {
    const serverRepository = new ServerRepository(ns);
    const host = await serverRepository.getById("home");
    const candidates = await serverRepository.getMonetaryServers();
    const formulas = new HackingFormulas(ns);

    return candidates
        .map((target: ServerDto) => new Batch(ns, target, host, monitor))
        .filter((batch: Batch) => batch.hackChance === 1 && batch.target.security.access)
        .map((batch: Batch) => ({
            target: batch.target.hostname,
            income: formulas.getBatchIncomePerSecond(batch.target, host, batch.targetAmountMultiplier, true),
            ram: batch.ramCost * HackingFormulas.getWaveSize(host, batch.ramCost, batch.duration, true) / host.refresh().ram.max * 100,
            duration: batch.duration,
            prepDuration: new PrepareBatch(ns, batch.target, batch.host).duration
        })).sortBy("income");
}

export const getBestTarget = async (ns: NS, monitor = false): Promise<string> => {
    const candidates = await getPossibleActions(ns, monitor);
    return candidates[0].target ?? "n00dles";
}

export async function main(ns: NS): Promise<void> {
    const serverRepository = new ServerRepository(ns);

    if (ns.args.length) {
        const host = await serverRepository.getById("home");
        const target = await serverRepository.getById(ns.args[0] as string);

        ns.tprint(JSON.stringify(new Batch(ns, target, host), null, 2));
        return;
    }

    const possibleActions = (await getPossibleActions(ns))
        .map((action: BatchStats) => {
            return {
                target: action.target,
                income: ns.formatNumber(action.income) + "/s",
                duration: ns.tFormat(action.duration),
                prepDuration: ns.tFormat(action.prepDuration),
                ram: ns.formatNumber(action.ram) + "%"
            }
        }
    );

    ns.tprint(JSON.stringify(possibleActions, null, 2));
}

export function autocomplete(data: any): string[] {
    return [...data.servers];
}
