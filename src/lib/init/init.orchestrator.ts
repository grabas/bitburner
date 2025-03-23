import {FilenameOrPID, NS} from "@ns";
import {Colors} from "/lib/enum/colors.enum";
import {setColor} from "/lib/utils/helpers/set-color";
import {
    GlobalRequirements,
    BrokersAndAgents,
    Script,
    TestScript,
    Commands,
    InitScripts
} from "/lib/init/init.config";
import {runTest} from "/lib/test/test.resolver";
import "/lib/utils/prototypes";

export class InitOrchestrator {
    private readonly ns: NS;

    constructor(ns: NS) {
        this.ns = ns;
    }

    public init = async () => {
        this.print("Initializing...", Colors.YELLOW);

        const failedGlobalRequirements = await this.runsScripts(GlobalRequirements, true);

        if (failedGlobalRequirements.length) {
            throw new Error("Failed to run essential scripts");
        }

        await this.runsScripts(Commands, true);
        await this.watch(
            await this.runsScripts(BrokersAndAgents)
        );

        this.print("\t");
        this.print("Initialization complete!", Colors.YELLOW);
    }

    private runsScripts = async (initScripts: InitScripts, asCommand = false): Promise<Script[]> => {
        const failedScripts: Script[] = [];

        const scripts = Object.values(initScripts).sortBy("priority", "ASC");
        for (const script of scripts) {
            const result = await this.runScript(script, asCommand);

            if (!result) {
                failedScripts.push(script);
            }
        }

        return failedScripts;
    }

    private runScript = async (script: Script, asCommand = false): Promise<boolean> => {
        this.print("\t")
        this.print(`Running ${script.name}...`, Colors.ORANGE);

        if (!(await this.runTestScript(script.preTest, script.name))) return false;
        const scriptPid = this.ns.run(script.path, 1, ...script.defaultArgs);

        if (!scriptPid) {
            this.print(`Failed to run ${script.name}`, Colors.RED);
            return false;
        }

        if (asCommand) {
            while (this.isRunning(scriptPid)) {
                await this.ns.sleep(500);
            }
        }

        if (!(await this.runTestScript(script.postTest, script.name))) return false;
        this.print(`${script.name} OK!`, Colors.PURPLE);

        return true;
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
            const result = await this.runScript(script);
            if (!result) {
                failedScripts.push(script);
            }
        }

        if (failedScripts.length) {
            await this.watch(failedScripts);
        }
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
