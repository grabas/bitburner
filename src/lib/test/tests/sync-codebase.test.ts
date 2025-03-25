import {NS} from "@ns";
import {TestBase} from "/lib/test/test.base";
import {ServerRepository} from "/lib/repository/server.repository";

export async function main(ns: NS): Promise<void> {
    await (new InitialGainAccessTest(ns)).runTest();
}

class InitialGainAccessTest extends TestBase {
    constructor(ns: NS) {
        super(ns);
    }

    async test(): Promise<boolean> {
        const testSubject = "n00dles";

        for (const file of this.ns.ls("home", ".js")) {
            if (!this.ns.fileExists(file, testSubject)) {
                throw new Error(`Codebase sync failed: ${file} was not found on ${testSubject}`);
            }
        }

        return true;
    }
}