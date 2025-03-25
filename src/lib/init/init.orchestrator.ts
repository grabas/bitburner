import "/lib/utils/prototypes";
import {FilenameOrPID, NS, ScriptArg} from "@ns";

import {Colors} from "/lib/enum/colors.enum";
import {setColor} from "/lib/utils/helpers/set-color";
import {runTest} from "/lib/test/test.resolver";

import {
    Script,
    TestScript,
    InitScripts
} from "/lib/init/init.config";

export class InitOrchestrator {
    private readonly ns: NS;

    constructor(ns: NS) {
        this.ns = ns;
    }

    public init = async () => {
        this.print("Initializing...", Colors.YELLOW);

        const failedScripts = await this.runsScripts();

        await this.watch(failedScripts);

        this.print("\t");
        this.print("Initialization complete!", Colors.YELLOW);
    }

    private runsScripts = async (): Promise<Script[]> => {
        const failedScripts: Script[] = [];

        const scripts = Object.values(InitScripts).sortBy("priority", "ASC");
        for (const script of scripts) {
            this.print("\t")
            this.print(`Running ${script.name}...`, Colors.ORANGE);

            const result = await this.runScript(script);

            if (!result && script.ensureRunning) {
                failedScripts.push(script);
                continue;
            }

            this.print(`${script.name} OK!`, Colors.PURPLE);
        }

        return failedScripts;
    }

    private runScript = async (script: Script): Promise<boolean> => {
        if (this.isRunning(script.path, script.host, script.defaultArgs)) {
            this.print(`${script.name} is already running`, Colors.YELLOW);
            return true;
        }

        try {
            await this.runTestScript(script.preTest, script.name);

            await this.exec(script);

            await this.runTestScript(script.postTest, script.name);

            return true;
        } catch (error: unknown) {
            this.print(error instanceof Error ? error.message : String(error), Colors.RED);

            if (script.throwOfFailure) throw error;

            return false;
        }
    }

    private watch = async (scripts: Script[]) => {
        if (!scripts.length) return;

        this.print("\t")
        this.print("Waiting for server upgrade...", Colors.YELLOW);

        const serverMaxRam = this.ns.getServerMaxRam("home");
        while (serverMaxRam === this.ns.getServerMaxRam("home")) {
            await this.ns.sleep(1000);
        }

        scripts.sortBy("priority", "ASC");
        const failedScripts: Script[] = [];
        for (const script of scripts) {
            if (!await this.runScript(script)) {
                failedScripts.push(script);
            }
        }

        if (failedScripts.length) {
            await this.watch(failedScripts);
        }
    }

    private runTestScript = async (testScript: TestScript|undefined, scriptName: string) => {
        if (testScript) {
            return await runTest(this.ns, testScript, scriptName, testScript.args ?? []);
        }

        return true;
    }

    private exec = async (script: Script) => {
        const scriptPid = this.ns.exec(script.path, script.host ?? "home", 1, ...script.defaultArgs);

        if (!scriptPid) throw new Error(`Script failed to run`);

        if (script.waitForExecution) {
            while (this.isRunning(scriptPid, script.host, script.defaultArgs)) {
                await this.ns.sleep(500);
            }
        }
    }

    private isRunning = (id: FilenameOrPID, host?: string, args?: ScriptArg[]): boolean => {
        return args && args.length ?
            this.ns.isRunning(id, host, ...args) :
            this.ns.isRunning(id, host);
    }

    private print = (message: string|number|boolean, color = Colors.WHITE) => this.ns.tprint(setColor(message, color));
}
