import {Corporation, NS} from "@ns";
import {CorporationDto} from "/lib/component/corporation/dto/corporation.dto";
import {CorporationState} from "/lib/component/corporation/corporation.enum";
import {IStrategy} from "/lib/component/corporation/strategy/strategy.interface";
import {Round1Strategy} from "/lib/component/corporation/strategy/round-1/round-1.strategy";
import {InitialStrategy} from "/lib/component/corporation/strategy/initial/initial.strategy";

export async function main(ns: NS, print = (msg: any) => ns.tprint(JSON.stringify(msg, null, 2))): Promise<void> {
    ns.disableLog("ALL");
    await (new CorporationManager(ns)).manageCorporation()
}

export class CorporationManager {
    private readonly ns: NS;
    private readonly corporation: CorporationDto;
    private readonly corporationApi: Corporation;

    constructor(ns: NS) {
        this.ns = ns;
        this.corporation = new CorporationDto(ns);
        this.corporationApi = ns.corporation;
    }

    public manageCorporation = async () => {
        let currentStrategy = this.getStrategy();
        await currentStrategy.prep();

        while (this.corporation.getState() !== CorporationState.START) {
            await this.ns.sleep(10);
        }

        while (this.corporationApi.hasCorporation()) {
            const currentState = this.corporation.getState();

            switch (currentState) {
                case CorporationState.START:
                    await currentStrategy.start();
                    break;
                case CorporationState.PURCHASE:
                    await currentStrategy.purchase();
                    break;
                case CorporationState.PRODUCTION:
                    await currentStrategy.production();
                    break;
                case CorporationState.EXPORT:
                    await currentStrategy.export();
                    break;
                case CorporationState.SALE:
                    await currentStrategy.sale();
                    break;
            }

            const nextStrategy = currentStrategy.getNextStrategy();

            if (!currentStrategy.conditionSatisfied() || nextStrategy === null) {
                while (this.corporation.getState() === currentState) {
                    await this.ns.sleep(10);
                }

                continue;
            }

            await currentStrategy.finalStep()

            currentStrategy = nextStrategy
            await currentStrategy.prep();

            while (this.corporation.getState() !== CorporationState.START) {
                await this.ns.sleep(10);
            }
        }
    }

    private getStrategy(): IStrategy {
        let strategy: IStrategy = new InitialStrategy(this.ns);
        while (strategy.skip()) {
            const nextStrategy = strategy.getNextStrategy();
            if (!nextStrategy) break;

            strategy = nextStrategy
        }

        return strategy;
    }
}