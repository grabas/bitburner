import {ScriptArg} from "@ns";
import {CrimeType} from "/lib/enum/crime.enum";

export type InitScripts = { [key: string]: Script; }

export interface TestScript {
    name: string;
    path: string;
    args?: ScriptArg[];
}

/**
 * Represents a script configuration for executing tasks.
 */
export interface Script {
    /**
     * The file path of the script.
     */
    path: string;

    /**
     * The name of the script.
     */
    name: string;

    /**
     * The default arguments for the script.
     */
    defaultArgs: ScriptArg[];

    /**
     * A precondition test that runs before the script.
     */
    preTest?: TestScript;

    /**
     * A test that runs after the script.
     */
    postTest?: TestScript;

    /**
     * Priority for the script execution.
     */
    priority?: number;

    /**
     * The host on which the script runs.
     */
    host?: string;

    /**
     * If true, throws an error if the script fails. Used for critical scripts and global requirements.
     */
    throwOfFailure?: boolean;

    /**
     * If true, waits for the script to finish before continuing. Used for command-like scripts
     */
    waitForExecution?: boolean;

    /**
     * If true Init orchestrator will try to run the script again of on home upgrade.
     */
    ensureRunning?: boolean;
}

export const InitScripts: InitScripts = {
    SET_BITNODE: {
        name: "Set Bitnode",
        path: "/lib/command/set-bitnode.js",
        defaultArgs: [],
        postTest: {
            name: "Bitnode Test",
            path: "/lib/test/tests/bitnode.test.js",
        },
        priority: 0,
        throwOfFailure: true,
        waitForExecution: true,
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
        throwOfFailure: true,
        waitForExecution: true,
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
        throwOfFailure: true,
        waitForExecution: true,
    },
    INITIAL_SYNC_CODEBASE: {
        name: "Initial Codebase Sync",
        path: "/lib/command/sync-codebase.js",
        defaultArgs: [],
        preTest: undefined,
        postTest: {
            name: "Codebase Synced Test",
            path: "/lib/test/tests/sync-codebase.test.js",
        },
        priority: 3,
        throwOfFailure: true,
        waitForExecution: true,
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
        priority: 10,
        waitForExecution: true,
    },
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
        host: "n00dles",
        ensureRunning: true,
    },
    CONTRACT_SOLVER_LISTENER: {
        name: "Contract Solver Listener",
        path: "/lib/component/contract/solver.listener.js",
        defaultArgs: [],
        preTest:{
            name: "Contract Solvers Test",
            path: "/lib/test/tests/contract-solver.test.js"
        },
        postTest: {
            name: "Listener is Running Test",
            path: "/lib/test/tests/is-running.test.js",
            args: ["/lib/component/contract/solver.listener.js"]
        },
        priority: 50,
        host: "harakiri-sushi",
        ensureRunning: true,
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
        host: "hong-fang-tea",
        ensureRunning: true,
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
        host: "joesguns",
    },
    HACKNET_BROKER: {
        name: "Hacknet Broker",
        path: "/lib/component/broker/hacknet/hacknet.daemon.js",
        defaultArgs: ["--loop"],
        postTest: {
            name: "Hacknet Broker Test",
            path: "/lib/test/tests/hacknet.test.js",
            args: ["--loop"]
        },
        priority: 70,
        host: "foodnstuff",
        ensureRunning: true,
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
        host: "foodnstuff",
    },
    GAIN_ACCESS: {
        name: "Gain Access",
        path: "/lib/command/gain-access.js",
        defaultArgs: ["--loop"],
        postTest: {
            name: "Gain Access Test",
            path: "/lib/test/tests/gain-access.test.js",
            args: ["--loop"]
        },
        priority: 90,
        host: "foodnstuff",
        ensureRunning: true,
    },
    BATCH_ATTACK: {
        name: "Batch Attack",
        path: "/lib/component/batch-attack/batch.daemon.js",
        defaultArgs: ["--switch", "--monitor"],
        preTest: {
            name: "Batch attack Test",
            path: "/lib/test/tests/batch-attack.test.js",
        },
        postTest: {
            name: "Home Upgrade Broker is Running Test",
            path: "/lib/test/tests/is-running.test.js",
            args: ["/lib/component/batch-attack/batch.daemon.js", "--switch", "--monitor"]
        },
        priority: 100,
    },
};
