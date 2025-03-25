import {NS} from "@ns";
import {TestBase} from "/lib/test/test.base";
import {getBitnode} from "/lib/repository/bitnode.repository";

export async function main(ns: NS): Promise<void> {
   await (new BitnodeTest(ns)).runTest();
}

export class BitnodeTest extends TestBase {
    constructor(ns: NS) {
        super(ns);
    }

    async test(): Promise<boolean> {
        if (this.ns.getResetInfo().currentNode !== getBitnode().number) {
            throw new Error("Bitnode does not match current node");
        }
        return true;
    }
}