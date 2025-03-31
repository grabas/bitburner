import { NS } from "@ns";
import "/lib/utils/prototypes";

export class Crawler {
    private readonly ns: NS;

    constructor(ns: NS) {
        this.ns = ns;
    }

    getNetwork = (hostname = "home", data: string[] = ["home"]): string[] => [
        ...this.ns.scan(hostname)
            .slice(hostname !== "home" ? 1 : 0)
            .flatMap((host: string) => this.getNetwork(host, [host])),
        ...data
    ];

    getPath = (hostname: string, currentNode = "home", path: string[] = []): string[] => {
        return currentNode === hostname
            ? [...path, currentNode]
            : this.ns.scan(currentNode)
                .slice(currentNode !== "home" ? 1 : 0)
                .flatMap((connection: string) => this.getPath(hostname, connection, [...path, currentNode]));
    };
}
