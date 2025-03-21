import {NS} from "@ns";
import {Crawler} from "/lib/utils/crawler";

export async function main(ns: NS): Promise<void> {
    const input = globalThis.document.getElementById("terminal-input") as HTMLInputElement;
    if (!input) {
        ns.tprint("Error: Terminal input element not found.");
        return;
    }

    const handlerKey = Object.keys(input)[1];
    const handler: any = (input as any)[handlerKey];

    input.value = new Crawler(ns)
        .getPath(ns.args[0].toString())
        .map(val => "connect " + val)
        .join("; ");

    if (handler?.onChange) {
        handler.onChange({ target: input });
    }

    if (handler?.onKeyDown) {
        handler.onKeyDown({ key: 'Enter', preventDefault: () => {} });
    }
}

export function autocomplete(data: any): string[] {
    data.flags([['verbose', false], ['refreshRate', 200]]);
    return [...data.servers];
}
