export function parseArgs(args: (string | number | boolean)[]) {
    return {
        target: args[0] as string || null,
        debug: args.includes("-d") || args.includes("--debug"),
        switchTarget: args.includes("-s") || args.includes("--switch"),
    };
}

export type ActionArgs = {
    id: number,
    target: string,
    sleepTime: number,
    minSecLevel: number,
    expectedDuration: number,
    operationId: string,
    batchId: number,
    waitFlag: boolean,
    threads: number,
    debugPortNumber?: number,
};

export function parseActionArgs(args: (string | number | boolean)[]): ActionArgs {
    return {
        id: args[0] as number,
        target: args[1] as string,
        sleepTime: args[2] as number,
        minSecLevel: args[3] as number,
        expectedDuration: args[4] as number,
        operationId: args[5] as string,
        batchId: args[6] as number,
        waitFlag: args[7] === 1,
        threads: args[8] as number,
        debugPortNumber: args[9] as number
    };
}