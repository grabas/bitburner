import {NS, ScriptArg} from "@ns";
import {TestBase} from "/lib/test/test.base";
import {ServerRepository} from "/lib/repository/server.repository";
import {HacknetBroker} from "/lib/component/broker/hacknet/hacknet.broker";
import {DarkwebBroker} from "/lib/component/broker/darkweb/darkweb.broker";
import {parseArgs} from "/lib/component/broker/darkweb/darkweb.args";

export async function main(ns: NS,): Promise<void> {
    await (new DarkwebTest(ns, ns.args)).runTest();
}

class DarkwebTest extends TestBase {
    private readonly args: ScriptArg[];

    constructor(ns: NS, args: ScriptArg[]) {
        super(ns);
        this.args = args;
    }

    async test(): Promise<boolean> {
        const darkwebBroker = new DarkwebBroker(this.ns);

        const {noUtility, noFormulas} = parseArgs(this.args);
        if (darkwebBroker.allPurchased(noUtility, noFormulas)) return true;

        const scriptName = "/lib/component/broker/darkweb/darkweb.daemon.js"
        const isRunning = await (new ServerRepository(this.ns)).isRunningOnAnyServer(scriptName, this.args);
        if (!isRunning) {
            throw new Error(`Script is not running on any of the available servers`);
        }

        return true
    }
}