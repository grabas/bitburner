import {CodingContractName, CodingContractSignatures, CodingContractData, CodingContractAnswer} from "/lib/component/contract/contract-names.enum";

export interface ISolver<T extends keyof CodingContractSignatures> {
    solve(data: CodingContractData<T>): CodingContractAnswer<T>;
    getType(): CodingContractName;
}

export interface ContractSolution {
    type: CodingContractName,
    file: string;
    server: string;
    solution: string;
}