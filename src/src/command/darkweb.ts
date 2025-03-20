import { NS } from "@ns";

const PROGRAMS: string[] = [
    "BruteSSH.exe",
    "HTTPWorm.exe",
    "RelaySMTP.exe",
    "SQLInject.exe",
    "FTPCrack.exe"
];

export async function main(ns: NS): Promise<void> {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            ns.singularity.purchaseTor()
            ns.singularity.purchaseTor();

            if (ns.hasTorRouter()) {
                PROGRAMS.forEach((program: string) => {
                    try {
                        ns.singularity.purchaseProgram(program);
                    } catch (error) {
                        // Ignore individual purchase errors
                    }
                });
            }
        } catch (error) {
            // Ignore errors from purchasing Tor
        }

        if (PROGRAMS.filter((program: string) => ns.fileExists(program)).length === PROGRAMS.length) break;
        await ns.sleep(100);
    }
}
