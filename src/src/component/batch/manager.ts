import { NS } from "@ns";
import { Config } from "./config";
import { Action } from "./action";
import { Crawler } from "/src/utils/crawler";
import { ServerRepository } from "/src/repository/serverRepository";
import { getProgressBar } from "/src/utils/progressBar";
import { uuidv4 } from "/src/utils/uuidv4";
import { prepare } from "/src/command/prepareTarget";

export class Manager {
    private readonly ns: NS;
    private crawler: Crawler;
    private repository: ServerRepository;

    constructor(ns: NS) {
        this.ns = ns;
        this.crawler = new Crawler(ns);
        this.repository = new ServerRepository(ns);
        ns.disableLog("ALL");
    }

    public batchAttack = async (target: string | null): Promise<void> => {
        target = target ?? this.getTarget();
        this.ns.run('/src/utils/monitor.js', 1, target);
        do {
            await this.prepareTarget(this.ns, target);

            const batch = new Action(this.ns, target);
            this.#printLog(batch, true);
            for (let i = 0; i < batch.batchSize; i++) {
                batch.action.forEach((action) => {
                    this.ns.run(
                        action.script.path,
                        action.threads,
                        batch.target,
                        action.sleepTime,
                        uuidv4()
                    );
                });
                await this.ns.sleep(Config.BATCH_SEPARATION);
            }

            await this.#monitor(batch);
        } while (true);
    };

    private async prepareTarget(ns: NS, target: string) {
        const server = await this.repository.getById(target);
        if (!server.isPrepared()) {
            this.#printLog(new Action(this.ns, target), false, true);
            await prepare(ns, target);
        }
    }

    private getTarget(): string
    {
        return this.crawler
            .getNetwork()
            .map((host: string) => new Action(this.ns, host))
            .filter(
                (batch: Action) =>
                    batch.income.perCycle &&
                    batch.hackChance === 1 &&
                    this.ns.hasRootAccess(batch.target)
            )
            .sortBy("income.perSecond")[0].target;
    }

    async #monitor(batch: Action): Promise<void> {
        const startTime = Date.now();
        const finishTime = startTime + batch.duration;

        while (Date.now() <= finishTime) {
            this.#printLog(batch);
            this.ns.print(getProgressBar(startTime, batch.duration));
            await this.ns.sleep(10);
        }
    }

    #printLog(
        batch: Action,
        deploying = false,
        prepearing = false
    ): void {
        this.ns.clearLog();

        const percentage = (batch.totalRam / this.ns.getServerMaxRam(this.ns.getHostname())) * 100;
        const income = this.ns.nFormat(batch.income.perCycle, "$0.000a");
        const incomePerSecond = this.ns.nFormat(batch.income.perSecond, "$0.000a");

        this.ns.print(`Target:${" ".repeat(29 - batch.target.length)}\u001b[32m${batch.target}\u001b[32m`);
        this.ns.print(`Income per cycle:${" ".repeat(19 - income.length)}\u001b[32m${income}\u001b[32m`);
        this.ns.print(`Income per second:${" ".repeat(18 - incomePerSecond.length)}\u001b[32m${incomePerSecond}\u001b[32m`);
        this.ns.print(`Batches:${" ".repeat(28 - batch.batchSize.toString().length)}\u001b[35m${batch.batchSize}\u001b[35m`);
        this.ns.print(`RAM per batch:${" ".repeat(19 - batch.ramPerBatch.toString().length)}${batch.ramPerBatch} GB`);
        this.ns.print(
            `RAM total:${" ".repeat(15 - batch.totalRam.toString().length)}\u001b[31m${batch.totalRam}\u001b[31m GB (${percentage.toFixed(2)}%)`
        );

        if (deploying) {
            this.ns.print(`${" ".repeat(24)}\u001b[33m...deploying\u001b[33m`);
            this.ns.print("\t");
        } else if (prepearing) {
            this.ns.print(`${" ".repeat(23)}\u001b[33m...prepearing\u001b[33m`);
            this.ns.print("\t");
        }
    }
}