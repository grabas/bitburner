export function parseArgs(args: (string | number | boolean)[]) {
    return {
        target: args[0] as string || null,
        monitor: args.includes("-m") || args.includes("--monitor"),
        switchTarget: args.includes("-s") || args.includes("--switch"),
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