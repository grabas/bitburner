import {ActionScript} from "/lib/enum/scripts.enum";
import {ScriptArg} from "@ns";
import {TapewormConfig} from "/lib/component/tapeworm-attack/tapeworm.config";

export interface TapewormAction {
    script: ActionScript;
    threads: number;
    args: ScriptArg[];
}

export interface TapewormPortMessage {
    action: TapewormConfig.RECALIBRATE_PORT_MESSAGE
    target: string;
}