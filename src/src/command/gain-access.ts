import {NS} from "@ns";
import {ServerRepository} from "/src/repository/server.repository";
import {ServerDto} from "/src/entity/server/server.dto";

export const attemptHacking = (ns: NS, hostname: string) => {
    if (ns.hasRootAccess(hostname)) return true;

    [
        ns.brutessh,
        ns.httpworm,
        ns.ftpcrack,
        ns.relaysmtp,
        ns.sqlinject,
        ns.nuke
    ].forEach((fn) => {try { fn(hostname) } catch (error) {}});

    return ns.hasRootAccess(hostname);
};

export const main = async (ns: NS): Promise<void> => {
    while (true) {
        let allAccessed = true;
        const servers = await (new ServerRepository(ns)).getNetwork();
        servers.forEach((server: ServerDto) => {
            server.refresh();
            allAccessed = allAccessed && server.security.access;
            if (!server.security.access && attemptHacking(ns, server.hostname)) {
                ns.tprint("Access granted: " + server.hostname)
            }
        });

        if (allAccessed) break;
        await ns.sleep(1000);
    }
}
