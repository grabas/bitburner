import {NS, ScriptArg} from "@ns";

const parseArgs = (args: ScriptArg[]) => {
    if (args.length !== 2) {
        throw new Error("Invalid number of arguments");
    }

    return {
        minSecurityLevel: args[0] as number,
        maxMoney: args[1] as number
    };
}

export async function main(ns: NS, args = parseArgs(ns.args)): Promise<void> {
    try {
        const target = ns.getHostname()
        const securityThreshold = args.minSecurityLevel + 3;
        const moneyThreshold = args.maxMoney * 0.9;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (ns.getServerSecurityLevel(target) > securityThreshold) {
                await ns.weaken(target);
            } else if (ns.getServerMoneyAvailable(target) < moneyThreshold) {
                await ns.grow(target);
            } else {
                await ns.hack(target);
            }
        }
    } catch (error) {
        ns.print(error instanceof Error ? error.message : error);
    }
}