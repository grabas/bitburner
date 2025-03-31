import { NS, Singularity } from "@ns";
import { BrokerBase } from "/lib/component/broker/broker.base";
import {DarkWebItem, DarkWebItems, DarkWebItemTypeEnum, DarkWebPrices} from "/lib/component/broker/darkweb/darkweb.enum";
import {getBitnode} from "/lib/repository/bitnode.repository";

export class DarkwebBroker extends BrokerBase {
    private readonly singularity: Singularity;

    constructor(ns: NS) {
        super(ns);

        if (!getBitnode().hasAccessSingularity()) {
            throw new Error("You need to have access to the Singularity functions to use the DarkwebBroker");
        }

        this.singularity = ns.singularity;
    }

    private purchaseTor = async () => {
        await this.secureFunds(DarkWebPrices.TorRouter);
        this.singularity.purchaseTor();
    };

    public purchasePrograms = async (noUtility= false, noFormulas = false) => {
        if (!this.ns.hasTorRouter()) {
            await this.purchaseTor();
        }

        const filteredType: DarkWebItemTypeEnum[] = [];
        if (noUtility) filteredType.push(DarkWebItemTypeEnum.Utility);
        if (noFormulas) filteredType.push(DarkWebItemTypeEnum.Formulas);

        const sortedPrograms: DarkWebItem[] = Object.values(DarkWebItems)
            .filter(program => !filteredType.includes(program.type))
            .filter(program => !this.ns.fileExists(program.program))
            .sort((a, b) => a.price - b.price);

        for (const program of sortedPrograms) {
            await this.secureFunds(program.price);
            this.singularity.purchaseProgram(program.program);

            const message = `Purchased ${program.program}`;
            this.ns.print(message);
            this.ns.toast(message);
        }
    };

    public allPurchased= (noUtility= false, noFormulas = false) => {
        if (!this.ns.hasTorRouter()) return false;

        const filteredType: DarkWebItemTypeEnum[] = [];
        if (noUtility) filteredType.push(DarkWebItemTypeEnum.Utility);
        if (noFormulas) filteredType.push(DarkWebItemTypeEnum.Formulas);

        return Object.values(DarkWebItems)
            .filter(program => !filteredType.includes(program.type))
            .every(program => this.ns.fileExists(program.program));
    }
}