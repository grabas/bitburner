import {NS} from "@ns";
import ApexCharts from 'apexcharts'
import {ServerRepository} from "/src/repository/server.repository";
import {HackingFormulas} from "/src/component/batch/batch.formulas";
import {Batch} from "/src/component/batch/batch";
import {scheduler} from "/lib/react";

export async function main(ns: NS, print = (data: any) => ns.tprint(JSON.stringify(data, null, 2))): Promise<void> {
   const sleep = (delay: number) => scheduler.postTask(() => {}, {delay});

   while (true) {
      ns.tprint("Ayy");
      await sleep(500);
   }
}

