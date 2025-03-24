import {NS} from "@ns";
import {parseActionArgs} from "/lib/component/tapeworm-attack/tapeworm.args";
import {TapewormConfig} from "/lib/component/tapeworm-attack/tapeworm.config";

export async function main(ns: NS, args = parseActionArgs(ns.args)): Promise<void> {
    const isPostGrowWeaken = args.sleepTime > 0;

    let cycle = 0;
    while (true) {
        await ns.sleep(args.sleepTime);
        await ns.weaken(args.target);

        if (isPostGrowWeaken && ++cycle >= TapewormConfig.RECALIBRATION_CYCLE_TRIGGER) {
            ns.getPortHandle(TapewormConfig.TAPEWORM_PORT_HANDLE)
                .write(JSON.stringify({action: TapewormConfig.RECALIBRATE_PORT_MESSAGE, target: args.target}));
            cycle = 0;
        }
    }
}