import { NS } from "@ns";
import { BatchConfig } from "./batch.config";
import { ServerRepository } from "/lib/repository/server.repository";
import { uuidv4 } from "/lib/utils/uuidv4";
import {ActionArgs} from "/lib/component/batch/batch.args";
import {monitor, printLog} from "/lib/component/batch/batch.monitor";
import {Batch} from "/lib/component/batch/batch";
import {HackingFormulas} from "/lib/component/batch/batch.formulas";
import {getBestTarget} from "/lib/component/batch/target.resolver";
import {ServerDto} from "/lib/entity/server/server.dto";
import {PrepareBatch} from "/lib/component/batch/prepare-batch";

export class BatchManager {
    private readonly ns: NS;
    private repository: ServerRepository;

    constructor(ns: NS) {
        this.ns = ns;
        this.repository = new ServerRepository(ns);
    }

    public batchAttack = async (targetId: string|null|undefined, switchTarget = false, debug = false): Promise<void> => {
        const host = await this.repository.getById(this.ns.getHostname());

        switchTarget = typeof targetId !== "string" || switchTarget;
        let target = await this.repository.getById(targetId ?? await getBestTarget(this.ns))

        let cycle = 0;
        let actionId = 0;
        let operationId = uuidv4();

        const debugPortNumber = debug ? Math.floor(Math.random() * 255) + 1 : 0;
        if (debug) {
            this.runDebugProcedures(debugPortNumber);
        }

        const processIds = [];
        do {
            await this.prepareTarget(target, host, processIds);

            const batch = new Batch(this.ns, target.refresh(), host.refresh(), true, debug);
            const waveSize = HackingFormulas.getWaveSize(batch, host, false, debug);

            printLog(this.ns, batch, waveSize, true);
            for (let i = 0; i < waveSize; i++) {
                for (const action of batch.action) {
                    processIds.push(
                        this.runScript(
                            action.script.path,
                            action.threads,
                            {
                                id:  actionId++,
                                target:  batch.target.hostname,
                                sleepTime:  action.sleepTime,
                                minSecLevel:  batch.target.security.min,
                                expectedDuration:  action.duration ?? 0,
                                operationId:  operationId,
                                batchId: i,
                                waitFlag: true,
                                threads: action.threads,
                                debugPort: debugPortNumber
                            } as ActionArgs
                        )
                    );
                }
                await this.ns.sleep(BatchConfig.BATCH_SEPARATION);
            }

            await monitor(this.ns, batch, waveSize);

            cycle++;
            if (switchTarget && cycle >= BatchConfig.BATCH_TARGET_CYCLES) {
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
        return this.ns.run(scriptPath, threads, ...Object.values(args))
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
            preparePids.push(
                this.runScript(
                    action.script.path,
                    action.threads,
                    {
                        id:  actionId++,
                        target:  batch.target.hostname,
                        sleepTime:  action.sleepTime,
                        minSecLevel:  batch.target.security.min,
                        expectedDuration:  action.duration ?? 0,
                        operationId:  operationId,
                        batchId: 0,
                        waitFlag: false,
                        threads: action.threads
                    } as ActionArgs
                )
            );
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

    private runDebugProcedures(debugPortNumber: number) {
        this.ns.run("/src/utils/monitor-batch-desync.js", 1, debugPortNumber);
    }
}