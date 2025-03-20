import { NS } from "@ns";
import { BatchConfig } from "./batch.config";
import { ServerRepository } from "/src/repository/server.repository";
import { uuidv4 } from "/src/utils/uuidv4";
import {ActionArgs} from "/src/component/batch/action/action.type";
import {monitor, printLog} from "/src/component/batch/batch.monitor";
import {Batch} from "/src/component/batch/batch";
import {HackingFormulas} from "/src/component/batch/batch.formulas";
import {getBestTarget} from "/src/component/batch/target.resolver";
import {ServerDto} from "/src/entity/server/server.dto";
import {PrepareBatch} from "/src/component/batch/prepare-batch";

export class BatchManager {
    private readonly ns: NS;
    private repository: ServerRepository;

    constructor(ns: NS) {
        this.ns = ns;
        this.repository = new ServerRepository(ns);
    }

    public batchAttack = async (targetId: string|null|undefined, debug = false): Promise<void> => {
        const host = await this.repository.getById(this.ns.getHostname());

        const targetWasSet = typeof targetId === "string";
        let target = await this.repository.getById(targetId ?? await getBestTarget(this.ns))

        let cycle = 0;
        let actionId = 0;
        let operationId = uuidv4();

        if (debug) {
            this.runDebugProcedures(operationId);
        }

        const processIds = [];
        do {
            await this.prepareTarget(target, host, processIds);

            const batch = new Batch(this.ns, target, host, debug);
            const waveSize = HackingFormulas.getWaveSize(batch, host, false, debug);

            printLog(this.ns, batch, waveSize, true);
            for (let i = 0; i < waveSize; i++) {
                for (const action of batch.action) {
                    const args: ActionArgs = [
                        actionId++,               // id
                        batch.target.hostname,    // target
                        action.sleepTime,         // sleepTime
                        batch.target.security.min,// minSecLevel
                        action.duration ?? 0,     // expectedDuration
                        operationId,              // operationId
                        i,                        // batchId
                        1                         // waitFlag (1 means true)
                    ];
                    processIds.push(this.runScript(action.script.path, action.threads, args));
                }
                await this.ns.sleep(BatchConfig.BATCH_SEPARATION);
            }

            await monitor(this.ns, batch, waveSize);

            cycle++;
            if (!targetWasSet && cycle >= BatchConfig.BATCH_TARGET_CYCLES) {
                target = await this.repository.getById(await getBestTarget(this.ns));
                operationId = uuidv4();
                actionId = 0;
                cycle = 0;
                processIds.length = this.killSpawnedProcesses(processIds);
            }
        } while (!debug);
    };

    private runScript = (
        scriptPath: string,
        threads: number,
        args: ActionArgs
    ): number => {
        return this.ns.run(scriptPath, threads, ...args);
    };

    private async prepareTarget(target: ServerDto, host: ServerDto, processIds?: number[]): Promise<void> {
        if (target.isPrepared()) return;

        const batch = new Batch(this.ns, target, host);
        printLog(this.ns, batch, HackingFormulas.getWaveSize(batch, host), false, true);

        if (processIds) {
            this.killSpawnedProcesses(processIds);
        }

        const prepareBatch = new PrepareBatch(this.ns, target, host);
        let actionId = 0;
        const operationId = uuidv4();

        const preparePids: number[] = []
        for (const action of prepareBatch.action) {
            const args: ActionArgs = [
                actionId++,               // id
                batch.target.hostname,    // target
                action.sleepTime,         // sleepTime
                batch.target.security.min,// minSecLevel
                action.duration ?? 0,     // expectedDuration
                operationId,              // operationId
                0,                        // batchId
                0,                         // waitFlag (1 means true)
            ];
            preparePids.push(this.runScript(action.script.path, action.threads, args));
        }

        while (!target.isPrepared()) {
            const allScriptsFinished = preparePids.map((pid) => this.ns.isRunning(pid)).every((isRunning) => !isRunning);

            if (allScriptsFinished) {
                await this.prepareTarget(target, host);
            }

            await this.ns.sleep(100);
        }

        this.killSpawnedProcesses(preparePids);
        this.ns.toast(target.hostname + " is prepared");
    }

    private killSpawnedProcesses(processIds: number[]): number {
        processIds.forEach(pid => this.ns.kill(pid));
        return 0;
    }

    private runDebugProcedures(operationId: string) {
        this.ns.run("/src/utils/monitor-batch-desync.js", 1, "grow", operationId);
        this.ns.run("/src/utils/monitor-batch-desync.js", 1, "hack", operationId);
        this.ns.run("/src/utils/monitor-batch-desync.js", 1, "weaken", operationId);
    }
}