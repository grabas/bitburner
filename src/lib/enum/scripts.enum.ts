export interface ActionScript {
    path: string;
    size: number;
}

export const ActionScripts: { [key: string]: ActionScript } = {
    GROW_BATCH: { path: "/lib/component/batch-attack/action/grow.action.js", size: 1.85 },
    GROW_BATCH_MONITOR: { path: "/lib/component/batch-attack/action/grow.action.monitor.js", size: 1.95 },

    WEAKEN_BATCH: { path: "/lib/component/batch-attack/action/weaken.action.js", size: 1.75 },
    WEAKEN_BATCH_MONITOR: { path: "/lib/component/batch-attack/action/weaken.action.monitor.js", size: 1.95 },

    HACK_BATCH: { path: "/lib/component/batch-attack/action/hack.action.js", size: 1.80 },
    HACK_BATCH_MONITOR: { path: "/lib/component/batch-attack/action/hack.action.monitor.js", size: 1.90 },

    PREPARATOR: { path: "/lib/hacking/preparator.js", size: 2.1 },

    TAPEWORM: { path: "/lib/component/tapeworm-attack/action/tapeworm.js", size: 2.20 },
    TAPEWORM_GROW: { path: "/lib/component/tapeworm-attack/action/tapeworm.grow.js", size: 1.75 },
    TAPEWORM_WEAKEN: { path: "/lib/component/tapeworm-attack/action/tapeworm.weaken.js", size: 1.75 },
    TAPEWORM_HACK: { path: "/lib/component/tapeworm-attack/action/tapeworm.hack.js", size: 1.70 },
    TAPEWORM_PEPARATOR: { path: "/lib/component/tapeworm-attack/action/tapeworm.preparator.js", size: 3.40 }
};

