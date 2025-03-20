import { NS, Singularity } from "@ns";
import { BrokerBase } from "/src/component/broker/broker.base";
import { DarkWebItem, DarkWebItems, DarkWebPrices } from "/src/enum/darkweb.enum";
import {getBitnode} from "/src/repository/bitnode.repository";

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

    public purchasePrograms = async () => {
        if (!this.ns.hasTorRouter()) {
            await this.purchaseTor();
        }

        const sortedPrograms: DarkWebItem[] = Object.values(DarkWebItems).sort((a, b) => a.price - b.price);

        for (const program of sortedPrograms) {
            if (this.ns.fileExists(program.program)) continue;

            await this.secureFunds(program.price);
            this.singularity.purchaseProgram(program.program);

            const message = `Purchased ${program.program}`;
            this.ns.print(message);
            this.ns.toast(message);
        }
    };
}