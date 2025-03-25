import {ScriptArg} from "@ns";
import {CrimeType} from "/lib/enum/crime.enum";

export type InitScripts = { [key: string]: Script; }

export interface TestScript {
    name: string;
    path: string;
    args?: ScriptArg[];
}

export interface Script {
    path: string;
    name: string;
    defaultArgs: ScriptArg[];
    preTest?: TestScript;
    postTest?: TestScript;
    priority?: number;
    host?: string;
}

export const GlobalRequirements: InitScripts = {
    SET_BITNODE: {
        name: "Set Bitnode",
        path: "/lib/command/set-bitnode.js",
        defaultArgs: [],
        postTest: {
            name: "Bitnode Test",
            path: "/lib/test/tests/bitnode.test.js",
        },
        priority: 0,
    },
    BUILD_SERVER_DATABASE: {
        name: "Build Server Database",
        path: "/lib/command/build-server-database.js",
        defaultArgs: [],
        postTest: {
            name: "Database Built Test",
            path: "/lib/test/tests/server-repository.test.js",
        },
        priority: 1,
    },
    INITIAL_GAIN_ACCESS: {
        name: "Initial Gain Access",
        path: "/lib/command/gain-access.js",
        defaultArgs: [],
        preTest: undefined,
        postTest: {
            name: "Inital Gain Access Test",
            path: "/lib/test/tests/initial-gain-access.test.js",
        },
        priority: 2,
    }
}

export const Commands: InitScripts = {
    SYNC_CODEBASE: {
        name: "Initial Codebase Sync",
        path: "/lib/command/sync-codebase.js",
        defaultArgs: [],
        preTest: undefined,
        postTest: {
            name: "Codebase Synced Test",
            path: "/lib/test/tests/sync-codebase.test.js",
        },
        priority: 20,
    },
    COMMIT_CRIME: {
        name: "Commit Crime",
        path: "/lib/command/commit-crime.js",
        defaultArgs: [CrimeType.Homicide],
        preTest: {
            name: "Singularity Test",
            path: "/lib/test/tests/singularity.test.js",
        },
        postTest: {
            name: "Is Busy Test",
            path: "/lib/test/tests/is-busy.test.js",
        },
        priority: 30,
    }
}

export const BrokersAndAgents: InitScripts = {
    SYNC_CODEBASE: {
        name: "Codebase Sync",
        path: "/lib/command/sync-codebase.js",
        defaultArgs: ["--loop"],
        postTest: {
            name: "Codebase Sync is Running Test",
            path: "/lib/test/tests/is-running.test.js",
            args: ["/lib/command/sync-codebase.js", "--loop"]
        },
        priority: 30,
        host: "n00dles"
    },
    CONTRACT_SOLVER_LISTENER: {
        name: "Contract Solver Listener",
        path: "/lib/component/contract/solver.listener.js",
        defaultArgs: [],
        postTest: {
            name: "Listener is Running Test",
            path: "/lib/test/tests/is-running.test.js",
            args: ["/lib/component/contract/solver.listener.js"]
        },
        priority: 50,
        host: "harakiri-sushi"
    },
    CONTRACT_SOLVER_DISPATCHER: {
        name: "Contract Solver Dispatcher",
        path: "/lib/component/contract/solver.dispatcher.js",
        defaultArgs: [],
        preTest: {
            name: "Listener is Running Test",
            path: "/lib/test/tests/is-running.test.js",
            args: ["/lib/component/contract/solver.listener.js"]
        },
        postTest: {
            name: "Dispatcher is Running Test",
            path: "/lib/test/tests/is-running.test.js",
            args: ["/lib/component/contract/solver.dispatcher.js"]
        },
        priority: 50,
        host: "hong-fang-tea"
    },
    HOME_UPGRADE_BROKER: {
        name: "Home Upgrade Broker",
        path: "/lib/component/broker/home-upgrade/home-upgrade.daemon.js",
        defaultArgs: ["--loop"],
        preTest: {
            name: "Singularity Test",
            path: "/lib/test/tests/singularity.test.js",
        },
        postTest: {
            name: "Home Upgrade Broker is Running Test",
            path: "/lib/test/tests/is-running.test.js",
            args: ["/lib/component/broker/home-upgrade/home-upgrade.daemon.js", "--loop"]
        },
        priority: 60,
        host: "joesguns"
    },
    HACKNET_BROKER: {
        name: "Hacknet Broker",
        path: "/lib/component/broker/hacknet/hacknet.daemon.js",
        defaultArgs: ["--loop"],
        preTest: undefined,
        postTest: {
            name: "Hacknet Broker Test",
            path: "/lib/test/tests/hacknet.test.js",
            args: ["--loop"]
        },
        priority: 70,
        host: "foodnstuff"
    },
    DARKWEB_BROKER: {
        name: "Darkweb Broker",
        path: "/lib/component/broker/darkweb/darkweb.daemon.js",
        defaultArgs: ["--no-utility", "--no-formulas"],
        preTest: {
            name: "Singularity Test",
            path: "/lib/test/tests/singularity.test.js",
        },
        postTest: {
            name: "Darkweb Broker Test",
            path: "/lib/test/tests/darkweb.test.js",
            args: ["--no-utility", "--no-formulas"]
        },
        priority: 80,
        host: "foodnstuff"
    },
    GAIN_ACCESS: {
        name: "Gain Access",
        path: "/lib/command/gain-access.js",
        defaultArgs: ["--loop"],
        preTest: undefined,
        postTest: {
            name: "Gain Access Test",
            path: "/lib/test/tests/gain-access.test.js",
            args: ["--loop"]
        },
        priority: 90,
        host: "foodnstuff"
    }/*,
    BATCH_ATTACK: {
        name: "BatchDto Attack",
        path: "/lib/component/batch-attack/batch.daemon.js",
        defaultArgs: ["--loop"],
        preTest: {
            name: "BatchAttackTest",
            path: "/lib/test/tests/batch-attack.test.js",
            portNumber: 11000
        },
        postTest: undefined,
        priority: 100,
    },*/
};
