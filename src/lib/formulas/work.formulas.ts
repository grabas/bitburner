import {NS} from "@ns";
import {Location, LocationName} from "/lib/enum/location.enum";
import {Classes, GymType, UniversityClassType, WorkStats} from "/lib/enum/classes.enum";
import {Multipliers} from "/lib/formulas/formulas.multipliers";
import {getBitnode} from "/lib/repository/bitnode.repository";

function isGymType(type: UniversityClassType | GymType): type is GymType {
    return Object.values(GymType).includes(type as GymType);
}

export class WorkFormulas {
    private readonly ns: NS;
    constructor(ns: NS) {
        this.ns = ns;
    }

    public calculateClassEarnings = (type: UniversityClassType|GymType, locationName: LocationName) => {
        const location = Location[locationName];

        if (!location) throw new Error(`Invalid location: ${locationName}`);

        const hashManager =  this.ns.hacknet;

        const classs = Classes[type];
        const hashMult = isGymType(type) ? hashManager.getTrainingMult() : hashManager.getStudyMult();

        const earnings = this.multWorkStats(
            this.scaleWorkStats(classs.earnings, (location.expMult ?? 0 / 5) * hashMult, false),
            this.ns.getPlayer().mults,
        );

        earnings.money = classs.earnings.money * (location.costMult ?? 0) / 5;
        return this.processWorkStats(earnings);
    }

    private multWorkStats(workStats: Partial<WorkStats>, mults: Multipliers, moneyMult = 1, repMult = 1) {
        return {
            money: (workStats.money ?? 0) * moneyMult,
            reputation: (workStats.reputation ?? 0) * repMult,
            hackExp: (workStats.hackExp ?? 0) * mults.hacking_exp,
            strExp: (workStats.strExp ?? 0) * mults.strength_exp,
            defExp: (workStats.defExp ?? 0) * mults.defense_exp,
            dexExp: (workStats.dexExp ?? 0) * mults.dexterity_exp,
            agiExp: (workStats.agiExp ?? 0) * mults.agility_exp,
            chaExp: (workStats.chaExp ?? 0) * mults.charisma_exp,
            intExp: workStats.intExp ?? 0,
        };
    }

    private scaleWorkStats = (w: WorkStats, n: number, scaleMoney = true): WorkStats => {
        const m = scaleMoney ? n : 1;
        return {
            money: w.money * m,
            reputation: w.reputation * n,
            hackExp: w.hackExp * n,
            strExp: w.strExp * n,
            defExp: w.defExp * n,
            dexExp: w.dexExp * n,
            agiExp: w.agiExp * n,
            chaExp: w.chaExp * n,
            intExp: w.intExp * n,
        };
    };

    private processWorkStats(workStats: WorkStats): WorkStats {
        const bitNodeOptions = getBitnode().options
        if (bitNodeOptions.disableSleeveExpAndAugmentation && "shock" in this.ns.getPlayer()) {
            workStats.hackExp = 0;
            workStats.strExp = 0;
            workStats.defExp = 0;
            workStats.dexExp = 0;
            workStats.agiExp = 0;
            workStats.chaExp = 0;
            workStats.intExp = 0;
        }
        return workStats;
    }
}