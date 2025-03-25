import { NS } from "@ns";
import BatchAttackDashboard from "/react-component/dashboard/BatchAttackDashboard";
import React from "/react-component/react";
import {sleep} from "/lib/utils/sleep";

export async function main(ns: NS) {
    ns.disableLog("ALL");
    ns.ui.openTail()
    ns.ui.resizeTail(500, 940)
    ns.ui.moveTail(1020, 25)
    ns.clearLog()

    ns.printRaw(<BatchAttackDashboard ns={ns} portNumber={ns.args[0] as number} />)

    // eslint-disable-next-line no-constant-condition
    while (true) {
        await sleep(500);
    }
}