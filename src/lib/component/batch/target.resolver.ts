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

function optimizeCandidates(candidates: BatchStats[], maxRam: number) {
    const items = candidates;

    type Result = { totalIncome: number; totalRam: number; selection: BatchStats[] };
    const memo = new Map<string, Result>();

    function knap(
        index: number,
        currentIncome: number,
        currentRam: number,
        selection: BatchStats[]
    ): Result {
        const key = `${index}-${currentRam.toFixed(2)}`;
        if (memo.has(key)) return memo.get(key)!;

        if (currentRam > maxRam) return { totalIncome: -Infinity, totalRam: currentRam, selection: [] };
        if (index === items.length) {
            return { totalIncome: currentIncome, totalRam: currentRam, selection: selection.slice() };
        }

        const exclude = knap(index + 1, currentIncome, currentRam, selection);

        selection.push(items[index]);
        const include = knap(
            index + 1,
            currentIncome + items[index].income,
            currentRam + items[index].ram,
            selection
        );
        selection.pop();

        const result = exclude.totalIncome >= include.totalIncome ? exclude : include;
        memo.set(key, result);
        return result;
    }

    return knap(0, 0, 0, []);
}

export async function getCandidates(ns: NS): Promise<BatchStats[]> {
    const batches = await getPossibleActions(ns);

    const maxRamLimit = 150;
    const result = optimizeCandidates(batches, maxRamLimit);

    return result.selection;
}

const getPossibleActions = async (ns: NS): Promise<BatchStats[]> => {
    const serverRepository = new ServerRepository(ns);
    const host = await serverRepository.getById("home");
    const candidates = await serverRepository.getMonetaryServers();
    const formulas = new HackingFormulas(ns);

    return candidates
        .map((target: ServerDto) => new Batch(ns, target, host))
        .filter((batch: Batch) => batch.hackChance === 1 && batch.target.security.access)
        .sortBy("income.perSecond")
        .map((batch: Batch) => ({
            target: batch.target.hostname,
            income: formulas.getBatchIncomePerSecond(batch.target, batch.host, batch.targetAmountMultiplier, true) ?? 0,
            ram: (batch.ramCost * HackingFormulas.getWaveSize(batch, host, true)) / host.refresh().ram.max * 100,
            duration: batch.duration,
            prepDuration: new PrepareBatch(ns, batch.target, batch.host).duration
        }));
}

export const getBestTarget = async (ns: NS): Promise<string> => {
    const candidates = await getPossibleActions(ns);
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
