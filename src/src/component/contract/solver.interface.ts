import {CodingContractName, CodingContractSignatures, CodingContractData, CodingContractAnswer} from "/src/enum/contract-names.enum";

export interface ISolver<T extends keyof CodingContractSignatures> {
    solve(data: CodingContractData<T>): CodingContractAnswer<T>;
    getType(): CodingContractName;
}