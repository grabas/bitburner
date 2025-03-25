import {NS} from "@ns";
import {TestBase} from "/lib/test/test.base";
import {getTestData} from "/lib/test/test-data/constract-solver";
import {getSolver} from "/lib/component/contract/solver.registry";
import {CodingContractName} from "/lib/component/contract/contract-names.enum";
import {toString} from "/lib/utils/helpers/serialize-to-string";

export async function main(ns: NS): Promise<void> {
    await (new ContractSolverTest(ns)).runTest();
}

class ContractSolverTest extends TestBase {
    constructor(ns: NS) {
        super(ns);
    }

    async test() {
        for (const constract of getTestData()) {
            const solver = getSolver(constract.type);

            if (!solver) {
                throw new Error(`Solver not found for contract type: ${constract.type}`);
            }

            const solution = solver.solve(constract.data)

            if (constract.type === CodingContractName.CompressionIIILZCompression) {
                const lzDecompressor = getSolver(CodingContractName.CompressionIILZDecompression)

                if (!lzDecompressor) {
                    throw new Error(`Solver not found for contract type: ${constract.type}`);
                }

                if (lzDecompressor.solve(toString(solution)) !== toString(constract.data)) {
                    throw new Error(`Failed to solve contract type: ${constract.type}`);
                }

                continue;
            }

            if (toString(solution) !== toString(constract.solution)) {
                throw new Error(`Failed to solve contract type: ${constract.type}`);
            }
        }

        return true;
    }
}