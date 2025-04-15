import {NS, ScriptArg} from "@ns";
import {ServerRepository} from "/lib/repository/server.repository";

const parseArgs = (args: ScriptArg[]) => ({loop: args.includes("--loop") || args.includes("-l")})

export async function main(ns: NS, args = parseArgs(ns.args)): Promise<void> {
    ns.disableLog("ALL");
    do {
        const serverRepository = new ServerRepository(ns);
        const servers = await serverRepository.getHackedServers();
        const files = ns.ls("home", ".js");

        for (const server of servers) {
            ns.scp(files, server.hostname, "home");
        }

        await ns.sleep(100);
    } while (args.loop);
}

