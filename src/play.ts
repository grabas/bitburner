import {NS} from "@ns";
import {ServerRepository} from "/src/repository/server.repository";
import {ScriptsEnum} from "/src/enum/scripts.enum";
import {Config} from "/src/component/batch/config";
import {HackingFormulas} from "/src/component/batch/hacking-formulas";
import {getHackMultiplier} from "/src/component/batch/formulas";
import {getSave} from "/src/database/save.database";
import {string} from "fast-glob/out/utils";
import {PlayerDto} from "/src/entity/player/player.dto";
import {getPlayerDto} from "/src/repository/player.repository";
import {getBitnode} from "/src/repository/bitnode.repository";

export async function main(ns: NS): Promise<void> {
    const bitnode = await getBitnode();
    const player = await getPlayerDto();
    print(ns, player);
}

const print = (ns: NS, string: any) => ns.tprint(JSON.stringify(string, null, 2));