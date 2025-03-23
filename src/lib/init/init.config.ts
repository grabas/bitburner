import {ScriptArg} from "@ns";

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


export const EssentialInitScripts: { [key: string]: Script } = {
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
        postTest: {
            name: "ServerRepositoryTest",
            path: "/lib/test/tests/server-repository.test.js",
            portNumber: 10110
        },
        priority: 1,
    },
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
    }
}

export const InitScripts: { [key: string]: Script } = {
    CONTRACT_SOLVER: {
        name: "Contract Solver",
        path: "/lib/component/contract/solver.daemon.js",
        defaultArgs: ["--loop"],
        preTest: {
            name: "ContractSolverTest",
            path: "/lib/test/tests/contract-solver.test.js",
            portNumber: 10300
        },
        postTest: undefined,
        priority: 3,
    },
    HOME_UPGRADE_BROKER: {
        name: "Home Upgrade Broker",
        path: "/lib/component/broker/home-upgrade/home-upgrade.daemon.js",
        defaultArgs: ["--loop"],
        preTest: {
            name: "SingularityTest",
            path: "/lib/test/tests/singularity.test.js",
            portNumber: 10400
        },
        postTest: undefined,
        priority: 4
    },
    HACKNET_BROKER: {
        name: "Hacknet Broker",
        path: "/lib/component/broker/hacknet/hacknet.daemon.js",
        defaultArgs: ["--loop"],
        preTest: undefined,
        postTest: undefined,
        priority: 5,
    },
    DARKWEB_BROKER: {
        name: "Darkweb Broker",
        path: "/lib/component/broker/darkweb/darkweb.daemon.js",
        defaultArgs: ["--no-utility", "--no-formulas"],
        preTest: {
            name: "SingularityTest",
            path: "/lib/test/tests/singularity.test.js",
            portNumber: 10600
        },
        postTest: undefined,
        priority: 6
    },
    GAIN_ACCESS: {
        name: "Gain Access",
        path: "/lib/command/gain-access.js",
        defaultArgs: ["--loop"],
        preTest: undefined,
        postTest: undefined,
        priority: 7,
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
        priority: 8,
    },*/
};