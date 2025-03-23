export interface BatchScript {
    path: string;
    size: number;
}

export const ActionScripts: { [key: string]: BatchScript } = {
    GROW_BATCH: { path: "/lib/component/batch/action/grow.action.js", size: 1.75 },
    GROW_BATCH_MONITOR: { path: "/lib/component/batch/action/grow.action.monitor.js", size: 1.95 },

    WEAKEN_BATCH: { path: "/lib/component/batch/action/weaken.action.js", size: 1.75 },
    WEAKEN_BATCH_MONITOR: { path: "/lib/component/batch/action/weaken.action.monitor.js", size: 1.95 },

    HACK_BATCH: { path: "/lib/component/batch/action/hack.action.js", size: 1.80 },
    HACK_BATCH_MONITOR: { path: "/lib/component/batch/action/hack.action.monitor.js", size: 1.90 },

    PREPARATOR: { path: "/lib/hacking/preparator.js", size: 2.1 },
    TAPEWORM: { path: "/lib/hacking/tapeworm.js", size: 2.25 }
};

