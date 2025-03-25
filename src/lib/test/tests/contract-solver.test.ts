import {NS} from "@ns";
import {TestBase} from "/lib/test/test.base";
import {solveContract} from "/lib/component/contract/solver.service";

export async function main(ns: NS): Promise<void> {
    await (new ContractSolverTest(ns)).runTest();
}

class ContractSolverTest extends TestBase {
    constructor(ns: NS) {
        super(ns);
    }

    async test() {
        const contractsTypes = this.ns.codingcontract.getContractTypes();
        for (let i = 0; i < 100; i++) {
            for (const contractType of contractsTypes) {
                const fileName =  this.ns.codingcontract.createDummyContract(contractType);
                const contract =  this.ns.codingcontract.getContract(fileName);

                if (!solveContract(this.ns, contract, false, false)) {
                    throw new Error(`Failed to solve contract ${contractType}`);
                }
            }
        }

        return true;
    }
}