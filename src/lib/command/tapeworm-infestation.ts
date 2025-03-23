import {NS} from "@ns";
import {ServerRepository} from "/lib/repository/server.repository";
import {ActionScripts} from "/lib/enum/scripts.enum";

export const main = async (ns: NS): Promise<void> => {
    const script = ActionScripts.TAPEWORM;

    const serverRepository = new ServerRepository(ns);
    const hackeableServers = await serverRepository.getHackedServers();
    for (const server of hackeableServers) {
        ns.scp(script.path, server.hostname, "home");
        const threads = Math.floor(server.getRamAvailable() / script.size);
        if (threads) {
            ns.exec(script.path, server.hostname, Math.floor(server.getRamAvailable() / script.size), server.security.min, server.money.max);
        }
    }
}
