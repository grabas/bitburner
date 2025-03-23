import {NS} from "@ns";
import {setBitnode} from "/lib/repository/bitnode.repository";
import {setColor} from "/lib/utils/helpers/set-color";
import {Colors} from "/lib/enum/colors.enum";
export const main = async (ns: NS): Promise<void> => {
    ns.tprint(setColor("Setting bitnode...", Colors.ORANGE));
    await setBitnode();
    ns.tprint(setColor("Bitnode set", Colors.GREEN));
}
