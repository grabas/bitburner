import {BatchScript} from "/src/enum/scripts.enum";

export interface BatchAction {
    script: BatchScript;
    sleepTime: number;
    threads: number;
    duration?: number;
}