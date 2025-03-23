import {ScriptArg} from "@ns";
import {CrimeType} from "/lib/enum/crime.enum";

export type InitScripts = { [key: string]: Script; }

export interface TestScript {
    name: string;
    path: string;
    portNumber: number;
}

export interface Script {
    path: string;
    name: string;
    defaultArgs: ScriptArg[];
    preTest?: TestScript;
    postTest?: TestScript;
    priority?: number;
}

export const GlobalRequirements: InitScripts = {
    SET_BITNODE: {
        name: "Set Bitnode",
        path: "/lib/command/set-bitnode.js",
        defaultArgs: [],
        preTest: undefined,
        postTest: {
            name: "BitnodeTest",
            path: "/lib/test/tests/bitnode.test.js",
            portNumber: 10010
        },
        priority: 0,
    },
    BUILD_SERVER_DATABASE: {
        name: "Build Server Database",
        path: "/lib/command/build-server-database.js",
        defaultArgs: [],
        preTest: undefined,
        postTest: undefined,
        priority: 1,
    }
}

export const Commands: InitScripts = {
    INITIAL_GAIN_ACCESS: {
        name: "Initial Gain Access",
        path: "/lib/command/gain-access.js",
        defaultArgs: [],
        preTest: {
            name: "ServerRepositoryTest",
            path: "/lib/test/tests/server-repository.test.js",
            portNumber: 10200
        },
        postTest: {
            name: "InitalGainAccessTest",
            path: "/lib/test/tests/initial-gain-access.test.js",
            portNumber: 10210
        },
        priority: 2,
    },
    TAPEWORM_INFESTATION: {
        name: "Tapeworm Infestation",
        path: "/lib/command/tapeworm-infestation.js",
        defaultArgs: [],
        preTest: {
            name: "InitalGainAccessTest",
            path: "/lib/test/tests/initial-gain-access.test.js",
            portNumber: 10300
        },
        postTest: {
            name: "IsBusyTest",
            path: "/lib/test/tests/tapewormed.test.js",
            portNumber: 10310
        },
        priority: 3,
    },
    COMMIT_CRIME: {
        name: "Commit Crime",
        path: "/lib/command/commit-crime.js",
        defaultArgs: [CrimeType.Homicide],
        preTest: {
            name: "SingularityTest",
            path: "/lib/test/tests/singularity.test.js",
            portNumber: 10400
        },
        postTest: {
            name: "IsBusyTest",
            path: "/lib/test/tests/is-busy.test.js",
            portNumber: 10410
        },
        priority: 4,
    }
}

export const BrokersAndAgents: InitScripts = {
    CONTRACT_SOLVER: {
        name: "Contract Solver",
        path: "/lib/component/contract/solver.daemon.js",
        defaultArgs: ["--loop"],
        preTest: {
            name: "ContractSolverTest",
            path: "/lib/test/tests/contract-solver.test.js",
            portNumber: 10500
        },
        postTest: undefined,
        priority: 5,
    },
    HOME_UPGRADE_BROKER: {
        name: "Home Upgrade Broker",
        path: "/lib/component/broker/home-upgrade/home-upgrade.daemon.js",
        defaultArgs: ["--loop"],
        preTest: {
            name: "SingularityTest",
            path: "/lib/test/tests/singularity.test.js",
            portNumber: 10600
        },
        postTest: undefined,
        priority: 6
    },
    HACKNET_BROKER: {
        name: "Hacknet Broker",
        path: "/lib/component/broker/hacknet/hacknet.daemon.js",
        defaultArgs: ["--loop"],
        preTest: undefined,
        postTest: undefined,
        priority: 7,
    },
    DARKWEB_BROKER: {
        name: "Darkweb Broker",
        path: "/lib/component/broker/darkweb/darkweb.daemon.js",
        defaultArgs: ["--no-utility", "--no-formulas"],
        preTest: {
            name: "SingularityTest",
            path: "/lib/test/tests/singularity.test.js",
            portNumber: 10800
        },
        postTest: undefined,
        priority: 8
    },
    GAIN_ACCESS: {
        name: "Gain Access",
        path: "/lib/command/gain-access.js",
        defaultArgs: ["--loop", "--tapeworm"],
        preTest: undefined,
        postTest: undefined,
        priority: 9,
    }/*,
    BATCH_ATTACK: {
        name: "Batch Attack",
        path: "/lib/component/batch/batch.daemon.js",
        defaultArgs: ["--loop"],
        preTest: {
            name: "BatchAttackTest",
            path: "/lib/test/tests/batch-attack.test.js",
            portNumber: 10800
        },
        postTest: undefined,
        priority: 9,
    },*/
};
