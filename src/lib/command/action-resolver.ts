import { NS } from "@ns";
import {CrimeType} from "/lib/enum/crime.enum";

export async function main(ns: NS): Promise<void> {
    const focus = ns.singularity.getOwnedAugmentations(true).includes("Neuroreceptor Management Implant");

    ns.singularity.universityCourse("Rothman University", "Algorithms", focus);
    await ns.sleep(1000 * 60 * 3);

    ns.singularity.gymWorkout("Powerhouse Gym", "str", focus);

    await ns.sleep(1000 * 60 * 3);

    ns.singularity.gymWorkout("Powerhouse Gym", "def", focus);

    await ns.sleep(1000 * 60 * 3);

    ns.singularity.gymWorkout("Powerhouse Gym", "dex", focus);

    await ns.sleep(1000 * 60 * 3);

    ns.singularity.gymWorkout("Powerhouse Gym", "agi", focus);

    await ns.sleep(1000 * 60 * 3);

    ns.singularity.commitCrime(CrimeType.Homicide, focus);
}
