import {NS, ScriptArg} from "@ns";
import {TestResult} from "/lib/test/test.interface";
import {TestScript} from "/lib/init/init.config";
import {Colors} from "/lib/enum/colors.enum";
import {setColor} from "/lib/utils/helpers/set-color";
import {Ports} from "/lib/enum/ports.enum";

export async function resolveTest(ns: NS, testFilePath: string, args?: ScriptArg[]): Promise<TestResult> {
    const portHandle = ns.getPortHandle(Ports.TESTTING_PORT);
    portHandle.clear();

    const processPid = args && args.length ?
        ns.run(testFilePath, 1, ...args) :
        ns.run(testFilePath, 1);

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

export async function runTest(ns: NS, testScript: TestScript, scriptName: string, args: ScriptArg[]) {
    const testResult = await resolveTest(ns, testScript.path, args);

    const message = testResult.result ?
        setColor(`${testScript.name} passed for ${scriptName}`, Colors.GREEN) :
        setColor(`${testScript.name} failed for ${scriptName}: ${testResult.message}`, Colors.RED);

    ns.tprint(message);
    return testResult.result;
}