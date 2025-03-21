import { NS } from "@ns";
import { main as buildDatabase } from '/lib/command/build-server-database';
import { setBitnode } from "/lib/repository/bitnode.repository";
import {COLORS} from "/lib/enum/colors.enum";
import {setColor} from "/lib/utils/helpers/set-color";

export async function main(ns: NS): Promise<void> {
    ns.tprint(setColor("Starting...", COLORS.PURPLE));

    ns.tprint(" ");
    ns.tprint(setColor("Setting bitnode...", COLORS.ORANGE));
    const bitNode = await setBitnode();
    ns.tprint(setColor(`Bitnode ${bitNode.number} set!`, COLORS.GREEN));

    ns.tprint(" ");
    ns.tprint(setColor("Running contract solver daemon...", COLORS.ORANGE));
    const contractSolverPID = ns.run('/lib/command/solve-contracts.js', 1, "--loop", "--safe");

    if (ns.isRunning(contractSolverPID)) {
        ns.tprint(setColor("Contract solver daemon started!", COLORS.GREEN));
    }

    ns.tprint(" ");
    ns.tprint(setColor("Running darkweb broker daemon...", COLORS.ORANGE));
    const darkwebPID = ns.run("/lib/component/broker/darkweb/darkweb.daemon.js", 1, "--no-utility", "--no-formulas");
    if (ns.isRunning(darkwebPID)) {
        ns.tprint(setColor("Darkweb broker daemon started!", COLORS.GREEN));
    }

    ns.tprint(" ");
    ns.tprint(setColor("Running Hacknet Node broker daemon...", COLORS.ORANGE));
    const hacknetPID = ns.run("/lib/component/broker/hacknet/hacknet.daemon.js", 1, "--loop");
    if (ns.isRunning(hacknetPID)) {
        ns.tprint(setColor("Hacknet Node broker daemon started!", COLORS.GREEN));
    }

    ns.tprint(" ");
    ns = await buildDatabase(ns)

    ns.tprint(" ");
    ns.tprint(setColor("Gaining inital access...", COLORS.YELLOW));
    ns.run("/lib/command/gain-access.js", 1);

    ns.tprint(" ");

    ns.tprint(setColor("Running home upgrade broker daemon...", COLORS.ORANGE));
    const homeUpgradePID = ns.run("/lib/component/broker/home-upgrade/home-upgrade.daemon.js", 1, "--loop");
    if (ns.isRunning(homeUpgradePID)) {
        ns.tprint(setColor("Home upgrade daemon started!", COLORS.GREEN));
    }

    ns.tprint(" ");
    ns.tprint(setColor("Running batch attack daemon...", COLORS.ORANGE));

    // Mandatory n00dles visit :)
    const batchAttackPID = ns.run("/lib/component/batch/batch.daemon.js", 1, "n00dles", "--switch");
    if (ns.isRunning(batchAttackPID)) {
        ns.tprint(setColor("Batch attack daemon started!", COLORS.GREEN));
    }



    ns.tprint(" ");
    ns.tprint(setColor("Running gain access command...", COLORS.ORANGE));
    const gainAccessPID = ns.run("/lib/command/gain-access.js", 1, "--loop");
    if (ns.isRunning(gainAccessPID)) {
        ns.tprint(setColor("Gain access command started!", COLORS.GREEN));
    }

    ns.tprint(" ");
    ns.tprint(setColor("We ballin'!", COLORS.PURPLE));
}