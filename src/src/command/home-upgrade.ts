import {NS} from "@ns";

export async function main(ns: NS) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (ns.singularity.getUpgradeHomeRamCost() > ns.getServerMoneyAvailable("home")) {
            await ns.sleep(1000);
        } else {
            ns.singularity.upgradeHomeRam();
        }
    }
}
