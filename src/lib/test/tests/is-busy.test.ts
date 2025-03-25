import {NS} from "@ns";
import {TestBase} from "/lib/test/test.base";
import {getBitnode} from "/lib/repository/bitnode.repository";

export async function main(ns: NS): Promise<void> {
    await (new IsBusyTest(ns)).runTest();
}

class IsBusyTest extends TestBase {
    constructor(ns: NS) {
        super(ns);
    }

    async test(): Promise<boolean> {
        const bitnode = getBitnode();

        if (!bitnode.hasAccessSingularity()) {
            throw new Error("No access to singularity");
        }

        if (!this.ns.singularity.isBusy()) {
            throw new Error("Player is not busy");
        }

        return true;
    }
}