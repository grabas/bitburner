export enum FactionEnum {
    CyberSec = "CSEC",
    NiteSec = "avmnite-02h",
    The_Black_Hand = "I.I.I.I",
    BitRunners = "run4theh111z",
    Fulcrum_Secret_Technologies = "fulcrumassets",
    WORLD_DAEMON = "w0r1d_d43m0n"
}

export function isValidFaction(value: string): boolean {
    return Object.values(FactionEnum).includes(value as FactionEnum);
}