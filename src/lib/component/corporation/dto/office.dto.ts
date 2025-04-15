import {
    CorpEmployeePosition,
    Corporation,
    NS,
    Office, Warehouse
} from "@ns";

import {CityName} from "/lib/enum/location.enum";

import {CorporationMultiplers} from "/lib/component/corporation/dto/corporation-multiplers";
import {DivisionBase} from "/lib/component/corporation/dto/division/division.base";
import {CorpMaterialName, MaterialInfo} from "/lib/component/corporation/corporation.enum";

export class OfficeDto {
    private readonly ns: NS;
    private readonly corporationApi: Corporation;
    private readonly data: (divisionName: string, city: (CityName | `${CityName}`)) => Office;
    
    public readonly division: DivisionBase;
    public readonly city: CityName;

    constructor(ns: NS, divison: string, city: CityName) {
        this.city = city;
        this.division = new DivisionBase(ns, divison);

        this.ns = ns;
        this.corporationApi = ns.corporation;
        this.data = ns.corporation.getOffice;
    }
    
    public getData(): Office {
        return this.data(this.division.name, this.city);
    }
    
    public getMaxEmployees(): number {
        return this.getData().size;
    }

    public getNumEmployees(): number {
        return this.getData().numEmployees;
    }

    public getMaxEnergy(): number {
        return this.getData().maxEnergy;
    }

    public getEnergy(): number {
        return this.getData().avgEnergy;
    }

    public getMaxMorale(): number {
        return this.getData().maxMorale;
    }

    public getMorale(): number {
        return this.getData().avgMorale;
    }

    public getTotalExperience(): number {
        return this.getData().totalExperience;
    }

    public getEmployeesAssigment(): Record<CorpEmployeePosition, number> {
        return this.getData().employeeJobs;
    }

    public getEmployeeProductionByJob(): Record<CorpEmployeePosition, number> {
        return this.getData().employeeProductionByJob;
    }

    public getProducedMaterials() {
        return this.division.industry.producedMaterials?.map(material => this.getMaterialData(material)) ?? [];
    }

    public getRequiredMaterials() {
        return this.division.industry.requiredMaterials;
    }

    public getRequiredMaterialRawAmount(material: CorpMaterialName) {
        const ratio = this.getRequiredMaterials()[material] ?? 0;
        const production = this.getRawMaterialProduction();

        return Math.ceil(Math.max(production * ratio, 0) * 10);
    }

    public getMaterialStock(material: CorpMaterialName) {
        return this.getMaterialData(material).stored;
    }

    private getMaterialData(material: CorpMaterialName) {
        return this.corporationApi.getMaterial(this.division.name, this.city, material);
    }

    public isExporting(importDivision: string, importCity: string, importMaterial: CorpMaterialName, amount: number): boolean {
        const material = this.getMaterialData(importMaterial);
        const exports = material.exports;

        return exports.some((exportData) => {
            return exportData.division === importDivision && exportData.city === importCity && exportData.amount === amount.toString();
        });
    }

    public producedMaterialStock(): number {
        const producedMaterials = this.division.industry.producedMaterials ?? [];
        return producedMaterials.reduce((acc, material) => {
            return acc + this.getMaterialStock(material);
        }, 0);
    }

    public getRawMaterialProduction(): number {
        return this.getRawProduction();
    }

    public getRealMaterialProduction(): number {
        return Math.min(this.getRawProduction(), this.getWarehouseFree());
    }

    public getRawProductProduction(): number {
        return this.getRawProduction(true);
    }

    public getWarehouse(): Warehouse {
        return this.corporationApi.getWarehouse(this.division.name, this.city);
    }

    public getWarehouseStorage(): number {
        return this.getWarehouse().size
    }

    public getWarehouseFree(): number {
        return this.getWarehouse().size - this.getWarehouse().sizeUsed;
    }

    public getProducMaterialsWarehouseCoverage(): number {
        const materials = this.division.industry.producedMaterials ?? [];
        if (materials.length === 0) return 0;

        const rawProduction = this.getRawMaterialProduction();
        return materials.reduce((acc, material) => {
            return acc + (rawProduction * 10 * MaterialInfo[material].size);
        }, 0);
    }

    private getRawProduction(isProduct = false): number {
        const operationsProd = this.getEmployeeProductionByJob().Operations;
        const engineerProd = this.getEmployeeProductionByJob().Engineer;
        const managementProd = this.getEmployeeProductionByJob().Management;

        const managementFactor = 1 + (managementProd / (1.2 * (operationsProd + engineerProd + managementProd)));

        const employeeProductionMultiplier = (Math.pow(operationsProd, 0.4) + Math.pow(engineerProd, 0.3)) * managementFactor * 0.05 * (isProduct ? 0.5 : 1);
        const upgradeMultiplier = (new CorporationMultiplers(this.ns)).getProdMultiplier();

        return employeeProductionMultiplier * this.division.multipliers.getProductionMultiplier() * upgradeMultiplier * this.division.multipliers.getResearchProducionMultiplier()
    }
}