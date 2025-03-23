import {NS} from "@ns";
import {ITest, TestResult} from "/lib/test/test.interface";

export abstract class TestBase implements ITest {
    protected readonly ns: NS;
    private readonly portNumber: number;

    protected constructor(ns: NS, portNumber: number) {
        this.ns = ns;
        this.portNumber = portNumber;
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
        this.ns.getPortHandle(this.portNumber).write(JSON.stringify(result));
    }
}