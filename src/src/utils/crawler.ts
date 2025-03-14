import { NS } from "@ns";
import "/src/utils/prototypes";

export function autocomplete(data: any): string[] {
    data.flags([['verbose', false], ['refreshRate', 200]]);
    return [...data.servers];
}

export async function main(ns: NS): Promise<void> {
    const target: string = ns.args[0].toString();
    const crawler = new Crawler(ns);

    let path = "";
    crawler.getPath(target).forEach((node: string) => {
        path += "connect " + node + "; ";
    });

    ns.tprint(path);
}

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
