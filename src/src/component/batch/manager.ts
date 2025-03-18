import { NS } from "@ns";
import { Config } from "./config";
import { Action } from "./action";
import { ServerRepository } from "/src/repository/server.repository";
import { getProgressBar } from "/src/utils/progress-bar";
import { uuidv4 } from "/src/utils/uuidv4";
import { prepare } from "/src/command/prepare-target";

export class Manager {
    private readonly ns: NS;
    private repository: ServerRepository;

    constructor(ns: NS) {
        this.ns = ns;
        this.repository = new ServerRepository(ns);
        ns.disableLog("ALL");
    }

    public batchAttack = async (target: string): Promise<void> => {
        const host = await this.repository.getById(this.ns.getHostname());
        const operationId = uuidv4();

        this.ns.run("/src/utils/monitor-batch-desync.js", 1, "grow", operationId);
        this.ns.run("/src/utils/monitor-batch-desync.js", 1, "hack", operationId);
        this.ns.run("/src/utils/monitor-batch-desync.js", 1, "weaken", operationId);

        let batchId = 0
        do {
            await this.prepareTarget(this.ns, target);

            const batch = new Action(this.ns, await this.repository.getById(target), host);
            this.#printLog(batch, true);
            for (let i = 0; i < batch.batchSize; i++) {
                batch.action.forEach((action) => {
                    this.ns.run(
                        action.script.path,
                        action.threads,
                        batchId++,
                        batch.target.hostname,
                        action.sleepTime,
                        batch.target.security.min,
                        action.duration ?? 0,
                        operationId
                    );
                });
                await this.ns.sleep(Config.BATCH_SEPARATION);
            }

            await this.#monitor(batch);
        } while (true);
    };

    private async prepareTarget(ns: NS, target: string) {
        const server = await this.repository.getById(target);
        const host = await this.repository.getById(this.ns.getHostname());
        if (!server.isPrepared()) {
            this.#printLog(new Action(this.ns, await this.repository.getById(target), host), false, true);
            await prepare(ns, target);
        }
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

        const target = batch.target;
        const percentage = (batch.totalRam / this.ns.getServerMaxRam(this.ns.getHostname())) * 100;
        const income = this.ns.nFormat(batch.income.perCycle, "$0.000a");
        const incomePerSecond = this.ns.nFormat(batch.income.perSecond, "$0.000a");

        const moneyAvailable = target.getMoneyAvailable()
        const moneyAvailablePercentage = ((moneyAvailable / target.money.max) * 100);
        const color = moneyAvailablePercentage === 100
            ? "\u001b[32m"
            : moneyAvailablePercentage >= 51
                ? "\u001b[33m"
                : "\u001b[31m";

        const coloredPercentage = `${color}${moneyAvailablePercentage.toFixed(2)}%\u001b[0m`;

        const minSec = target.security.min;
        const sec = target.getSecurityLevel();
        const deltaSec = sec - minSec;

        const secColor = deltaSec === 0
            ? "\u001b[32m"
            : deltaSec <= 1
                ? "\u001b[33m"
                : "\u001b[31m";

        const coloredSecurity = `${secColor}+${deltaSec.toFixed(2)}\u001b[0m`;

        const hostname = batch.target.hostname.toUpperCase();
        const totalWidth = 36;
        const padding = Math.max(0, totalWidth - hostname.length - 2);
        const leftPad = Math.floor(padding / 2);
        const rightPad = padding - leftPad;

        const totalRam = this.ns.formatRam(batch.totalRam)
        const ramPerBatch = this.ns.formatRam(batch.ramPerBatch)

        this.ns.print(`\u001b[35m${"-".repeat(leftPad)} ${hostname} ${"-".repeat(rightPad)}\u001b[35m-`);
        this.ns.print(`$_______:${" ".repeat(25 - moneyAvailablePercentage.toFixed(2).length)} ${coloredPercentage}`);
        this.ns.print(`Security:${" ".repeat(25 - deltaSec.toFixed(2).length)} ${coloredSecurity}`);
        this.ns.print(`${" ".repeat(36)}`)
        this.ns.print(`Income per cycle:${" ".repeat(19 - income.length)}\u001b[32m${income}\u001b[32m`);
        this.ns.print(`Income per second:${" ".repeat(18 - incomePerSecond.length)}\u001b[32m${incomePerSecond}\u001b[32m`);
        this.ns.print(`Batches:${" ".repeat(28 - batch.batchSize.toString().length)}\u001b[35m${batch.batchSize}\u001b[35m`);
        this.ns.print(`RAM per batch:${" ".repeat(22 - ramPerBatch.length)}${ramPerBatch}`);
        this.ns.print(
            `RAM total:${" ".repeat(17 - totalRam.length)}\u001b[31m${totalRam}\u001b[31m (${percentage.toFixed(2)}%)`
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