import { NS } from "@ns";
import { Crawler } from "/src/utils/crawler";
import { Action } from "./action";

export async function main(ns: NS): Promise<void> {
    const crawler = new Crawler(ns);
    const batches = crawler
        .getNetwork()
        .map((host: string) => new Action(ns, host))
        .filter((batch: Action) => batch.hackChance >= 0.9 && ns.hasRootAccess(batch.target))
        .sortBy("income.perSecond")
        .map((batch: Action) => ({
            target: batch.target,
            income: ns.formatNumber(batch.income.perSecond) + "/s",
        }));

    ns.tprint(JSON.stringify(batches, null, 2));
}