import {ScriptArg} from "@ns";

export const parseArgs = (args: ScriptArg[]) => {
    if (args.length !== 3) {
        throw new Error("Invalid number of arguments");
    }

    return {
        target: args[0] as string,
        minSecurityLevel: args[1] as number,
        maxMoney: args[2] as number
    };
}

export function parseActionArgs(args: (string | number | boolean)[]) {
    return {
        target: args[0] as string,
        sleepTime: args[1] as number
    }
}