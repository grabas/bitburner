import {NS} from "@ns";
import {TestBase} from "/lib/test/test.base";
import {parseArgs} from "/lib/test/test.args";
import {getBitnode} from "/lib/repository/bitnode.repository";

export async function main(ns: NS, args = parseArgs(ns)): Promise<void> {
    await (new SingularityTest(ns, args.port)).runTest();
}

class SingularityTest extends TestBase {
    constructor(ns: NS, portNumber: number) {
        super(ns, portNumber);
    }

    async test(): Promise<boolean> {
        const bitnode = getBitnode();

        if (!bitnode.hasAccessSingularity()) {
            throw new Error("No access to singularity");
        }

        return true;
    }
}