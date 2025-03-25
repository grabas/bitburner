import {NS} from "@ns";
import {TestBase} from "/lib/test/test.base";

export async function main(ns: NS,): Promise<void> {
    await (new BatchAttackTest(ns)).runTest();
}

class BatchAttackTest extends TestBase {
    constructor(ns: NS) {
        super(ns);
    }

    async test(): Promise<boolean> {
        if (this.ns.getServerMaxRam("home") < 16) {
            throw new Error("Home server does not have enough RAM");
        }

        return true
    }
}