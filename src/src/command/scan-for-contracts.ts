import {NS} from "@ns";
import {Crawler} from "/src/utils/crawler";

export async function main(ns: NS) {
    const servers = (new Crawler(ns)).getNetwork()

    servers
        .forEach(server => {
            ns.ls(server)
                .filter(file => file.endsWith(".cct"))
                .forEach(file => ns.tprint(JSON.stringify({file: file, server: server}, null, 2)))
        })
}