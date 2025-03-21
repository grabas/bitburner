export function parseArgs(args: (string | number | boolean)[]) {
    return {
        noFormulas: args.includes("-xf") || args.includes("--no-formulas"),
        noUtility: args.includes("-xu") || args.includes("--no-utility"),
    };
}
