export const ScriptsEnum = {
    GROW_BATCH: { path: "src/hacking/grow-batch.js", size: 1.95 },
    WEAKEN_BATCH: { path: "src/hacking/weaken-batch.js", size: 1.95 },
    HACK_BATCH: { path: "src/hacking/hack-batch.js", size: 1.90 },
    PREPARATOR: { path: "src/hacking/preparator.js", size: 2.1 }
} as const;

export type ScriptsEnum = keyof typeof ScriptsEnum;