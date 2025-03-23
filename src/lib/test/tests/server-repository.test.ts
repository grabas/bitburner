import {NS} from "@ns";
import {TestBase} from "/lib/test/test.base";
import {parseArgs} from "/lib/test/test.args";
import {ServerRepository} from "/lib/repository/server.repository";

export async function main(ns: NS, args = parseArgs(ns)): Promise<void> {
    await (new ServerRepositoryTest(ns, args.port)).runTest();
}

class ServerRepositoryTest extends TestBase {
    constructor(ns: NS, portNumber: number) {
        super(ns, portNumber);
    }

    async test(): Promise<boolean> {
        const repository = new ServerRepository(this.ns);
        const servers = await repository.getServers();

        if (!servers.length) {
            throw new Error("No hacked servers found");
        }

        return true;
    }
}