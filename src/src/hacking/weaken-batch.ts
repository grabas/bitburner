import {NS} from "@ns";
import {FileLogger} from "/src/logger/file.logger";
import {LoggerPrefixes} from "/src/enum/logger-prefixes.enum";

export async function main(ns: NS): Promise<void> {
    const scriptStart = Date.now();

    const id = ns.args[0] as number;
    const target = ns.args[1] as string;
    const sleepTime = ns.args[2] as number;


    await ns.sleep(sleepTime);





    const operationsStart = Date.now();
    await ns.weaken(target);
    const duration = Date.now() - operationsStart;

    const serverSecurity = ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);

    (new FileLogger(ns))
        .log(LoggerPrefixes.BATCHATTACK + ns.args[5] as string,
            "," + JSON.stringify({
                id: id,
                operation: "weaken",
                target: target,
                sleepTime: sleepTime,
                serverSecurity: serverSecurity,
                expectedDuration: ns.args[4] as number,
                actualDuration: duration,
                totalDuration: Date.now() - scriptStart,
                scriptStart: scriptStart,
            }, null, 2));
}