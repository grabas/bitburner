export enum CompletedProgramName {
    BruteSsh = "BruteSSH.exe",
    FtpCrack = "FTPCrack.exe",
    RelaySmtp = "relaySMTP.exe",
    HttpWorm = "HTTPWorm.exe",
    SqlInject = "SQLInject.exe",
    DeepScan1 = "DeepscanV1.exe",
    DeepScan2 = "DeepscanV2.exe",
    ServerProfiler = "ServerProfiler.exe",
    AutoLink = "AutoLink.exe",
    Formulas = "Formulas.exe",
}

export enum DarkWebPrices {
    TorRouter = 200e3,
    BruteSSHProgram = 500e3,
    FTPCrackProgram = 1500e3,
    RelaySMTPProgram = 5e6,
    HTTPWormProgram = 30e6,
    SQLInjectProgram = 250e6,
    ServerProfiler = 500e3,
    DeepscanV1 = 500e3,
    DeepscanV2 = 25e6,
    AutolinkProgram = 1e6,
    FormulasProgram = 5e9,
}

export enum DarkWebItemTypeEnum {
    Crack = "crack",
    Formulas = "formulas",
    Utility = "utility"
}

export type DarkWebItem = {
    program: CompletedProgramName;
    price: number;
    description: string;
    type: DarkWebItemTypeEnum;
}

export const DarkWebItems: { [key: string]: DarkWebItem } = {
    BruteSSHProgram: {
        program: CompletedProgramName.BruteSsh,
        price: DarkWebPrices.BruteSSHProgram,
        description: "Opens up SSH Ports.",
        type: DarkWebItemTypeEnum.Crack
    },
    FTPCrackProgram: {
        program: CompletedProgramName.FtpCrack,
        price: DarkWebPrices.FTPCrackProgram,
        description: "Opens up FTP Ports.",
        type: DarkWebItemTypeEnum.Crack
    },
    RelaySMTPProgram: {
        program: CompletedProgramName.RelaySmtp,
        price: DarkWebPrices.RelaySMTPProgram,
        description: "Opens up SMTP Ports.",
        type: DarkWebItemTypeEnum.Crack
    },
    HTTPWormProgram: {
        program: CompletedProgramName.HttpWorm,
        price: DarkWebPrices.HTTPWormProgram,
        description: "Opens up HTTP Ports.",
        type: DarkWebItemTypeEnum.Crack
    },
    SQLInjectProgram: {
        program: CompletedProgramName.SqlInject,
        price: DarkWebPrices.SQLInjectProgram,
        description: "Opens up SQL Ports.",
        type: DarkWebItemTypeEnum.Crack
    },
    ServerProfiler: {
        program: CompletedProgramName.DeepScan1,
        price: DarkWebPrices.ServerProfiler,
        description: "Displays detailed server information.",
        type: DarkWebItemTypeEnum.Utility
    },
    DeepscanV1: {
        program: CompletedProgramName.DeepScan2,
        price: DarkWebPrices.DeepscanV1,
        description: "Enables 'scan-analyze' with a depth up to 5.",
        type: DarkWebItemTypeEnum.Utility
    },
    DeepscanV2: {
        program: CompletedProgramName.ServerProfiler,
        price: DarkWebPrices.DeepscanV2,
        description: "Enables 'scan-analyze' with a depth up to 10.",
        type: DarkWebItemTypeEnum.Utility
    },
    AutolinkProgram: {
        program: CompletedProgramName.AutoLink,
        price: DarkWebPrices.AutolinkProgram,
        description: "Enables direct connect via 'scan-analyze'.",
        type: DarkWebItemTypeEnum.Utility
    },
    FormulasProgram: {
        program: CompletedProgramName.Formulas,
        price: DarkWebPrices.FormulasProgram,
        description: "Unlock access to the formulas API.",
        type: DarkWebItemTypeEnum.Formulas
    },
};