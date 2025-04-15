import {NS} from "@ns";
import {OfficeDto} from "/lib/component/corporation/dto/office.dto";
import {DivisionBase} from "/lib/component/corporation/dto/division/division.base";
import {CorpBaseResearchName} from "/lib/component/corporation/corporation.enum";

export class DivisionDto extends DivisionBase {
    constructor(ns: NS, name: string) {
        super(ns, name);
    }

    public getOffices(): OfficeDto[] {
        return this.data(this.name).cities.map((city) => new OfficeDto(this.ns, this.name, city));
    }
}