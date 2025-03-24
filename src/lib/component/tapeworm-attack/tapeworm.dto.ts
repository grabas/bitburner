import {NS} from "@ns";
import {TapewormFormulas} from "/lib/component/tapeworm-attack/tapeworm.formulas";
import {ServerDto} from "/lib/entity/server/server.dto";
import {TapewormAction} from "/lib/component/tapeworm-attack/tapeworm.interface";
import {ActionScripts} from "/lib/enum/scripts.enum";

export class TapewormDto {
    public action: TapewormAction[]
    constructor(ns: NS, target: ServerDto) {
        const formulas = new TapewormFormulas(ns);
        const threads = formulas.getThreads(ns, target);

        if (!threads) {
            this.action = [{
                script: ActionScripts.TAPEWORM,
                threads: Math.floor(target.ram.max / ActionScripts.TAPEWORM.size),
                args: [target.hostname, target.security.min, target.money.max]
            }];
        } else {
            const [hackingThreads, weakenHackThreads, growThreads, weakenGrowThreads] = threads;

            this.action = [
                {
                    script: ActionScripts.TAPEWORM_HACK,
                    threads: hackingThreads,
                    args: [
                        target.hostname,
                        formulas.getHackSleepTime(target)
                    ]
                },{
                    script: ActionScripts.TAPEWORM_WEAKEN,
                    threads: weakenHackThreads,
                    args: [
                        target.hostname,
                        formulas.getWeakenSleepTime()
                    ]
                },{
                    script: ActionScripts.TAPEWORM_GROW,
                    threads: growThreads,
                    args: [
                        target.hostname,
                        formulas.getGrowSleepTime(target)
                    ]
                },{
                    script: ActionScripts.TAPEWORM_WEAKEN,
                    threads: weakenGrowThreads,
                    args: [
                        target.hostname,
                        formulas.getWeakenSleepTime(2)
                    ]
                },
            ]
        }
    }
}