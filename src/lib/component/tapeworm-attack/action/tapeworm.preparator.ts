import {NS} from "@ns";
import {parseArgs} from "/lib/component/tapeworm-attack/tapeworm.args";
import {TapewormConfig} from "/lib/component/tapeworm-attack/tapeworm.config";

export async function main(ns: NS, args = parseArgs(ns.args)): Promise<void> {
    const target = args.target

    while (ns.getServerSecurityLevel(target) > args.minSecurityLevel) {
        await ns.weaken(target);
    }

    while (ns.getServerMoneyAvailable(target) < args.maxMoney) {
        await ns.grow(target);
    }

    while (ns.getServerSecurityLevel(target) > args.minSecurityLevel) {
        await ns.weaken(target);
    }

    ns.getPortHandle(TapewormConfig.TAPEWORM_PORT_HANDLE)
        .write(JSON.stringify({action: TapewormConfig.RECALIBRATE_PORT_MESSAGE, target: args.target}));
}