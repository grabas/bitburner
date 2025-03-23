import {NS} from "@ns";
import {ServerRepository} from "/lib/repository/server.repository";
import {ServerDto} from "/lib/entity/server/server.dto";
import {setColor} from "/lib/utils/helpers/set-color";
import {Colors} from "/lib/enum/colors.enum";
import {ActionScripts} from "/lib/enum/scripts.enum";

function parseArgs(args: (string | number | boolean)[]) {
    return {
        loop: args.includes("-l") || args.includes("--loop"),
        tapeworm: args.includes("-t") || args.includes("--tapeworm")
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
    do {
        let allAccessed = true;
        const servers = await (new ServerRepository(ns)).getServers();
        servers.forEach((server: ServerDto) => {
            server.refresh();
            allAccessed = allAccessed && server.security.access;
            if (!server.security.access && attemptHacking(ns, server.hostname)) {
                const script = ActionScripts.TAPEWORM;
                ns.toast("Access granted: " + server.hostname)
                if (args.tapeworm) {
                    ns.scp(script.path, server.hostname, "home");
                    const threads = Math.floor(server.getRamAvailable() / script.size);
                    if (threads) {
                        try {
                            ns.exec(script.path, server.hostname, Math.floor(server.getRamAvailable() / script.size), server.security.min, server.money.max);
                        } catch (error) {}
                    }
                }
            }
        });

        if (allAccessed) {
            ns.toast("All servers accessed");
            break;
        }
        await ns.sleep(1000);
    } while (args.loop);
}
