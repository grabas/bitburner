import { NS } from "@ns";
import {InitOrchestrator} from "/lib/init/init.orchestrator";

export async function main(ns: NS): Promise<void> {
    try {
        await (new InitOrchestrator(ns)).init();
    } catch (error) {
        ns.tprint(error instanceof Error ? error.message : error);
    }
}