import { NS } from "@ns";
import { BatchConfig } from "./batch.config";
import { ServerRepository } from "/lib/repository/server.repository";
import { uuidv4 } from "/lib/utils/uuidv4";
import { ActionArgs } from "/lib/component/batch/batch.args";
import { monitor, printLog } from "/lib/component/batch/batch.monitor";
import { Batch } from "/lib/component/batch/batch";
import { HackingFormulas } from "/lib/component/batch/batch.formulas";
import { getBestTarget } from "/lib/component/batch/target.resolver";
import { ServerDto } from "/lib/entity/server/server.dto";
import { PrepareBatch } from "/lib/component/batch/prepare-batch";

export class BatchManager {
    private readonly ns: NS;
    private repository: ServerRepository;

    constructor(ns: NS) {
        this.ns = ns;
        this.repository = new ServerRepository(ns);
    }

    public batchAttack = async (
        targetId: string | null | undefined,
        switchTarget = false,
        debug = false
    ): Promise<void> => {
        const host = await this.repository.getById(this.ns.getHostname());
        let target = await this.repository.getById(targetId ?? (await getBestTarget(this.ns)));

        switchTarget = typeof targetId !== "string" || switchTarget;

        let cycle = 0;
        let actionId = 0;
        let operationId = uuidv4();

        const debugPort = this.randomPort();
        if (debug) this.runDebugProcedures(debugPort);

        const processIds: number[] = [];
        do {
            await this.ensureTargetPrepared(target, host, processIds);

            const batch = new Batch(this.ns, target.refresh(), host.refresh(), true, debug);
            const waveSize = HackingFormulas.getWaveSize(batch, host, false, debug);

            printLog(this.ns, batch, waveSize, true);
            actionId = await this.runBatchWaves(batch, waveSize, actionId, operationId, debugPort, processIds);

            await monitor(this.ns, batch, waveSize);
            cycle++;

            if (switchTarget && cycle >= BatchConfig.BATCH_TARGET_CYCLES) {
                ({ target, operationId, actionId, cycle } = await this.resetCycleAndTarget(processIds));
            }
        } while (!debug);
    };

    private runBatchWaves = async (
        batch: Batch,
        waveSize: number,
        startActionId: number,
        operationId: string,
        debugPort: number,
        processIds: number[]
    ): Promise<number> => {
        let actionId = startActionId;
        for (let wave = 0; wave < waveSize; wave++) {
            for (const action of batch.action) {
                const args: ActionArgs = {
                    id: actionId++,
                    target: batch.target.hostname,
                    sleepTime: action.sleepTime,
                    minSecLevel: batch.target.security.min,
                    expectedDuration: action.duration ?? 0,
                    operationId,
                    batchId: wave,
                    waitFlag: true,
                    threads: action.threads,
                    debugPortNumber: debugPort
                };
                processIds.push(this.runScript(action.script.path, action.threads, args));
            }
            await this.ns.sleep(BatchConfig.BATCH_SEPARATION);
        }
        return actionId;
    };

    private ensureTargetPrepared = async (
        target: ServerDto,
        host: ServerDto,
        processIds: number[]
    ): Promise<void> => {
        if (target.isPrepared()) return;

        printLog(this.ns, new Batch(this.ns, target, host), 1, false, true);
        this.killProcesses(processIds);
        await this.runPrepareBatch(target, host);
        this.ns.toast(`${target.hostname} is prepared`);
    };

    private runPrepareBatch = async (target: ServerDto, host: ServerDto): Promise<void> => {
        const batch = new Batch(this.ns, target, host);
        const prepareBatch = new PrepareBatch(this.ns, target, host);
        let actionId = 0;
        const operationId = uuidv4();
        let preparePids = this.spawnActions(
            prepareBatch.action,
            batch.target,
            0,
            false,
            operationId,
            () => actionId++
        );

        while (!target.isPrepared()) {
            if (preparePids.every((pid) => !this.ns.isRunning(pid))) {
                preparePids = this.spawnActions(
                    prepareBatch.action,
                    batch.target,
                    0,
                    false,
                    operationId,
                    () => actionId++
                );
            }
            await this.ns.sleep(100);
        }
        this.killProcesses(preparePids);
    };

    private spawnActions = (
        actions: any[],
        target: ServerDto,
        batchId: number,
        waitFlag: boolean,
        operationId: string,
        getActionId: () => number
    ): number[] => {
        return actions.map((action) => {
            const args: ActionArgs = {
                id: getActionId(),
                target: target.hostname,
                sleepTime: action.sleepTime,
                minSecLevel: target.security.min,
                expectedDuration: action.duration ?? 0,
                operationId,
                batchId,
                waitFlag,
                threads: action.threads,
                debugPortNumber: 0,
            };
            return this.runScript(action.script.path, action.threads, args);
        });
    };

    private randomPort = (): number => Math.floor(Math.random() * 255) + 1;

    private runScript = (scriptPath: string, threads: number, args: ActionArgs): number =>
        this.ns.run(scriptPath, threads, ...Object.values(args));

    private runDebugProcedures = (debugPort: number): number =>
        this.ns.run("/lib/utils/monitor-batch-desync.js", 1, debugPort);

    private killProcesses = (pids: number[]): void => {
        pids.forEach((pid) => this.ns.kill(pid));
        pids.length = 0;
    };

    private async resetCycleAndTarget(processIds: number[]): Promise<{
        target: ServerDto;
        operationId: string;
        actionId: number;
        cycle: number;
    }> {
        const bestTargetId = await getBestTarget(this.ns);
        const newTarget = await this.repository.getById(bestTargetId);
        const newOperationId = uuidv4();
        this.killProcesses(processIds);
        return { target: newTarget, operationId: newOperationId, actionId: 0, cycle: 0 };
    }
}