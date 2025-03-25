import {NS, ScriptArg} from "@ns";
import { getAllServers, getServerById } from '../database/server.database.js';
import { ServerDto } from '/lib/entity/server/server.dto';
import { ServerData } from "/lib/entity/server/server.interfaces";
import "/lib/utils/prototypes";

export function autocomplete(data: any) {
    data.flags([['verbose', false], ['refreshRate', 200]]);
    return [...data.servers];
}

export async function main(ns: NS) {
    const target = ns.args[0].toString();
    const serverRepository = new ServerRepository(ns);

    target ? (await serverRepository.getById(target)).print() : (await serverRepository.getServers()).forEach((server: ServerDto) => server.print());
}

export class ServerRepository {
    private readonly ns: NS;

    constructor(ns: NS) {
        this.ns = ns;
    }

    getById = async (id: string): Promise<ServerDto> => {
        const server = await getServerById(id);

        if (!server) throw new Error(`Server with id ${id} not found`);

        return new ServerDto(this.ns, server);
    }

    public async getServers(includeHome = false): Promise<ServerDto[]> {
        const allServers: ServerData[] = await getAllServers();
        return allServers
            .filter((server: ServerData) => includeHome || !server.isHome)
            .map((server: ServerData) => new ServerDto(this.ns, server));
    }

    public async getHackedServers(includeHome = false): Promise<ServerDto[]> {
        const network = await this.getServers(includeHome);
        return network.filter(server => server.security.access);
    }

    public async getAvailableServers(includeHome = false): Promise<ServerDto[]> {
        const hackedServers = await this.getHackedServers(includeHome);
        return hackedServers.filter(server => server.ram.max > 0);
    }

    public async getWorkers(includeHome = false): Promise<ServerDto[]> {
        const availableServers = await this.getAvailableServers(includeHome);
        return availableServers.filter(server => !server.purchased)
            .sortBy("ram.free");
    }

    public async getTotalRamAvailable(includeHome = false): Promise<number> {
        const workers = await this.getWorkers(includeHome);
        return workers.reduce((total, server) => total + server.getRamAvailable(), 0);
    }

    public async getMonetaryServers(): Promise<ServerDto[]> {
        const network = await this.getServers();
        return network.filter(server => server.money.max > 0).sortBy("money.max");
    }

    public async getTargetableServers(): Promise<ServerDto[]> {
        const hackedServers = await this.getHackedServers();
        return hackedServers
            .filter((server: ServerDto) => server.security.levelRequired <= this.ns.getHackingLevel())
            .filter((server: ServerDto) => server.money.max > 0)
            .sortBy("security.levelRequired", "ASC");
    }

    public async getPurchased(): Promise<ServerDto[]> {
        const availableServers = await this.getAvailableServers();
        return availableServers.filter(server => server.purchased)
            .sortBy("ram.max");
    }

    public async getIdleServers(): Promise<ServerDto[]> {
        const purchasedServers = await this.getPurchased();
        return purchasedServers.filter(server => server.ram.used === 0);
    }

    public async isRunningOnAnyServer(scriptName: string, args: ScriptArg[] = []): Promise<boolean> {
        const servers = await this.getServers(true);

        for (const server of servers) {
            const isRunning = args.length ?
                this.ns.isRunning(scriptName, server.hostname, ...args) :
                this.ns.isRunning(scriptName, server.hostname);

            if (isRunning) return true;
        }

        return false;
    }
}
