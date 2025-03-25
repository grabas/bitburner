import {NS, ScriptArg} from "@ns";
import {TestBase} from "/lib/test/test.base";
import {ServerRepository} from "/lib/repository/server.repository";
import {ServerDto} from "/lib/entity/server/server.dto";

export async function main(ns: NS): Promise<void> {
    await (new GainAccessTest(ns, ns.args)).runTest();
}

class GainAccessTest extends TestBase {
    private readonly args: ScriptArg[];

    constructor(ns: NS, args: ScriptArg[]) {
        super(ns);
        this.args = args;
    }

    async test(): Promise<boolean> {
        const repository = new ServerRepository(this.ns);
        const servers= await repository.getServers();

        let allAccessed = true;
        servers.forEach((server: ServerDto) => {
            server.refresh();
            allAccessed = allAccessed && server.security.access;
        });

        if (allAccessed) {
            return true;
        }

        const scriptName = "/lib/command/gain-access.js";
        const isRunning = await repository.isRunningOnAnyServer(scriptName, this.args);
        if (!isRunning) {
            throw new Error(`Script is not running on any of the available servers`);
        }

        return true
    }
}