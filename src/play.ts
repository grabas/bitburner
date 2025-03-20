import {NS} from "@ns";
import {ServerRepository} from "/src/repository/server.repository";
import {getSave} from "/src/database/save.database";
import {HackingFormulas} from "/src/component/batch/batch.formulas";
import {cDocument} from "lib/react";
import {uuidv4} from "/src/utils/uuidv4";
import {BatchConfig} from "/src/component/batch/batch.config";
import {prepare} from "/src/command/prepare-target";
import {printLog} from "/src/component/batch/batch.monitor";
import {getSolver} from "/src/component/contract/solver.registry";
import {CodingContractName} from "/src/enum/contract-names.enum";
import {solveContract} from "/src/component/contract/solver.service";
import {Batch} from "/src/component/batch/batch";
import {ServerConstants} from "/src/enum/server-constants.enum";
import {HacknetBroker} from "/src/component/broker/hacknet/hacknet.broker";
import {getBitnode, setBitnode} from "/src/repository/bitnode.repository";

export async function main(ns: NS, print = (data: any) => ns.tprint(JSON.stringify(data, null, 2))): Promise<void> {
   ns.kill(420)
}

