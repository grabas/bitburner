import {NS} from "@ns";
import {BatchConfig} from "./batch.config";
import {ServerRepository} from "/lib/repository/server.repository";
import {ActionArgs} from "/lib/component/batch-attack/batch.args";
import {monitor as monitorStatus, printLog} from "/lib/component/batch-attack/batch.monitor";
import {BatchDto} from "/lib/component/batch-attack/batch.dto";
import {getBestTarget} from "/lib/component/batch-attack/target.resolver";
import {ServerDto} from "/lib/entity/server/server.dto";
import {PrepareBatchDto} from "/lib/component/batch-attack/prepare-batch.dto";
import {BatchType, IBatch} from "/lib/component/batch-attack/batch.interface";
import {CLEAR_PORT_MSG} from "/react-component/hooks/use-port-listener";
import {BatchHackingFormulas} from "/lib/component/batch-attack/batch.formulas";

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
        monitor = false
    ): Promise<void> => {
        const host = await this.repository.getById(this.ns.getHostname());
        let target = await this.repository.getById(targetId ?? (await getBestTarget(this.ns, monitor)));

        switchTarget = typeof targetId !== "string" || switchTarget;

        let cycle = 0;
        const monitorPort = this.randomPort();
        if (monitor) this.runDiagnostics(monitorPort);

        const processIds: number[] = [];
        do {
            await this.ensureTargetPrepared(target, host, processIds);

            const batch = new BatchDto(this.ns, target.refresh(), host.refresh(), monitor);
            const waveSize = BatchHackingFormulas.getWaveSize(host, batch.ramCost, batch.duration);
            printLog(this.ns, batch, waveSize, true);

            await this.spawnBatchActions(batch, waveSize, monitorPort, processIds);

            await monitorStatus(this.ns, batch, waveSize);
            while (this.processesRunning(processIds)) {
                await this.ns.sleep(BatchConfig.TICK);
            }

            if (switchTarget && ++cycle >= BatchConfig.BATCH_TARGET_CYCLES) {
                ({ target, cycle } = await this.resetCycleAndTarget(processIds, monitor));
            }
            this.ns.getPortHandle(monitorPort).write(CLEAR_PORT_MSG);
        } while (true);
    };

    private ensureTargetPrepared = async (
        target: ServerDto,
        host: ServerDto,
        processIds: number[],
    ): Promise<void> => {
        while (this.processesRunning(processIds)) {
            await this.ns.sleep(BatchConfig.TICK);
        }

        if (target.isPrepared()) return;

        const prepareBatch = new PrepareBatchDto(this.ns, target, host);
        const preparePids = await this.spawnBatchActions(prepareBatch, 1, 0);

        printLog(this.ns, prepareBatch, 1, false, true);
        while (!prepareBatch.target.isPrepared()) {
            if (!this.processesRunning(preparePids)) {
                await this.ensureTargetPrepared(target, host, preparePids);
            }
            await this.ns.sleep(BatchConfig.TICK);
        }

        this.killProcesses(preparePids);
        this.ns.toast(`${target.hostname} is prepared`);
    };

    private spawnBatchActions = async (
        batch: IBatch,
        waveCount: number,
        monitorPort: number,
        processIds?: number[]
    ): Promise<number[]> => {
        let actionId = 0;
        let allPids: number[] = [];

        for (let wave = 0; wave < waveCount; wave++) {
            const pids = batch.action.map((action) => {
                const args: ActionArgs = {
                    id: actionId++,
                    target: batch.target.hostname,
                    sleepTime: action.sleepTime,
                    minSecLevel: batch.target.security.min,
                    moneyMax: batch.target.money.max,
                    expectedDuration: action.duration ?? 0,
                    monitorPortNumber: monitorPort,
                    waitFlag: batch.type === BatchType.ATTACK,
                };
                return this.runScript(action.script.path, action.threads, args);
            });
            allPids = allPids.concat(pids);
            if (processIds) processIds.push(...pids);
            if (wave < waveCount - 1) await this.ns.sleep(BatchConfig.BATCH_SEPARATION);
        }
        return allPids;
    };

    private randomPort = (): number => Math.floor(Math.random() * 255) + 1;
    private processesRunning = (pids: number[]): boolean => pids.some((pid) => this.ns.isRunning(pid));

    private runScript = (scriptPath: string, threads: number, args: ActionArgs): number =>
        this.ns.run(scriptPath, threads, ...Object.values(args));

    private runDiagnostics = (debugPort: number): number =>
        this.ns.run("/lib/utils/monitor-batch-desync.js", 1, debugPort);

    private killProcesses = (pids: number[]): void => {
        pids.forEach((pid) => this.ns.kill(pid));
        pids.length = 0;
    };

    private async resetCycleAndTarget(processIds: number[], monitor = false): Promise<{
        target: ServerDto;
        cycle: number;
    }> {
        const bestTargetId = await getBestTarget(this.ns, monitor);
        const newTarget = await this.repository.getById(bestTargetId);
        this.killProcesses(processIds);
        return { target: newTarget, cycle: 0 };
    }
}