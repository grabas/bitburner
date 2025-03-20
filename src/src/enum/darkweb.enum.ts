export enum CompletedProgramName {
    bruteSsh = "BruteSSH.exe",
    ftpCrack = "FTPCrack.exe",
    relaySmtp = "relaySMTP.exe",
    httpWorm = "HTTPWorm.exe",
    sqlInject = "SQLInject.exe",
    deepScan1 = "DeepscanV1.exe",
    deepScan2 = "DeepscanV2.exe",
    serverProfiler = "ServerProfiler.exe",
    autoLink = "AutoLink.exe",
    formulas = "Formulas.exe",
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

export type DarkWebItem = {
    program: CompletedProgramName;
    price: number;
    description: string;
}

export const DarkWebItems: { [key: string]: DarkWebItem } = {
    BruteSSHProgram: {
        program: CompletedProgramName.bruteSsh,
        price: DarkWebPrices.BruteSSHProgram,
        description: "Opens up SSH Ports."
    },
    FTPCrackProgram: {
        program: CompletedProgramName.ftpCrack,
        price: DarkWebPrices.FTPCrackProgram,
        description: "Opens up FTP Ports."
    },
    RelaySMTPProgram: {
        program: CompletedProgramName.relaySmtp,
        price: DarkWebPrices.RelaySMTPProgram,
        description: "Opens up SMTP Ports."
    },
    HTTPWormProgram: {
        program: CompletedProgramName.httpWorm,
        price: DarkWebPrices.HTTPWormProgram,
        description: "Opens up HTTP Ports."
    },
    SQLInjectProgram: {
        program: CompletedProgramName.sqlInject,
        price: DarkWebPrices.SQLInjectProgram,
        description: "Opens up SQL Ports."
    },
    ServerProfiler: {
        program: CompletedProgramName.serverProfiler,
        price: DarkWebPrices.ServerProfiler,
        description: "Displays detailed server information."
    },
    DeepscanV1: {
        program: CompletedProgramName.deepScan1,
        price: DarkWebPrices.DeepscanV1,
        description: "Enables 'scan-analyze' with a depth up to 5."
    },
    DeepscanV2: {
        program: CompletedProgramName.deepScan2,
        price: DarkWebPrices.DeepscanV2,
        description: "Enables 'scan-analyze' with a depth up to 10."
    },
    AutolinkProgram: {
        program: CompletedProgramName.autoLink,
        price: DarkWebPrices.AutolinkProgram,
        description: "Enables direct connect via 'scan-analyze'."
    },
    FormulasProgram: {
        program: CompletedProgramName.formulas,
        price: DarkWebPrices.FormulasProgram,
        description: "Unlock access to the formulas API."
    },
};