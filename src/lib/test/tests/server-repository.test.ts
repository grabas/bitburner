import {NS} from "@ns";
import {TestBase} from "/lib/test/test.base";
import {ServerRepository} from "/lib/repository/server.repository";

export async function main(ns: NS,): Promise<void> {
    await (new ServerRepositoryTest(ns)).runTest();
}

class ServerRepositoryTest extends TestBase {
    constructor(ns: NS) {
        super(ns);
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