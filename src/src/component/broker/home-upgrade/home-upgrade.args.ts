export function parseArgs(args: (string | number | boolean)[]) {
    return {
        loop: args.includes("-l") || args.includes("--loop"),
    };
}
