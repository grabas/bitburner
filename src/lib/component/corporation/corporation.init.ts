import {NS} from "@ns";
import {CorporationConfig} from "/lib/component/corporation/corporation.config";
import {setColor} from "/lib/utils/helpers/set-color";
import {Colors} from "/lib/enum/colors.enum";

export async function main(ns: NS, print = (msg: any) => ns.tprint(JSON.stringify(msg, null, 2))): Promise<void> {
    if (!ns.corporation.hasCorporation()) {
        if (!ns.corporation.createCorporation(
            CorporationConfig.CORPORATION_NAME,
            ns.getServerMoneyAvailable("home") >= CorporationConfig.CORPORATION_COST
        )) {
            print(setColor("Failed to create corporation", Colors.RED));
        }

        print(setColor("Corporation created.", Colors.GREEN));
    }


    ns.spawn("/lib/component/corporation/corporation.manager.js", {threads: 1, spawnDelay: 500});
}