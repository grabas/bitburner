import {NS} from "@ns";
import {TestBase} from "/lib/test/test.base";
import {parseArgs} from "/lib/test/test.args";
import {getBitnode} from "/lib/repository/bitnode.repository";

export async function main(ns: NS, args = parseArgs(ns)): Promise<void> {
   await (new BitnodeTest(ns, args.port)).runTest();
}

export class BitnodeTest extends TestBase {
    constructor(ns: NS, portNumber: number) {
        super(ns, portNumber);
    }

    async test(): Promise<boolean> {
        if (this.ns.getResetInfo().currentNode !== getBitnode().number) {
            throw new Error("Bitnode does not match current node");
        }
        return true;
    }
}