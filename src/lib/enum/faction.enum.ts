export enum FactionName {
    Illuminati = "Illuminati",
    Daedalus = "Daedalus",
    TheCovenant = "The Covenant",
    ECorp = "ECorp",
    MegaCorp = "MegaCorp",
    BachmanAssociates = "Bachman & Associates",
    BladeIndustries = "Blade Industries",
    NWO = "NWO",
    ClarkeIncorporated = "Clarke Incorporated",
    OmniTekIncorporated = "OmniTek Incorporated",
    FourSigma = "Four Sigma",
    KuaiGongInternational = "KuaiGong International",
    FulcrumSecretTechnologies = "Fulcrum Secret Technologies",
    BitRunners = "BitRunners",
    TheBlackHand = "The Black Hand",
    NiteSec = "NiteSec",
    Aevum = "Aevum",
    Chongqing = "Chongqing",
    Ishima = "Ishima",
    NewTokyo = "New Tokyo",
    Sector12 = "Sector-12",
    Volhaven = "Volhaven",
    SpeakersForTheDead = "Speakers for the Dead",
    TheDarkArmy = "The Dark Army",
    TheSyndicate = "The Syndicate",
    Silhouette = "Silhouette",
    Tetrads = "Tetrads",
    SlumSnakes = "Slum Snakes",
    Netburners = "Netburners",
    TianDiHui = "Tian Di Hui",
    CyberSec = "CyberSec",
    Bladeburners = "Bladeburners",
    ChurchOfTheMachineGod = "Church of the Machine God",
    ShadowsOfAnarchy = "Shadows of Anarchy",
}

export const FactionServers = {
    [FactionName.FulcrumSecretTechnologies]: "fulcrumassets",
    [FactionName.CyberSec]: "CSEC",
    [FactionName.NiteSec]: "avmnite-02h",
    [FactionName.TheBlackHand]: "I.I.I.I",
    [FactionName.BitRunners]: "run4theh111z",
    [FactionName.TheDarkArmy]: ".",
    [FactionName.Daedalus]: "The-Cave"
}

export const SpecialServers = {
    ...FactionServers,
    WorldDaemon: "w0r1d_d43m0n",
    DarkWeb: "darkweb",
};

export function isSpecialServer(value: string): boolean {
    return Object.values(SpecialServers).includes(value);
}