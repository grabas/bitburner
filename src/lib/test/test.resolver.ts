import {NS, ScriptArg} from "@ns";
import {TestResult} from "/lib/test/test.interface";
import {TestScript} from "/lib/init/init.config";
import {Colors} from "/lib/enum/colors.enum";
import {setColor} from "/lib/utils/helpers/set-color";
import {Ports} from "/lib/enum/ports.enum";

const BACKUP_TEST_SERVER = "nectar-net";

export async function resolveTest(ns: NS, testFilePath: string, args?: ScriptArg[]): Promise<TestResult> {
    const portHandle = ns.getPortHandle(Ports.TESTTING_PORT);
    portHandle.clear();

    const processPid = args && args.length ?
        ns.exec(testFilePath, "home", 1, ...args) :
        ns.exec(testFilePath, "home", 1);

    if (!processPid) {
        const processPidBackup = args && args.length ?
            ns.exec(testFilePath, BACKUP_TEST_SERVER, 1, ...args) :
            ns.exec(testFilePath, BACKUP_TEST_SERVER, 1);

        if (!processPidBackup) {
            return {
                test: "Test",
                message: "Failed to run test",
                result: false
            }
        }
    }

    await portHandle.nextWrite()
    const result = JSON.parse(portHandle.read()) as TestResult;
    portHandle.clear();

    return result;
}

export async function runTest(ns: NS, testScript: TestScript, scriptName: string, args: ScriptArg[]) {
    const testResult = await resolveTest(ns, testScript.path, args);

    if (!testResult.result) {
        throw new Error(`${testScript.name} failed for ${scriptName}: ${testResult.message}`);
    }

    ns.tprint(setColor(`${testScript.name} passed for ${scriptName}`, Colors.GREEN));
    return true;
}