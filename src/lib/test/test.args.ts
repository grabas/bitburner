import {NS} from "@ns";

export function parseArgs(ns: NS) {
    const flags = ns.flags([
        ["port", 1],
        ["p", 1],
    ]);


    const positional = flags._ as string|number[];

    return {
        port: (flags.port || flags.p || positional[0]) as number,
    };
}
