import {NS} from "@ns";
import {ServerRepository} from "/src/repository/serverRepository";
import {ServerDto} from "/src/entity/server/serverDto";

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
    const servers = await (new ServerRepository(ns)).getNetwork();
    servers.forEach((server: ServerDto) => {
        if (!server.security.access && attemptHacking(ns, server.hostname)) {
           ns.tprint("Access granted: " + server.hostname)
        }
    });
}
