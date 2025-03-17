import {FactionName} from "/src/enum/faction.enum";
import {Bitnode} from "/src/entity/bitnode/bitnode";

interface Hp {
    current: number,
    max: number
}

type StatBlock = {
    hacking: number;
    strength: number;
    defense: number;
    dexterity: number;
    agility: number;
    charisma: number;
    intelligence: number;
};

interface Mults {
    hacking_chance: number,
    hacking_speed: number,
    hacking_money: number,
    hacking_grow: number,
    hacking: number,
    hacking_exp: number,
    strength: number,
    strength_exp: number,
    defense: number,
    defense_exp: number,
    dexterity: number,
    dexterity_exp: number,
    agility: number,
    agility_exp: number,
    charisma: number,
    charisma_exp: number,
    hacknet_node_money: number,
    hacknet_node_purchase_cost: number,
    hacknet_node_ram_cost: number,
    hacknet_node_core_cost: number,
    hacknet_node_level_cost: number,
    company_rep: number,
    faction_rep: number,
    work_money: number,
    crime_success: number,
    crime_money: number,
    bladeburner_max_stamina: number,
    bladeburner_stamina_gain: number,
    bladeburner_analysis: number,
    bladeburner_success_chance: number
}

interface BitNodeOptions {
    sourceFileOverrides: {
        ctor: string;
        data: any[];
    };
    restrictHomePCUpgrade: boolean;
    disableGang: boolean;
    disableCorporation: boolean;
    disableBladeburner: boolean;
    disable4SData: boolean;
    disableHacknetServer: boolean;
    disableSleeveExpAndAugmentation: boolean;
    intelligenceOverride: bumber | undefined;
}

export class PlayerDto {
    hp: Hp;
    exp: StatBlock;
    skills: StatBlock;
    money: number;
    karma: number;
    city: string;
    bitnode: Bitnode;
    bitNodeOptions: BitNodeOptions;
    mults: Mults;
    factions: FactionName[]
    factionInvitations: FactionName[]

    constructor(data: any) {
        this.hp = data.hp;
        this.exp = data.exp;
        this.skills = data.skills;
        this.money = data.money;
        this.karma = data.karma;
        this.city = data.city;
        this.bitnode = new Bitnode(data.bitNodeN);
        this.bitNodeOptions = data.bitNodeOptions;
        this.mults = data.mults;
        this.factions = data.factions;
        this.factionInvitations = data.factionInvitations;
    }
}