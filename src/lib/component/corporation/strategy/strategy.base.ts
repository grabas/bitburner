import { Corporation, NS } from "@ns";
import { CorporationDto } from "/lib/component/corporation/dto/corporation.dto";
import { CityName } from "/lib/enum/location.enum";
import {
    CorpEmployeeJob,
    CorpMaterialName, CorpResearchName,
    CorpUnlockName,
    CorpUpgradeName,
} from "/lib/component/corporation/corporation.enum";
import { CorporationFormulas } from "/lib/component/corporation/corporation.formulas";
import { OfficeDto } from "/lib/component/corporation/dto/office.dto";
import {
    DefaultOfficeConfiguration,
    DivisionStrategyConfig,
    OfficeSettings, StrategyConfigType,
    StrategyDivisionEntry,
} from "/lib/component/corporation/strategy/strategy.interface";

import "/lib/utils/prototypes"
import {getBitnode} from "/lib/repository/bitnode.repository";

export class StrategyBase {
    protected readonly ns: NS;
    protected readonly corporation: CorporationDto;
    protected readonly corporationApi: Corporation;
    protected readonly formulas: CorporationFormulas;

    constructor(ns: NS) {
        this.ns = ns;
        this.corporationApi = ns.corporation;
        this.corporation = new CorporationDto(ns);
        this.formulas = new CorporationFormulas(ns);
    }

    public forEachOffice(
        divisionConfig: Record<string, DivisionStrategyConfig> | null,
        action: (
            divisionName: string,
            city: CityName,
            office: OfficeDto,
            config: OfficeSettings | null,
            divisionConfig: Record<string, DivisionStrategyConfig> | null
        ) => void
    ): void {
        for (const division of this.corporation.getDivisions()) {
            for (const office of division.getOffices()) {
                const config = divisionConfig?.[division.name]?.Office?.[office.city] ?? null;
                action(division.name, office.city, office, config, divisionConfig);
            }
        }
    }

    protected createDivisions(divisions: StrategyDivisionEntry[]): void {
        for (const { industry, name } of divisions) {
            if (!this.corporation.hasExpandedToIndustry(industry)) {
                this.corporationApi.expandIndustry(industry, name);
            }
        }
    }

    protected expandCities(): void {
        for (const division of this.corporation.getDivisions()) {
            if (division.getOffices().length !== Object.values(CityName).length) {
                for (const city of Object.values(CityName)) {
                    if (division.hasCity(city)) continue;
                    this.corporationApi.expandCity(division.name, city);
                    this.corporationApi.purchaseWarehouse(division.name, city);
                }
            }
        }
    }

    protected buyAdverts(
        divisionConfig: Record<string, DivisionStrategyConfig>,
        configKey: "InitialNumAdverts" | "MaxNumAdverts"
    ): void {
        for (const division of this.corporation.getDivisions()) {
            const config = divisionConfig[division.name];
            const maxAdverts = config[configKey] ?? 0;

            while (this.corporationApi.getHireAdVertCount(division.name) < maxAdverts) {
                const advertCost = this.corporationApi.getHireAdVertCost(division.name);
                if (!this.corporation.canAfford(advertCost)) break;
                this.corporationApi.hireAdVert(division.name);
            }
        }
    }

    protected upgradeWarehouseLevel(
        divisionConfig: Record<string, DivisionStrategyConfig>,
        configKey: "InitialWarehouseLevel" | "MaxWarehouseLevel"
    ): void {
        this.forEachOffice(divisionConfig, (divisionName, city, office, config) => {
            const targetLevel = config?.[configKey] ?? DefaultOfficeConfiguration[configKey];
            while (office.getWarehouse().level < targetLevel) {
                const upgradeCost = this.corporationApi.getUpgradeWarehouseCost(divisionName, city);
                if (!this.corporation.canAfford(upgradeCost)) break;
                this.corporationApi.upgradeWarehouse(divisionName, city);
            }
        });
    }

    protected upgradeOfficeSpace(
        divisionConfig: Record<string, DivisionStrategyConfig>,
        configKey: "InitialNumEmployees" | "MaxNumEmployees"
    ): void {
        this.forEachOffice(divisionConfig, (divisionName, city, office, config) => {
            const targetEmployees = config?.[configKey] ?? DefaultOfficeConfiguration[configKey];
            while (office.getMaxEmployees() < targetEmployees) {
                const upgradeCost = this.corporationApi.getOfficeSizeUpgradeCost(divisionName, city, 1);
                if (!this.corporation.canAfford(upgradeCost)) break;
                this.corporationApi.upgradeOfficeSize(divisionName, city, 1);
            }
        });
    }

    protected hireEmployees(): void {
        for (const division of this.corporation.getDivisions()) {
            for (const office of division.getOffices()) {
                while (office.getNumEmployees() < office.getMaxEmployees()) {
                    this.corporationApi.hireEmployee(division.name, office.city, "Unassigned");
                }
            }
        }
    }

    protected assignEmployees(divisionConfig: Record<string, DivisionStrategyConfig>): void {
        this.forEachOffice(divisionConfig, (divisionName, city, office, config, divisionConfig) => {
            for (const position of Object.values(CorpEmployeeJob)) {
                this.corporationApi.setAutoJobAssignment(divisionName, city, position, 0);
            }

            const division = office.division;
            const useResearchMode =
                division.getResearchPoint() < (config?.MinResearch ?? DefaultOfficeConfiguration.MinResearch);

                const positions = useResearchMode
                    ? this.formulas.getOptimalEmployeeDistributionResearch(office)
                    : (
                        division.makesProduct() ?
                            this.formulas.getOptimalProductEmployeeDistribution(office, divisionConfig !== null && divisionConfig[divisionName].ProductCity === city) :
                            this.formulas.getOptimalEmployeeDistribution(office)
                    );

            const hasLeftovers = office.producedMaterialStock() > 0;

            for (const [position, num] of Object.entries(positions) as [CorpEmployeeJob, number][]) {
                let adjustedCount = num;
                if (hasLeftovers && position === CorpEmployeeJob.RandD) adjustedCount--;
                if (hasLeftovers && position === CorpEmployeeJob.Business) adjustedCount++;

                try {
                    this.corporationApi.setAutoJobAssignment(divisionName, city, position, Math.max(adjustedCount, 0));
                } catch (error) { continue; }
            }
        });
    }

    protected purchaseCorpUpgrades(corpUpgrades: Partial<Record<CorpUpgradeName, number>>): void {
        for (const [upgrade, level] of Object.entries(corpUpgrades) as [CorpUpgradeName, number][]) {
            while (this.corporation.getUpgradeLevel(upgrade) < level) {
                const upgradeCost = this.corporationApi.getUpgradeLevelCost(upgrade);
                if (!this.corporation.canAfford(upgradeCost)) break
                this.corporationApi.levelUpgrade(upgrade);
            }
        }
    }

    protected purchaseRequiredMaterials(): void {
        this.forEachOffice(null, (divisionName, city, office) => {
            const requiredMaterials = office.getRequiredMaterials();

            for (const material of Object.keys(requiredMaterials) as CorpMaterialName[]) {
                const stock = office.getMaterialStock(material) / 10;
                const amount = Math.max((office.getRequiredMaterialRawAmount(material) / 10) - stock, 0);
                const amountSafe = isNaN(amount) ? 0 : amount

                this.corporationApi.buyMaterial(divisionName, city, material, amountSafe);
            }
        });
    }

    public purchaseBoostMaterials(divisionsConfig: Record<string, DivisionStrategyConfig>): void {
        this.forEachOffice(divisionsConfig, (divisionName, city, office) => {
            const divisionConfig = divisionsConfig[divisionName];
            if (!divisionConfig.PurchaseBoostMaterials) return;

            const boostMaterials = this.formulas.getIdealBoostMaterialAmounts(office);
            for (const [material, targetAmount] of Object.entries(boostMaterials) as [CorpMaterialName, number][]) {
                const currentAmount = office.getMaterialStock(material);
                const delta = Math.floor(targetAmount) - currentAmount;

                if (isNaN(delta)) continue;

                const amount = Math.floor(Math.abs(delta) / 10);

                if (delta > 0) {
                    this.corporationApi.buyMaterial(divisionName, city, material, amount);
                    this.corporationApi.sellMaterial(divisionName, city, material, "0", "MP");
                } else if (delta < 0) {
                    this.corporationApi.buyMaterial(divisionName, city, material, 0);
                    this.corporationApi.sellMaterial(divisionName, city, material, amount.toString(), "MP");
                } else {
                    this.corporationApi.sellMaterial(divisionName, city, material, "0", "MP");
                    this.corporationApi.buyMaterial(divisionName, city, material, 0);
                }
            }
        });
    }

    protected setOptimalPrices(): void {
        this.forEachOffice(null, (divisionName, city, office) => {
            for (const material of office.getProducedMaterials()) {
                if (material.productionAmount === 0) continue;
                const price = this.formulas.getOptimalMaterialPrice(material);

                this.corporationApi.sellMaterial(divisionName, city, material.name, "MAX", price.toString());
            }
        });
    }

    protected buyUnlocks(unlocks: CorpUnlockName[]): void {
        for (const unlock of unlocks) {
            const cost = this.corporationApi.getUnlockCost(unlock);
            if (this.corporation.canAfford(cost) && !this.corporation.hasUnlock(unlock)) {
                this.corporationApi.purchaseUnlock(unlock);
            }
        }
    }

    protected setExport(divisionConfig: Record<string, DivisionStrategyConfig>): void {
        for (const division of this.corporation.getDivisions()) {
            for (const office of division.getOffices()) {
                const config = divisionConfig[division.name]?.Office?.[office.city];
                const exports = config?.ExportMaterials ?? [];

                for (const exportData of exports) {
                    const importOffice = this.corporation.getOffice(exportData.importDivision, office.city);
                    const stock = importOffice.getMaterialStock(exportData.material) / 10;
                    const amount = Math.max((importOffice.getRequiredMaterialRawAmount(exportData.material) / 10) - stock, 0);
                    const amountSafe = isNaN(amount) ? 0 : amount

                    this.corporationApi.cancelExportMaterial(division.name, office.city, exportData.importDivision, office.city, exportData.material);
                    this.corporationApi.exportMaterial(
                        division.name,
                        office.city,
                        exportData.importDivision,
                        office.city,
                        exportData.material,
                        amountSafe
                    );
                }
            }
        }
    }

    protected conditionsSatisfied(strategyConfig: StrategyConfigType, divisionsConfig: Record<string, DivisionStrategyConfig>) {
        let allSetisfied = true;

        for (const division of this.corporation.getDivisions()) {
            const divisionConfig = divisionsConfig[division.name];

            allSetisfied = allSetisfied &&
                division.getOffices().length >= Object.values(CityName).length;

            for (const research of divisionConfig.Research) {
                allSetisfied = allSetisfied && division.hasResearched(research);
            }

            for (const office of division.getOffices()) {
                allSetisfied = allSetisfied &&
                    office.getMorale() === office.getMaxMorale() &&
                    office.getEnergy() === office.getMaxEnergy()
            }
        }

        const conditions = [
            this.corporationApi.getInvestmentOffer().round === strategyConfig.Round,
            this.corporationApi.getInvestmentOffer().funds > strategyConfig.InvestmentFunds * getBitnode().multipliers.CorporationValuation,
            allSetisfied
        ]

        return conditions.every(condition => condition);
    }

    protected investmentRoundCheck(strategyConfig: StrategyConfigType): boolean {
        return this.corporationApi.getInvestmentOffer().round > strategyConfig.Round;
    }

    protected buyResearch(divisionsConfig: Record<string, DivisionStrategyConfig>): void {
        for (const division of this.corporation.getDivisions()) {
            const config = divisionsConfig[division.name];
            const research = config.Research;

            for (const researchName of research) {
                if (!this.corporationApi.hasResearched(division.name, researchName)) {
                    if (division.canAffordResearch(researchName)) {
                        this.corporationApi.research(division.name, researchName);
                    }
                }
            }
        }

    }

    protected handleProduct(divisionsConfig: Record<string, DivisionStrategyConfig>): void {
        for (const division of this.corporation.getDivisions()) {
            if (!division.makesProduct()) continue;

            const config = divisionsConfig[division.name];
            if (!config.ProductCity) continue;

            const products = division.getProducts(config.ProductCity ?? "Sector-12")

            let allResearched = true;
            for (const product of products) {
                if (product.developmentProgress === 100) {
                    this.corporationApi.sellProduct(division.name, config.ProductCity, product.name, "MAX", "MP", true);
                    if (division.hasResearched(CorpResearchName.MarketTa2)) {
                        this.corporationApi.setProductMarketTA2(division.name, product.name, true);
                    }
                } else {
                    allResearched = false;
                }
            }

            for (const office of division.getOffices()) {
                const researchedProducts = division.getProducts(office.city).filter(product => product.developmentProgress === 100);
                for (const product of researchedProducts) {
                    const limit = office.getRawMaterialProduction() / researchedProducts.length
                    this.corporationApi.limitProductProduction(division.name, office.city, product.name, isNaN(limit) ? 0 : limit);
                }
            }

            if (allResearched) {
                if (division.getProducts(config.ProductCity).length === division.getMaxProducts()) {
                    const lowestRatedProduct = products.reduce((lowest, product) => {
                        return product.effectiveRating < lowest.effectiveRating ? product : lowest;
                    }, products[0]);

                    if (lowestRatedProduct.rating === 0 || lowestRatedProduct.effectiveRating === 0) return;

                    this.corporationApi.discontinueProduct(division.name, lowestRatedProduct.name);
                }

                if (this.corporation.getFunds() > 0) {
                    this.corporationApi.makeProduct(division.name, config.ProductCity, Math.random().toString(), this.corporation.getFunds() * 0.1, this.corporation.getFunds() * 0.1);
                }
            }
        }
    }
}
