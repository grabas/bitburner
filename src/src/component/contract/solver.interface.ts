import {CodingContractAnswer, CodingContractData, CodingContractName, CodingContractSignatures} from "@ns";

export interface ISolver<T extends keyof CodingContractSignatures> {
    solve(data: CodingContractData<T>): CodingContractAnswer<T>;
    getType(): CodingContractName;
}