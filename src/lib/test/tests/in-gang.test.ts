import {NS} from "@ns";
import {TestBase} from "/lib/test/test.base";

export async function main(ns: NS,): Promise<void> {
    await (new InGangTest(ns)).runTest();
}

class InGangTest extends TestBase {
    constructor(ns: NS) {
        super(ns);
    }

    async test(): Promise<boolean> {
        if (!this.ns.gang.inGang()) {
            throw new Error("Player is not in a gang");
        }

        return true
    }
}