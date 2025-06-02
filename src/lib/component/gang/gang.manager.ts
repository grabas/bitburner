import {NS} from "@ns";
import {Gang} from "/lib/component/gang/gang";

export async function main(ns: NS): Promise<void> {
    ns.disableLog("ALL");
    const manager = new GangManager(ns);
    await manager.manage();
}

export class GangManager {
    private readonly ns: NS;
    private readonly gang: Gang;

    constructor(ns: NS) {
        this.ns = ns;
        this.gang = new Gang(ns);
    }

    public async manage() {
        let prevPower = this.getTotalPower();

        let lastTickTime = Date.now();
        let tickInterval = 0;
        let lowestInterval = Infinity;
        let firstTick = true;
        let notifiedForNextTick = false;

        let cycle = 0
        // eslint-disable-next-line no-constant-condition
        while (true) {
            this.gang.recruit();
            this.gang.equipMembers();

            const currentTime = Date.now();
            const currentPower = this.getTotalPower();

            if (currentPower !== prevPower || currentPower === 0) {
                this.gang.engageInTerritoryClash();
                this.gang.assignTasks();

                tickInterval = currentTime - lastTickTime;
                lastTickTime = currentTime;
                notifiedForNextTick = false;

                if (!firstTick) {
                    lowestInterval = cycle % 5 === 0 ? tickInterval : Math.min(lowestInterval, tickInterval);
                } else {
                    firstTick = false;
                }

                prevPower = currentPower;
            }

            if (lowestInterval !== Infinity) {
                const predictedNextTickTime = lastTickTime + lowestInterval;
                const timeUntilNextTick = predictedNextTickTime - currentTime;

                if (timeUntilNextTick <= 1000 && !notifiedForNextTick && !this.gang.controlsTerritory()) {
                    this.gang.engageInTerritoryWarfare();
                    notifiedForNextTick = true;
                }
            }

            cycle++;
            await this.ns.sleep(10);
        }
    }

    private getTotalPower(): number {
        return Object.entries(this.ns.gang.getOtherGangInformation()).filter(([name, info]) => {
            return name !== this.gang.faction && info.territory > 0;
        }).reduce((acc, [_, info]) => acc + info.power, 0);
    }
}