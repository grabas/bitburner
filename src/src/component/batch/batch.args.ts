export function parseArgs(args: (string | number | boolean)[]) {
    return {
        target: args[0] as string || null,
        debug: args.includes("-d") || args.includes("--debug"),
    };
}
