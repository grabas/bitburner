import { NS } from "@ns";
import {InitOrchestrator} from "/lib/init/init.orchestrator";

export async function main(ns: NS): Promise<void> {
    await (new InitOrchestrator(ns)).init();
}