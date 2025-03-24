import {NS} from "@ns";
import {ServerRepository} from "/lib/repository/server.repository";
import {ServerDto} from "/lib/entity/server/server.dto";
import {ActionScripts} from "/lib/enum/scripts.enum";
import {TapewormDto} from "/lib/component/tapeworm-attack/tapeworm.dto";
import {TapewormConfig} from "/lib/component/tapeworm-attack/tapeworm.config";
import {TapewormPortMessage} from "/lib/component/tapeworm-attack/tapeworm.interface";

export class TapewormManager {
    private readonly ns: NS;
    private readonly serverRepository: ServerRepository;
    constructor(ns: NS) {
        this.ns = ns;
        this.serverRepository = new ServerRepository(ns);
    }

    public async execute(): Promise<void> {
        const targets = await this.serverRepository.getTargetableServers();

        targets
            .filter(target => target.ram.max > 0)
            .forEach(target => this.executeAction(target));

        await this.monitor();
    }

    private executeAction(target: ServerDto) {
        target.isPrepared() ?
            this.infest(target) :
            this.prepareTarget(target);
    }

    private getDeployFiles(target: ServerDto) {
        const files = this.ns.ls("home", "tapeworm-attack")
        this.ns.scp(files, target.hostname, "home");
    }

    private prepareTarget(target: ServerDto) {
        this.getDeployFiles(target);
        this.ns.killall(target.hostname);

        const script = ActionScripts.TAPEWORM_PEPARATOR;
        try {
            this.ns.exec(
                script.path,
                target.hostname,
                Math.floor(target.getRamAvailable() / script.size),
                target.hostname,
                target.security.min,
                target.money.max
            );
        } catch (e) {
            this.ns.print(e instanceof Error ? e.message : e);
        }
    }

    private infest(target: ServerDto) {
        this.ns.killall(target.hostname);
        this.getDeployFiles(target);

        const tapeworm = new TapewormDto(this.ns, target);
        for (const action of tapeworm.action) {
            try {
                this.ns.exec(action.script.path, target.hostname, action.threads, ...action.args);
            } catch (e) { this.ns.print(e instanceof Error ? e.message : e);}
        }
    }

    private async monitor() {
        this.ns.disableLog("sleep");
        const portHandle = this.ns.getPortHandle(TapewormConfig.TAPEWORM_PORT_HANDLE);

        while (true) {
            const message = portHandle.read();

            if (message !== "NULL PORT DATA") {
                const action = JSON.parse(message) as TapewormPortMessage;
                const target = await this.serverRepository.getById(action.target);
                this.executeAction(target);
            }

            await this.ns.sleep(TapewormConfig.TICK);
        }
    }
}