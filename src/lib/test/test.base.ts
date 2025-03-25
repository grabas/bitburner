import {NS} from "@ns";
import {ITest, TestResult} from "/lib/test/test.interface";
import {Ports} from "/lib/enum/ports.enum";

export abstract class TestBase implements ITest {
    protected readonly ns: NS;

    protected constructor(ns: NS) {
        this.ns = ns;
    }

    abstract test(): Promise<boolean>;

    async runTest(): Promise<void> {
        const testResult = {
            test: this.constructor.name,
            message: "OK",
            result: true,
        };

        try {
            testResult.result = await this.test();
        } catch (error: unknown) {
            testResult.result = false;
            testResult.message = error instanceof Error ? error.message : String(error);
        }

        this.report(testResult);
    }

    report(result: TestResult) {
        this.ns.getPortHandle(Ports.TESTTING_PORT).write(JSON.stringify(result));
    }
}