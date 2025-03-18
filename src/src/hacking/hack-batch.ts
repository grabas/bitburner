import {NS} from "@ns";
import {FileLogger} from "/src/logger/file.logger";
import {LoggerPrefixes} from "/src/enum/logger-prefixes.enum";

export async function main(ns: NS): Promise<void> {
    //const scriptStart = Date.now();

    //const id = ns.args[0] as number;
    const target = ns.args[1] as string;
    const sleepTime = ns.args[2] as number;
    const minSecLevel = ns.args[3] as number;

    await ns.sleep(sleepTime);

    //const serverSecurity = ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);
    while(ns.getServerSecurityLevel(target) !== minSecLevel) {
        await ns.sleep(1)
    }

    //const operationsStart = Date.now();
    await ns.hack(target);
    //const duration = Date.now() - operationsStart;


    /*(new FileLogger(ns))
        .log(LoggerPrefixes.BATCHATTACK + ns.args[5] as string,
            "," + JSON.stringify({
                id: id,
                operation: "hack",
                target: target,
                sleepTime: sleepTime,
                serverSecurity: serverSecurity,
                expectedDuration: ns.args[4] as number,
                actualDuration: duration,
                totalDuration: Date.now() - scriptStart,
                scriptStart: scriptStart,
            }, null, 2));*/

}