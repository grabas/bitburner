export interface BatchScript {
    path: string;
    size: number;
}

export const Scripts: { [key: string]: BatchScript } = {
    GROW_BATCH: { path: "/src/component/batch/action/grow.action.js", size: 1.85 },
    GROW_BATCH_DEBUG: { path: "/src/component/batch/action/grow.action.debug.js", size: 2.15 },

    WEAKEN_BATCH: { path: "/src/component/batch/action/weaken.action.js", size: 1.75 },
    WEAKEN_BATCH_DEBUG: { path: "/src/component/batch/action/weaken.action.debug.js", size: 2.15 },

    HACK_BATCH: { path: "/src/component/batch/action/hack.action.js", size: 1.80 },
    HACK_BATCH_DEBUG: { path: "/src/component/batch/action/hack.action.debug.js", size: 2.10 },

    PREPARATOR: { path: "/src/hacking/preparator.js", size: 2.1 }
};

export type ScriptsEnum = keyof typeof Scripts;