import {NS} from "@ns";
import {ServerRepository} from "/lib/repository/server.repository";
import {ServerDto} from "/lib/entity/server/server.dto";
import {setColor} from "/lib/utils/helpers/set-color";
import {Colors} from "/lib/enum/colors.enum";

function parseArgs(args: (string | number | boolean)[]) {
    return {
        loop: args.includes("-l") || args.includes("--loop"),
    };
}

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

export const main = async (ns: NS, args= parseArgs(ns.args)): Promise<void> => {
    ns.tprint(setColor("Gaining access...", Colors.ORANGE));
    do {
        let allAccessed = true;
        const servers = await (new ServerRepository(ns)).getServers();
        servers.forEach((server: ServerDto) => {
            server.refresh();
            allAccessed = allAccessed && server.security.access;
            if (!server.security.access && attemptHacking(ns, server.hostname)) {
                ns.toast("Access granted: " + server.hostname)
            }
        });

        if (allAccessed) {
            ns.tprint(setColor("All servers accessed", Colors.GREEN));
            break;
        }
        await ns.sleep(1000);
    } while (args.loop);

    ns.tprint(setColor("Access gained", Colors.GREEN));
}
