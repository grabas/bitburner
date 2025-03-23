import {FilenameOrPID, NS} from "@ns";
import {Colors} from "/lib/enum/colors.enum";
import {setColor} from "/lib/utils/helpers/set-color";
import {EssentialInitScripts, InitScripts, Script, TestScript} from "/lib/init/init.config";
import {runTest} from "/lib/test/test.resolver";
import "/lib/utils/prototypes";

export class InitOrchestrator {
    private readonly ns: NS;

    constructor(ns: NS) {
        this.ns = ns;
    }

    public init = async () => {
        await this.runEssentialScripts();
        const failedScripts = await this.runScripts();
        await this.watch(failedScripts);
    }

    private runEssentialScripts = async () => {
        const scripts = Object.values(EssentialInitScripts).sortBy("priority", "ASC");
        for (const script of scripts) {
            this.print("\t")

            const preTestResult = await this.runTestScript(script.preTest, script.name);
            if (!preTestResult) {
                throw new Error(`Pre-test failed for essencial script ${script.name}`);
            }

            const proccessId = this.ns.run(script.path, 1, ...script.defaultArgs);
            while (this.isRunning(proccessId)) {
                await this.ns.sleep(100);
            }

            const postTestResult = await this.runTestScript(script.postTest, script.name);
            if (!postTestResult) {
                throw new Error(`Post-test failed for essencial script ${script.name}`);
            }
        }
    }

    private runScripts = async (): Promise<Script[]> => {
        const failedScripts: Script[] = [];
        const scripts = Object.values(InitScripts).sortBy("priority", "ASC");
        for (const script of scripts) {
            const result = await this.runScript(script);
            if (!result) {
                failedScripts.push(script);
            }
        }

        return failedScripts;
    }

    private watch = async (scripts: Script[]) => {
        if (!scripts.length) return;

        const serverMaxRam = this.ns.getServerMaxRam("home");
        while (serverMaxRam === this.ns.getServerMaxRam("home")) {
            await this.ns.sleep(1000);
        }

        scripts.sortBy("priority", "ASC");
        const failedScripts: Script[] = [];
        for (const script of scripts) {
            const result = await this.runScript(script);
            if (!result) {
                failedScripts.push(script);
            }
        }

        if (failedScripts.length) {
            await this.watch(failedScripts);
        }
    }

    private runScript = async (script: Script): Promise<boolean> => {
        this.print("\t")

        if (!(await this.runTestScript(script.preTest, script.name))) return false;
        const scriptPid = this.ns.run(script.path, 1, ...script.defaultArgs);

        if (!this.isRunning(scriptPid)) {
            this.print(`Failed to run ${script.name}`, Colors.RED);
            return false;
        }

        this.print(`Running ${script.name}...`, Colors.GREEN);
        return true;
    }

    private runTestScript = async (testScript: TestScript|undefined, scriptName: string) => {
        if (testScript) {
            return await runTest(this.ns, testScript, scriptName);
        }

        return true;
    }

    private print = (message: string|number|boolean, color = Colors.WHITE) => this.ns.tprint(setColor(message, color));
    private isRunning = (id: FilenameOrPID): boolean => this.ns.isRunning(id, "home");
}
