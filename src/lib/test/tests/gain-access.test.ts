import {NS} from "@ns";
import {TestBase} from "/lib/test/test.base";
import {parseArgs} from "/lib/test/test.args";
import {BrokersAndAgents} from "/lib/init/init.config";

export async function main(ns: NS, args = parseArgs(ns)): Promise<void> {
    await (new GainAccessTest(ns, args.port)).runTest();
}

class GainAccessTest extends TestBase {
    constructor(ns: NS, portNumber: number) {
        super(ns, portNumber);
    }

    async test(): Promise<boolean> {
        if (!this.ns.isRunning(BrokersAndAgents.DARKWEB_BROKER.path)) {
            throw new Error("Darkweb broker is not running");
        }

        return true;
    }
}