import { NS } from "@ns";
import { BatchDto } from "./batch.dto";
import { ServerRepository } from "/lib/repository/server.repository";
import { ServerDto } from "/lib/entity/server/server.dto";
import {PrepareBatchDto} from "/lib/component/batch-attack/prepare-batch.dto";
import {BatchHackingFormulas} from "/lib/component/batch-attack/batch.formulas";

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
    const formulas = new BatchHackingFormulas(ns);

    return candidates
        .map((target: ServerDto) => new BatchDto(ns, target, host, monitor))
        .filter((batch: BatchDto) => batch.hackChance >= 0.9 && batch.target.security.access && batch.targetAmount)
        .map((batch: BatchDto) => ({
            target: batch.target.hostname,
            income: formulas.getBatchIncomePerSecond(batch.target, host, batch.targetAmountMultiplier, monitor),
            ram: batch.ramCost * BatchHackingFormulas.getWaveSize(host, batch.ramCost, batch.duration) / host.refresh().ram.max * 100,
            duration: batch.duration,
            prepDuration: new PrepareBatchDto(ns, batch.target, batch.host).duration
        })).sortBy("income");
}

export const getBestTarget = async (ns: NS, monitor = false): Promise<string> => {
    const candidates = await getPossibleActions(ns, monitor);
    return candidates.length ? candidates[0].target : "n00dles";
}

export async function main(ns: NS): Promise<void> {
    const serverRepository = new ServerRepository(ns);

    if (ns.args.length) {
        const host = await serverRepository.getById("home");
        const target = await serverRepository.getById(ns.args[0] as string);

        ns.tprint(JSON.stringify(new BatchDto(ns, target, host), null, 2));
        return;
    }

    const possibleActions = (await getPossibleActions(ns))
        .map((action: BatchStats) => {
            return {
                target: action.target,
                income: action.income,
                duration: ns.tFormat(action.duration),
                prepDuration: ns.tFormat(action.prepDuration),
                ram: action.ram
            }
        }
    );

    ns.tprint(JSON.stringify(possibleActions, null, 2));
}

export function autocomplete(data: any): string[] {
    return [...data.servers];
}
