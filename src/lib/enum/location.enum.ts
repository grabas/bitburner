import {CorpMaterialName, CorpProductData} from "@ns";

export enum CityName {
    Aevum = "Aevum",
    Chongqing = "Chongqing",
    Sector12 = "Sector-12",
    NewTokyo = "New Tokyo",
    Ishima = "Ishima",
    Volhaven = "Volhaven",
}

export enum LocationName {
    AevumAeroCorp = "AeroCorp",
    AevumBachmanAndAssociates = "Bachman & Associates",
    AevumClarkeIncorporated = "Clarke Incorporated",
    AevumCrushFitnessGym = "Crush Fitness Gym",
    AevumECorp = "ECorp",
    AevumFulcrumTechnologies = "Fulcrum Technologies",
    AevumGalacticCybersystems = "Galactic Cybersystems",
    AevumNetLinkTechnologies = "NetLink Technologies",
    AevumPolice = "Aevum Police Headquarters",
    AevumRhoConstruction = "Rho Construction",
    AevumSnapFitnessGym = "Snap Fitness Gym",
    AevumSummitUniversity = "Summit University",
    AevumWatchdogSecurity = "Watchdog Security",
    AevumCasino = "Iker Molina Casino",

    ChongqingKuaiGongInternational = "KuaiGong International",
    ChongqingSolarisSpaceSystems = "Solaris Space Systems",
    ChongqingChurchOfTheMachineGod = "Church of the Machine God",

    Sector12AlphaEnterprises = "Alpha Enterprises",
    Sector12BladeIndustries = "Blade Industries",
    Sector12CIA = "Central Intelligence Agency",
    Sector12CarmichaelSecurity = "Carmichael Security",
    Sector12CityHall = "Sector-12 City Hall",
    Sector12DeltaOne = "DeltaOne",
    Sector12FoodNStuff = "FoodNStuff",
    Sector12FourSigma = "Four Sigma",
    Sector12IcarusMicrosystems = "Icarus Microsystems",
    Sector12IronGym = "Iron Gym",
    Sector12JoesGuns = "Joe's Guns",
    Sector12MegaCorp = "MegaCorp",
    Sector12NSA = "National Security Agency",
    Sector12PowerhouseGym = "Powerhouse Gym",
    Sector12RothmanUniversity = "Rothman University",
    Sector12UniversalEnergy = "Universal Energy",

    NewTokyoDefComm = "DefComm",
    NewTokyoGlobalPharmaceuticals = "Global Pharmaceuticals",
    NewTokyoNoodleBar = "Noodle Bar",
    NewTokyoVitaLife = "VitaLife",
    NewTokyoArcade = "Arcade",

    IshimaNovaMedical = "Nova Medical",
    IshimaOmegaSoftware = "Omega Software",
    IshimaStormTechnologies = "Storm Technologies",
    IshimaGlitch = "0x6C1",

    VolhavenCompuTek = "CompuTek",
    VolhavenHeliosLabs = "Helios Labs",
    VolhavenLexoCorp = "LexoCorp",
    VolhavenMilleniumFitnessGym = "Millenium Fitness Gym",
    VolhavenNWO = "NWO",
    VolhavenOmniTekIncorporated = "OmniTek Incorporated",
    VolhavenOmniaCybersystems = "Omnia Cybersystems",
    VolhavenSysCoreSecurities = "SysCore Securities",
    VolhavenZBInstituteOfTechnology = "ZB Institute of Technology",

    Hospital = "Hospital",
    Slums = "The Slums",
    TravelAgency = "Travel Agency",
    WorldStockExchange = "World Stock Exchange",
}

export enum LocationType {
    Company = "Company",
    Gym = "Gym",
    Hospital = "Hospital",
    Slums = "Slums",
    Special = "Special",
    StockMarket = "Stock Market",
    TechVendor = "Tech Vendor",
    TravelAgency = "Travel Agency",
    University = "University",
    Casino = "Casino",
}

interface IInfiltrationMetadata {
    maxClearanceLevel: number;
    startingSecurityLevel: number;
}

export interface LocationData {
    city?: CityName | null;
    costMult?: number;
    expMult?: number;
    infiltrationData?: IInfiltrationMetadata;
    types?: LocationType[];
    techVendorMaxRam?: number;
    techVendorMinRam?: number;
}

export const Location: { [key in LocationName]: LocationData } = {
    [LocationName.AevumAeroCorp]: {
        city: CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 12,
            startingSecurityLevel: 8.18,
        },
        types: [LocationType.Company],
    },
    [LocationName.AevumBachmanAndAssociates]: {
        city: CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 15,
            startingSecurityLevel: 8.19,
        },
        types: [LocationType.Company],
    },
    [LocationName.AevumClarkeIncorporated]: {
        city: CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 18,
            startingSecurityLevel: 9.55,
        },
        types: [LocationType.Company],
    },
    [LocationName.AevumCrushFitnessGym]: {
        city: CityName.Aevum,
        costMult: 3,
        expMult: 2,
        types: [LocationType.Gym],
    },
    [LocationName.AevumECorp]: {
        city: CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 37,
            startingSecurityLevel: 17.02,
        },
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 512,
        techVendorMinRam: 128,
    },
    [LocationName.AevumFulcrumTechnologies]: {
        city: CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 25,
            startingSecurityLevel: 15.54,
        },
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 1024,
        techVendorMinRam: 256,
    },
    [LocationName.AevumGalacticCybersystems]: {
        city: CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 12,
            startingSecurityLevel: 7.89,
        },
        types: [LocationType.Company],
    },
    [LocationName.AevumNetLinkTechnologies]: {
        city: CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 6,
            startingSecurityLevel: 3.29,
        },
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 64,
        techVendorMinRam: 8,
    },
    [LocationName.AevumPolice]: {
        city: CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 6,
            startingSecurityLevel: 5.35,
        },
        types: [LocationType.Company],
    },
    [LocationName.AevumRhoConstruction]: {
        city: CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 5,
            startingSecurityLevel: 5.02,
        },
        types: [LocationType.Company],
    },
    [LocationName.AevumSnapFitnessGym]: {
        city: CityName.Aevum,
        costMult: 10,
        expMult: 5,
        types: [LocationType.Gym],
    },
    [LocationName.AevumSummitUniversity]: {
        city: CityName.Aevum,
        costMult: 4,
        expMult: 3,
        types: [LocationType.University],
    },
    [LocationName.AevumWatchdogSecurity]: {
        city: CityName.Aevum,
        infiltrationData: {
            maxClearanceLevel: 7,
            startingSecurityLevel: 5.85,
        },
        types: [LocationType.Company],
    },
    [LocationName.AevumCasino]: {
        city: CityName.Aevum,
        types: [LocationType.Casino],
    },
    [LocationName.ChongqingKuaiGongInternational]: {
        city: CityName.Chongqing,
        infiltrationData: {
            maxClearanceLevel: 25,
            startingSecurityLevel: 16.25,
        },
        types: [LocationType.Company],
    },
    [LocationName.ChongqingSolarisSpaceSystems]: {
        city: CityName.Chongqing,
        infiltrationData: {
            maxClearanceLevel: 18,
            startingSecurityLevel: 12.59,
        },
        types: [LocationType.Company],
    },
    [LocationName.IshimaNovaMedical]: {
        city: CityName.Ishima,
        infiltrationData: {
            maxClearanceLevel: 12,
            startingSecurityLevel: 5.02,
        },
        types: [LocationType.Company],
    },
    [LocationName.IshimaOmegaSoftware]: {
        city: CityName.Ishima,
        infiltrationData: {
            maxClearanceLevel: 10,
            startingSecurityLevel: 3.2,
        },
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 128,
        techVendorMinRam: 4,
    },
    [LocationName.IshimaStormTechnologies]: {
        city: CityName.Ishima,
        infiltrationData: {
            maxClearanceLevel: 25,
            startingSecurityLevel: 5.38,
        },
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 512,
        techVendorMinRam: 32,
    },
    [LocationName.NewTokyoDefComm]: {
        city: CityName.NewTokyo,
        infiltrationData: {
            maxClearanceLevel: 17,
            startingSecurityLevel: 7.18,
        },
        types: [LocationType.Company, LocationType.Special],
    },
    [LocationName.NewTokyoGlobalPharmaceuticals]: {
        city: CityName.NewTokyo,
        infiltrationData: {
            maxClearanceLevel: 20,
            startingSecurityLevel: 5.9,
        },
        types: [LocationType.Company],
    },
    [LocationName.NewTokyoNoodleBar]: {
        city: CityName.NewTokyo,
        infiltrationData: {
            maxClearanceLevel: 5,
            startingSecurityLevel: 2.5,
        },
        types: [LocationType.Company, LocationType.Special],
    },
    [LocationName.NewTokyoVitaLife]: {
        city: CityName.NewTokyo,
        infiltrationData: {
            maxClearanceLevel: 25,
            startingSecurityLevel: 5.52,
        },
        types: [LocationType.Company, LocationType.Special],
    },
    [LocationName.NewTokyoArcade]: {
        city: CityName.NewTokyo,
        types: [LocationType.Special],
    },
    [LocationName.Sector12AlphaEnterprises]: {
        city: CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 10,
            startingSecurityLevel: 3.62,
        },
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 8,
        techVendorMinRam: 2,
    },
    [LocationName.Sector12BladeIndustries]: {
        city: CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 25,
            startingSecurityLevel: 10.59,
        },
        types: [LocationType.Company],
    },
    [LocationName.Sector12CIA]: {
        city: CityName.Sector12,
        types: [LocationType.Company, LocationType.Special],
    },
    [LocationName.Sector12CarmichaelSecurity]: {
        city: CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 15,
            startingSecurityLevel: 4.66,
        },
        types: [LocationType.Company],
    },
    [LocationName.Sector12CityHall]: {
        city: CityName.Sector12,
        types: [LocationType.Special],
    },
    [LocationName.Sector12DeltaOne]: {
        city: CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 12,
            startingSecurityLevel: 5.9,
        },
        types: [LocationType.Company],
    },
    [LocationName.Sector12FoodNStuff]: {
        city: CityName.Sector12,
        types: [LocationType.Company],
    },
    [LocationName.Sector12FourSigma]: {
        city: CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 25,
            startingSecurityLevel: 8.18,
        },
        types: [LocationType.Company],
    },
    [LocationName.Sector12IcarusMicrosystems]: {
        city: CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 17,
            startingSecurityLevel: 6.02,
        },
        types: [LocationType.Company],
    },
    [LocationName.Sector12IronGym]: {
        city: CityName.Sector12,
        expMult: 1,
        costMult: 1,
        types: [LocationType.Gym],
    },
    [LocationName.Sector12JoesGuns]: {
        city: CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 5,
            startingSecurityLevel: 3.13,
        },
        types: [LocationType.Company],
    },
    [LocationName.Sector12MegaCorp]: {
        city: CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 31,
            startingSecurityLevel: 16.36,
        },
        types: [LocationType.Company],
    },
    [LocationName.Sector12NSA]: {
        city: CityName.Sector12,
        types: [LocationType.Company, LocationType.Special],
    },
    [LocationName.Sector12PowerhouseGym]: {
        city: CityName.Sector12,
        costMult: 20,
        expMult: 10,
        types: [LocationType.Gym],
    },
    [LocationName.Sector12RothmanUniversity]: {
        city: CityName.Sector12,
        costMult: 3,
        expMult: 2,
        types: [LocationType.University],
    },
    [LocationName.Sector12UniversalEnergy]: {
        city: CityName.Sector12,
        infiltrationData: {
            maxClearanceLevel: 12,
            startingSecurityLevel: 5.9,
        },
        types: [LocationType.Company],
    },
    [LocationName.VolhavenCompuTek]: {
        city: CityName.Volhaven,
        infiltrationData: {
            maxClearanceLevel: 15,
            startingSecurityLevel: 3.59,
        },
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 256,
        techVendorMinRam: 8,
    },
    [LocationName.VolhavenHeliosLabs]: {
        city: CityName.Volhaven,
        infiltrationData: {
            maxClearanceLevel: 18,
            startingSecurityLevel: 7.28,
        },
        types: [LocationType.Company],
    },
    [LocationName.VolhavenLexoCorp]: {
        city: CityName.Volhaven,
        infiltrationData: {
            maxClearanceLevel: 15,
            startingSecurityLevel: 4.35,
        },
        types: [LocationType.Company],
    },
    [LocationName.VolhavenMilleniumFitnessGym]: {
        city: CityName.Volhaven,
        costMult: 7,
        expMult: 4,
        types: [LocationType.Gym],
    },
    [LocationName.VolhavenNWO]: {
        city: CityName.Volhaven,
        infiltrationData: {
            maxClearanceLevel: 50,
            startingSecurityLevel: 8.53,
        },
        types: [LocationType.Company],
    },
    [LocationName.VolhavenOmniTekIncorporated]: {
        city: CityName.Volhaven,
        infiltrationData: {
            maxClearanceLevel: 25,
            startingSecurityLevel: 7.74,
        },
        types: [LocationType.Company, LocationType.TechVendor],
        techVendorMaxRam: 1024,
        techVendorMinRam: 128,
    },
    [LocationName.VolhavenOmniaCybersystems]: {
        city: CityName.Volhaven,
        infiltrationData: {
            maxClearanceLevel: 22,
            startingSecurityLevel: 6,
        },
        types: [LocationType.Company],
    },
    [LocationName.VolhavenSysCoreSecurities]: {
        city: CityName.Volhaven,
        infiltrationData: {
            maxClearanceLevel: 18,
            startingSecurityLevel: 4.77,
        },
        types: [LocationType.Company],
    },
    [LocationName.VolhavenZBInstituteOfTechnology]: {
        city: CityName.Volhaven,
        costMult: 5,
        expMult: 4,
        types: [LocationType.University],
    },
    [LocationName.Hospital]: {
        city: null,
        types: [LocationType.Hospital],
    },
    [LocationName.Slums]: {
        city: null,
        types: [LocationType.Slums],
    },
    [LocationName.TravelAgency]: {
        city: null,
        types: [LocationType.TravelAgency],
    },
    [LocationName.WorldStockExchange]: {
        city: null,
        types: [LocationType.StockMarket],
    },
    [LocationName.ChongqingChurchOfTheMachineGod]: {
        city: CityName.Chongqing,
        types: [LocationType.Special],
    },
    [LocationName.IshimaGlitch]: {
        city: CityName.Ishima,
        types: [LocationType.Special],
    },
};
