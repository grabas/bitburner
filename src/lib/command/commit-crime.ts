import { NS } from "@ns";
import {CrimeType} from "/lib/enum/crime.enum";

export async function main(ns: NS): Promise<void> {
    ns.singularity.commitCrime(ns.args[0] as CrimeType, false);
}
