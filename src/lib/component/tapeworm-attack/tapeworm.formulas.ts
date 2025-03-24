import {NS} from "@ns";
import {ServerDto} from "/lib/entity/server/server.dto";
import {HackingFormulas} from "/lib/formulas/hacking.formulas";
import {TapewormConfig} from "/lib/component/tapeworm-attack/tapeworm.config";

export class TapewormFormulas extends HackingFormulas {
    constructor(ns: NS) {
        super(ns);
    }

    public getWeakenSleepTime = (multiplier = 0): number => {
        return TapewormConfig.TICK * multiplier;
    }

    public getGrowSleepTime = (target: ServerDto, idealistic = false): number => {
        return this.calculateWeakenTime(target, idealistic) + TapewormConfig.TICK - this.calculateGrowTime(target, idealistic);
    }

    public getHackSleepTime = (target: ServerDto, idealistic = false): number => {
        const hacktime = this.calculateHackTime(target, idealistic);
        return this.calculateWeakenTime(target, idealistic) - TapewormConfig.TICK - hacktime;
    }

    public getThreads(ns: NS, target: ServerDto): number[]|null {
        const idealistic = true;
        const hackingFormulas = new HackingFormulas(ns);

        const threads = Array.from({ length: TapewormConfig.MAX_MULTIPLIER * 1000 }, (_, i) => {
            const hackMultiplier = (i + 1) / 1000;

            const hackingThreads = hackingFormulas.getHackThreads(target, hackMultiplier, idealistic);
            const targetAmount = hackingFormulas.getHackMoney(target, hackingThreads, idealistic);
            const growThreads = hackingFormulas.getGrowThreads(target, target, target.money.max - targetAmount, idealistic)

            const weakenHackThreads = hackingFormulas.calculateWeakenThreads(
                target,
                target,
                hackingFormulas.getHackSecurity(hackingThreads)
            )

            const weakenGrowThreads = hackingFormulas.calculateWeakenThreads(target, target,
                hackingFormulas.getGrowSecurity(growThreads)
            )

            const totalRam = (hackingThreads * 1.7) + (growThreads * 1.75) + (weakenHackThreads * 1.75) + (weakenGrowThreads * 1.75);

            if (totalRam > target.ram.max || hackingThreads === Infinity) {
                return null;
            }

            return [hackingThreads, weakenHackThreads, growThreads, weakenGrowThreads]
        }).filter((threads: number[] | null) => threads !== null);

        return threads.length ? threads[threads.length - 1] : null;
    }
}