export function parseArgs(args: (string | number | boolean)[]) {
    return {
        loop: args.includes("-l") || args.includes("--loop"),
        safe: args.includes("-s") || args.includes("--safe"),
        run: args.includes("-r") || args.includes("--run"),
    };
}
