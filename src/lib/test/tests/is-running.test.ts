import {NS, ScriptArg} from "@ns";
import {TestBase} from "/lib/test/test.base";
import {ServerRepository} from "/lib/repository/server.repository";

const parseArgs = (args: ScriptArg[]) => ({
    scriptName: args[0] as string,
    args: args.slice(1) as ScriptArg[]
})

export async function main(ns: NS, args = parseArgs(ns.args)): Promise<void> {
    await (new IsRunningTest(ns, args.scriptName, args.args)).runTest();
}

class IsRunningTest extends TestBase {
    private readonly scriptName: string;
    private readonly args: ScriptArg[];

    constructor(ns: NS, scriptName: string, args: ScriptArg[]) {
        super(ns);
        this.scriptName = scriptName;
        this.args = args;
    }

    async test(): Promise<boolean> {
        const isRunning = await (new ServerRepository(this.ns)).isRunningOnAnyServer(this.scriptName, this.args);
        if (!isRunning) {
            throw new Error(`Script is not running on any of the available servers`);
        }

        return true;
    }
}