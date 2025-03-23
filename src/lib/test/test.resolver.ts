import {NS} from "@ns";
import {TestResult} from "/lib/test/test.interface";
import {TestScript} from "/lib/init/init.config";
import {Colors} from "/lib/enum/colors.enum";
import {setColor} from "/lib/utils/helpers/set-color";

export async function resolveTest(ns: NS, portNumber: number, testFilePath: string): Promise<TestResult> {
    const portHandle = ns.getPortHandle(portNumber);
    portHandle.clear();

    const processPid = ns.run(testFilePath, 1, "--port", portNumber);

    if (!processPid) {
        return {
            test: "Test",
            message: "Failed to run test",
            result: false
        }
    }

    await portHandle.nextWrite()
    const result = JSON.parse(portHandle.read()) as TestResult;
    portHandle.clear();

    return result;
}

export async function runTest(ns: NS, testScript: TestScript, scriptName: string) {
    const testResult = await resolveTest(ns, testScript.portNumber, testScript.path);

    const message = testResult.result ?
        setColor(`${testResult.test} passed for ${scriptName}`, Colors.GREEN) :
        setColor(`${testResult.test} failed for ${scriptName}: ${testResult.message}`, Colors.RED);

    ns.tprint(message);
    return testResult.result;
}