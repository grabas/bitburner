import {NS} from "@ns";

export function parseArgs(ns: NS): { target: string | undefined; monitor: boolean; switchTarget: boolean } {
    const flags = ns.flags([
        ["target", ""],
        ["monitor", false],
        ["m", false],
        ["switch", false],
        ["s", false],
    ]);

    const positional = flags._ as string[];

    return {
        target: (flags.target || positional[0]) as string | undefined,
        monitor: (flags.m || flags.monitor) as boolean,
        switchTarget: (flags.s || flags.switch) as boolean,
    };
}

export type ActionArgs = {
    id: number,
    target: string,
    sleepTime: number,
    minSecLevel: number,
    moneyMax: number,
    expectedDuration: number,
    monitorPortNumber: number,
    waitFlag: boolean
};

export function parseActionArgs(args: (string | number | boolean)[]): ActionArgs {
    return {
        id: args[0] as number,
        target: args[1] as string,
        sleepTime: args[2] as number,
        minSecLevel: args[3] as number,
        moneyMax: args[4] as number,
        expectedDuration: args[5] as number,
        monitorPortNumber: args[6] as number,
        waitFlag: args[7] === 1
    };
}