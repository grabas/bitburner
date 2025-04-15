import {Corporation, Material, NS, Product} from "@ns";
import {OfficeDto} from "/lib/component/corporation/dto/office.dto";
import {
    CorpBaseResearchName,
    CorpEmployeeJob,
    CorpMaterialName,
    IndustriesData,
    MaterialInfo
} from "/lib/component/corporation/corporation.enum";
import {CorporationMultiplers} from "/lib/component/corporation/dto/corporation-multiplers";
import {evaluateSellPrice} from "/lib/component/corporation/helpers/parse-amount-string";

export class CorporationFormulas {
    private readonly ns: NS;
    private corporationApi: Corporation;
    private corporationMultipliers: CorporationMultiplers;

    constructor(ns: NS) {
        this.ns = ns;
        this.corporationApi = ns.corporation;
        this.corporationMultipliers = new CorporationMultiplers(ns);
    }

    public getOfficeRawMaterialProduction(
        operationsProd: number,
        engineerProd: number,
        managementProd: number,
        office: OfficeDto,
        idealistic = false
    ): number {
        const productivity = this.calculateEmployeeProductivity(office, idealistic)

        operationsProd *= productivity[CorpEmployeeJob.Operations];
        engineerProd *= productivity[CorpEmployeeJob.Engineer];
        managementProd *= productivity[CorpEmployeeJob.Management];

        const totalProduction = operationsProd + engineerProd + managementProd;
        const managementFactor = 1 + (managementProd / (1.2 * totalProduction));

        const employeeProductionMultiplier = (Math.pow(operationsProd, 0.4) + Math.pow(engineerProd, 0.3)) * managementFactor * 0.05;

        return employeeProductionMultiplier * office.division.multipliers.getProductionMultiplier() * this.corporationMultipliers.getProdMultiplier() * office.division.multipliers.getResearchProducionMultiplier()
    }

    public getOptimalEmployeeDistributionResearch(office: OfficeDto): { [key in CorpEmployeeJob]: number } {
        const interns = this.getInterns(office);

        return {
            [CorpEmployeeJob.Operations]: 0,
            [CorpEmployeeJob.Engineer]: 0,
            [CorpEmployeeJob.Business]: 0,
            [CorpEmployeeJob.Management]: 0,
            [CorpEmployeeJob.RandD]: office.getNumEmployees() - interns,
            [CorpEmployeeJob.Intern]: interns,
            [CorpEmployeeJob.Unassigned]: 0
        };
    }

    public getOptimalEmployeeDistribution(office: OfficeDto): { [key in CorpEmployeeJob]: number } {
        const interns = this.getInterns(office);
        const rndEmployees = this.getRnDEmployees(office);
        const totalEmployees = office.getNumEmployees() - interns - rndEmployees;

        let best = {
            [CorpEmployeeJob.Operations]: 0,
            [CorpEmployeeJob.Engineer]: 0,
            [CorpEmployeeJob.Business]: 0,
            [CorpEmployeeJob.Management]: 0,
            [CorpEmployeeJob.RandD]: rndEmployees,
            [CorpEmployeeJob.Intern]: interns,
            [CorpEmployeeJob.Unassigned]: 0
        };

        let bestProduction = 0;
        for (let ops = 0; ops <= totalEmployees; ops++) {
            for (let eng = 0; eng <= totalEmployees - ops; eng++) {
                for (let bus = 1; bus <= totalEmployees - ops - eng; bus++) {
                    const mng = totalEmployees - ops - eng - bus;
                    const production = this.getOfficeRawMaterialProduction(ops, eng, mng, office);

                    if (production > bestProduction) {
                        best = {
                            [CorpEmployeeJob.Operations]: ops,
                            [CorpEmployeeJob.Engineer]: eng,
                            [CorpEmployeeJob.Business]: bus,
                            [CorpEmployeeJob.Management]: mng,
                            [CorpEmployeeJob.RandD]: rndEmployees,
                            [CorpEmployeeJob.Intern]: interns,
                            [CorpEmployeeJob.Unassigned]: 0
                        };

                        bestProduction = production;
                    }
                }
            }
        }

        return best;
    }

    public getOptimalProductEmployeeDistribution(office: OfficeDto, mainCity= false): { [key in CorpEmployeeJob]: number } {
        const interns = this.getInterns(office);

        if (mainCity) {
            const rndEmployees = Math.floor((office.getNumEmployees() - interns) * 0.40)
            return {
                [CorpEmployeeJob.Operations]: 1,
                [CorpEmployeeJob.Engineer]: office.getNumEmployees() - interns - rndEmployees - 3,
                [CorpEmployeeJob.Business]: 1,
                [CorpEmployeeJob.Management]: 1,
                [CorpEmployeeJob.RandD]: rndEmployees,
                [CorpEmployeeJob.Intern]: interns,
                [CorpEmployeeJob.Unassigned]: 0
            };
        }


        const rndEmployees = Math.floor((office.getNumEmployees() - interns) * 0.75)
        const totalEmployees = office.getNumEmployees() - interns - rndEmployees;

        let best = {
            [CorpEmployeeJob.Operations]: 0,
            [CorpEmployeeJob.Engineer]: 0,
            [CorpEmployeeJob.Business]: 0,
            [CorpEmployeeJob.Management]: 0,
            [CorpEmployeeJob.RandD]: rndEmployees,
            [CorpEmployeeJob.Intern]: interns,
            [CorpEmployeeJob.Unassigned]: 0
        };

        let bestProduction = 0;
        for (let ops = 0; ops <= totalEmployees; ops++) {
            for (let eng = 0; eng <= totalEmployees - ops; eng++) {
                for (let bus = 1; bus <= totalEmployees - ops - eng; bus++) {
                    const mng = totalEmployees - ops - eng - bus;
                    const production = this.getOfficeRawMaterialProduction(ops, eng, mng, office);

                    if (production > bestProduction) {
                        best = {
                            [CorpEmployeeJob.Operations]: ops,
                            [CorpEmployeeJob.Engineer]: eng,
                            [CorpEmployeeJob.Business]: bus,
                            [CorpEmployeeJob.Management]: mng,
                            [CorpEmployeeJob.RandD]: rndEmployees,
                            [CorpEmployeeJob.Intern]: interns,
                            [CorpEmployeeJob.Unassigned]: 0
                        };

                        bestProduction = production;
                    }
                }
            }
        }

        return best;
    }

    public getOptimalEmployeeDistributionProfit(office: OfficeDto): { [key in CorpEmployeeJob]: number } {
        const interns = this.getInterns(office);
        const rndEmployees = this.getRnDEmployees(office);
        const totalEmployees = office.getNumEmployees() - interns - rndEmployees;

        let best = {
            [CorpEmployeeJob.Operations]: 1,
            [CorpEmployeeJob.Engineer]: 1,
            [CorpEmployeeJob.Business]: 1,
            [CorpEmployeeJob.Management]: 1,
            [CorpEmployeeJob.RandD]: rndEmployees,
            [CorpEmployeeJob.Intern]: interns,
            [CorpEmployeeJob.Unassigned]: 0
        } as { [key in CorpEmployeeJob]: number };

        let bestProfit = -Infinity;

        // Brute-force search over all splits of the remaining employees.
        for (let ops = 0; ops <= totalEmployees; ops++) {
            for (let eng = 0; eng <= totalEmployees - ops; eng++) {
                for (let bus = 0; bus <= totalEmployees - ops - eng; bus++) {
                    const mng = totalEmployees - ops - eng - bus;
                    const production = this.getOfficeRawMaterialProduction(ops, eng, mng, office);
                    let totalRevenue = 0;

                    for (const item of office.getProducedMaterials()) {
                        const saleVolume = this.getMaterialSalesVolume(item, office, bus);
                        const optimalPrice = this.getOptimalMaterialPrice(item);
                        totalRevenue += Math.min(production, saleVolume) * optimalPrice;
                    }

                    if (totalRevenue > bestProfit) {
                        best = {
                            [CorpEmployeeJob.Operations]: ops,
                            [CorpEmployeeJob.Engineer]: eng,
                            [CorpEmployeeJob.Business]: bus,
                            [CorpEmployeeJob.Management]: mng,
                            [CorpEmployeeJob.RandD]: rndEmployees,
                            [CorpEmployeeJob.Intern]: interns,
                            [CorpEmployeeJob.Unassigned]: 0
                        };
                        bestProfit = totalRevenue
                    }
                }
            }
        }

        return best
    }

    private calculateEmployeeProductivity(office: OfficeDto, idealistic = false): { [key in CorpEmployeeJob]: number } {
        const effCre = 75 * this.corporationMultipliers.getEmployeeCreMultiplier() * office.division.multipliers.getEmployeeCreMultiplier(),
            effCha = 75 * this.corporationMultipliers.getEmployeeChaMultiplier() * office.division.multipliers.getEmployeeChaMultiplier(),
            effInt = 75 * this.corporationMultipliers.getEmployeeIntMultiplier() * office.division.multipliers.getEmployeeIntMultiplier(),
            effEff = 75 * this.corporationMultipliers.getEmployeeEffMultiplier() * office.division.multipliers.getEmployeeEffMultiplier();

        const prodBase = (idealistic ? 100 : office.getMorale()) * (idealistic ? 100 : office.getEnergy()) * 1e-4;
        const exp = office.getTotalExperience() / office.getNumEmployees() || 0;

        const employeeProductionByJob = {
            [CorpEmployeeJob.Operations]: 0,
            [CorpEmployeeJob.Engineer]: 0,
            [CorpEmployeeJob.Business]: 0,
            [CorpEmployeeJob.Management]: 0,
            [CorpEmployeeJob.RandD]: 0,
            [CorpEmployeeJob.Unassigned]: 0,
            [CorpEmployeeJob.Intern]: 0,
        }

        for (const name of Object.values(CorpEmployeeJob)) {
            let prodMult = 0;
            switch (name) {
                case CorpEmployeeJob.Operations:
                    prodMult = 0.6 * effInt + 0.1 * effCha + exp + 0.5 * effCre + effEff;
                    break;
                case CorpEmployeeJob.Engineer:
                    prodMult = effInt + 0.1 * effCha + 1.5 * exp + effEff;
                    break;
                case CorpEmployeeJob.Business:
                    prodMult = 0.4 * effInt + effCha + 0.5 * exp;
                    break;
                case CorpEmployeeJob.Management:
                    prodMult = 2 * effCha + exp + 0.2 * effCre + 0.7 * effEff;
                    break;
                case CorpEmployeeJob.RandD:
                    prodMult = 1.5 * effInt + 0.8 * exp + effCre + 0.5 * effEff;
                    break;
                case CorpEmployeeJob.Unassigned:
                case CorpEmployeeJob.Intern:
            }
            employeeProductionByJob[name] = prodMult * prodBase;
        }

        return employeeProductionByJob;
    }

    public getSaleVolume(office: OfficeDto, businessEmployees: number): number {
        let max = -Infinity;
        for (const item of office.getProducedMaterials()) {
            const salesVolume = this.getMaterialSalesVolume(item, office, businessEmployees);

            let totalExports = 0;
            for (const exportData of item.exports) {
                totalExports += parseFloat(exportData.amount) / 10
            }

            max = Math.max(max, salesVolume - totalExports);
        }

        return max;
    }

    public getMaterialSalesVolume(item: Material, office: OfficeDto, businessEmployees: number): number {
        const itemMultiplier = item.quality + 0.001;
        const businessFactor = this.getBusinessFactor(office, businessEmployees);
        const advertFactor = this.getAdvertisingFactors(office)[0]
        const marketFactor = this.getMarketFactor(item);
        const corporationMultiplier = (new CorporationMultiplers(this.ns)).getSalesMultiplier();
        const markupMultiplier = this.calculateMarkupMultiplier(item);

        return itemMultiplier * businessFactor * advertFactor * marketFactor * corporationMultiplier * markupMultiplier;
    }

    private getBusinessFactor(office: OfficeDto, businessEmployees: number): number {
        const businessProd = 1 + (businessEmployees * this.calculateEmployeeProductivity(office)[CorpEmployeeJob.Business]);

        return this.calculateEffectWithFactors(businessProd, 0.26, 10e3);
    }

    private calculateEffectWithFactors(n: number, expFac: number, linearFac: number): number {
        if (expFac <= 0 || expFac >= 1) {
            console.warn(`Exponential factor is ${expFac}. This is not an intended value for it`);
        }
        if (linearFac < 1) {
            console.warn(`Linear factor is ${linearFac}. This is not an intended value for it`);
        }

        return Math.pow(n, expFac) + n / linearFac;
    }

    private getAdvertisingFactors(office: OfficeDto): [
        totalFactor: number,
        awarenessFactor: number,
        popularityFactor: number,
        ratioFactor: number,
    ] {
        const awareness = office.division.getAwareness()
        const popularity = office.division.getPopularity()
        const awarenessFac = Math.pow(awareness + 1, office.division.industry.advertisingFactor ?? 0);
        const popularityFac = Math.pow(popularity + 1, office.division.industry.advertisingFactor ?? 0);
        const ratioFac = awareness === 0 ? 0.01 : Math.max((popularity + 0.001) / awareness, 0.01);
        const totalFac = Math.pow(awarenessFac * popularityFac * ratioFac, 0.85);
        return [totalFac, awarenessFac, popularityFac, ratioFac];
    }

    private getMarketFactor(item: Material | Product): number {
        return Math.max(0.1, ((item.demand ?? MaterialInfo[item.name as CorpMaterialName].demandBase) * (100 - (item.competition ?? MaterialInfo[item.name as CorpMaterialName].competitionBase))) / 100);
    }

    private calculateMarkupMultiplier(item: Material): number {
        const sellingPrice = evaluateSellPrice(item.desiredSellPrice.toString(), item.marketPrice);
        const marketPrice = item.marketPrice;
        const markupLimit = item.quality / MaterialInfo[item.name].baseMarkup

        if (!Number.isFinite(sellingPrice)) {
            return 1;
        }
        let markupMultiplier = 1;
        if (sellingPrice > marketPrice) {
            if (sellingPrice > marketPrice + markupLimit) {
                markupMultiplier = Math.pow(markupLimit / (sellingPrice - marketPrice), 2);
            }
        } else {
            if (sellingPrice <= 0) {
                markupMultiplier = 1e12;
            } else {
                markupMultiplier = marketPrice / sellingPrice;
            }
        }
        return markupMultiplier;
    }

    public getOptimalMaterialPrice(item: Material): number {
        return Math.max(item.marketPrice + (item.quality / MaterialInfo[item.name].baseMarkup), item.marketPrice)
    }

    private getInterns(office: OfficeDto): number {
        if (office.division.hasResearched(CorpBaseResearchName.AutoBrew) && office.division.hasResearched(CorpBaseResearchName.AutoParty)) {
            return 0;
        }

        const internRatio = office.division.getLastCycleRevenue() > office.division.getLastCycleExpenses() ? 1 / 9 : 1 / 6;
        return office.getNumEmployees() >= 9 ? Math.ceil(office.getNumEmployees() * internRatio) : 0;
    }

    private getRnDEmployees(office: OfficeDto): number {
        return Math.max(Math.ceil((office.getNumEmployees() - this.getInterns(office)) * 0.1), 1);
    }

    public getIdealBoostMaterialAmounts(office: OfficeDto): Partial<Record<CorpMaterialName, number>> {
        const industry = IndustriesData[office.division.industry.name];
        if (!industry) return {};

        const BOOST_MATERIALS = [
            CorpMaterialName.RealEstate,
            CorpMaterialName.Hardware,
            CorpMaterialName.Robots,
            CorpMaterialName.AiCores,
        ] as const;

        type BoostMaterial = typeof BOOST_MATERIALS[number];

        const coeffs: Record<BoostMaterial, number> = {
            [CorpMaterialName.RealEstate]: industry.realEstateFactor ?? 0,
            [CorpMaterialName.Hardware]: industry.hardwareFactor ?? 0,
            [CorpMaterialName.Robots]: industry.robotFactor ?? 0,
            [CorpMaterialName.AiCores]: industry.aiCoreFactor ?? 0,
        };

        const sizes: Record<BoostMaterial, number> = {
            [CorpMaterialName.RealEstate]: MaterialInfo[CorpMaterialName.RealEstate].size,
            [CorpMaterialName.Hardware]: MaterialInfo[CorpMaterialName.Hardware].size,
            [CorpMaterialName.Robots]: MaterialInfo[CorpMaterialName.Robots].size,
            [CorpMaterialName.AiCores]: MaterialInfo[CorpMaterialName.AiCores].size,
        };

        const sumC = BOOST_MATERIALS.reduce((acc, name) => acc + coeffs[name], 0);
        const S = office.getWarehouseStorage();

        const rawResult: Partial<Record<CorpMaterialName, number>> = {};
        const makeCalc = (name: BoostMaterial, others: BoostMaterial[]): number => {
            const cN = coeffs[name];
            const sN = sizes[name];
            const otherSumC = others.reduce((acc, m) => acc + coeffs[m], 0);
            const otherSumS = others.reduce((acc, m) => acc + sizes[m], 0);
            return (cN * (S + 500 * otherSumS - 500 * sN * otherSumC / cN)) / (sN * sumC);
        };

        for (const material of BOOST_MATERIALS) {
            const others = BOOST_MATERIALS.filter(m => m !== material);
            const units = makeCalc(material, others);
            rawResult[material] = Math.max(0, units);
        }

        const baseProduction =
            this.getMaximalMaterialProduction(office) / office.division.multipliers.getProductionMultiplier();

        const recomputeRequiredSpace = (boosts: Partial<Record<CorpMaterialName, number>>) => {
            const multiplier = this.estimateBoostMultiplier(office, boosts);
            const adjustedProduction = baseProduction * multiplier * 10;
            const producedMaterials = office.division.industry.producedMaterials ?? [];
            const producedSize = producedMaterials.reduce(
                (acc, mat) => acc + adjustedProduction * MaterialInfo[mat].size,
                0
            );
            const requiredMaterials = office.division.industry.requiredMaterials ?? {};
            const requiredSize = Object.entries(requiredMaterials).reduce(
                (acc, [mat, ratio]) =>
                    acc + Math.max(adjustedProduction * ratio, 0) * MaterialInfo[mat as CorpMaterialName].size,
                0
            );
            const total = Math.max(producedSize, requiredSize) * 1.30;
            return { adjustedProduction, multiplier, total };
        };

        const applyScale = (scale: number): Partial<Record<CorpMaterialName, number>> => {
            const scaled: Partial<Record<CorpMaterialName, number>> = {};
            for (const mat of BOOST_MATERIALS) {
                scaled[mat] = (rawResult[mat] ?? 0) * scale;
            }
            return scaled;
        };

        let minScale = 0;
        let maxScale = 1;
        let bestBoosts: Partial<Record<CorpMaterialName, number>> = {};
        const maxIterations = 20;
        const tolerance = 0.001;

        for (let i = 0; i < maxIterations; i++) {
            const midScale = (minScale + maxScale) / 2;
            const scaledBoosts = applyScale(midScale);
            const usedSpace = BOOST_MATERIALS.reduce(
                (acc, mat) => acc + (scaledBoosts[mat] ?? 0) * sizes[mat],
                0
            );
            const { total: requiredSpace } = recomputeRequiredSpace(scaledBoosts);
            const totalSpace = usedSpace + requiredSpace;
            if (totalSpace > S) {
                maxScale = midScale;
            } else {
                bestBoosts = scaledBoosts;
                minScale = midScale;
            }
            if (Math.abs(maxScale - minScale) < tolerance) break;
        }

        return bestBoosts;
    }

    public estimateBoostMultiplier(office: OfficeDto, expectedBoosts: Partial<Record<CorpMaterialName, number>>): number {
        const industry = IndustriesData[office.division.industry.name];
        if (!industry) return 1;
        const boostFactors = {
            [CorpMaterialName.RealEstate]: industry.realEstateFactor ?? 0,
            [CorpMaterialName.Hardware]: industry.hardwareFactor ?? 0,
            [CorpMaterialName.Robots]: industry.robotFactor ?? 0,
            [CorpMaterialName.AiCores]: industry.aiCoreFactor ?? 0,
        };
        const k = 0.002;
        const mult = Object.entries(boostFactors).reduce((acc, [name, coeff]) => {
            const amount = expectedBoosts[name as CorpMaterialName] ?? 0;
            return acc * Math.pow(1 + k * amount, coeff);
        }, 1);
        return Math.pow(mult, 0.73) * 6;
    }

    public getMaximalMaterialProduction(office: OfficeDto): number {
        const employees = this.getOptimalEmployeeDistribution(office);
        const production = this.getOfficeRawMaterialProduction(
            employees.Operations,
            employees.Engineer,
            employees.Management,
            office,
            true
        );
        return production;
    }
}