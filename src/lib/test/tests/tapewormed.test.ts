import {NS} from "@ns";
import {TestBase} from "/lib/test/test.base";
import {parseArgs} from "/lib/test/test.args";
import {ServerRepository} from "/lib/repository/server.repository";
import {ActionScripts} from "/lib/enum/scripts.enum";

export async function main(ns: NS, args = parseArgs(ns)): Promise<void> {
    await (new TapewormedTest(ns, args.port)).runTest();
}

class TapewormedTest extends TestBase {
    constructor(ns: NS, portNumber: number) {
        super(ns, portNumber);
    }

    async test(): Promise<boolean> {
        const repository = new ServerRepository(this.ns);
        const hackedServers = await repository.getHackedServers();

        const script = ActionScripts.TAPEWORM;
        const player = this.ns.getPlayer();
        for (const server of hackedServers) {
            if (script.size > server.getRamAvailable() || server.security.levelRequired > player.skills.hacking) {
                continue;
            }

            if (!this.ns.isRunning(script.path, server.hostname, server.security.min, server.money.max)) {
                throw new Error("Tapeworms not distributed");
            }
        }

        return true;
    }
}