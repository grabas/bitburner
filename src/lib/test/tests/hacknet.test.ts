import {NS, ScriptArg} from "@ns";
import {TestBase} from "/lib/test/test.base";
import {ServerRepository} from "/lib/repository/server.repository";
import {HacknetBroker} from "/lib/component/broker/hacknet/hacknet.broker";

export async function main(ns: NS,): Promise<void> {
    await (new HacknetTest(ns, ns.args)).runTest();
}

class HacknetTest extends TestBase {
    private readonly args: ScriptArg[];

    constructor(ns: NS, args: ScriptArg[]) {
        super(ns);
        this.args = args;
    }

    async test(): Promise<boolean> {
        const hacknetBroker = new HacknetBroker(this.ns);

        if (hacknetBroker.noMoreDeals()) return true;

        const scriptName = "/lib/component/broker/hacknet/hacknet.daemon.js"
        const isRunning = await (new ServerRepository(this.ns)).isRunningOnAnyServer(scriptName, this.args);
        if (!isRunning) {
            throw new Error(`Script is not running on any of the available servers`);
        }

        return true;
    }
}