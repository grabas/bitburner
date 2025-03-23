import {NS} from "@ns";
import {setBitnode} from "/lib/repository/bitnode.repository";
export const main = async (ns: NS): Promise<void> => {
    await setBitnode();
}
