import { NS } from "@ns";
import { Crawler } from "/src/utils/crawler";
import { isSpecialServer } from "/src/enum/faction.enum";

export async function main(ns: NS): Promise<void> {
    const crawler = new Crawler(ns);
    const targets: string[] = crawler
        .getNetwork()
            .filter((host: string) =>
                isSpecialServer(host) &&
                ns.getServerRequiredHackingLevel(host) < ns.getHackingLevel() &&
                ns.hasRootAccess(host)
            )

    for (const target of targets) {
        crawler
            .getPath(target)
            .forEach((host: string) => ns.singularity.connect(host));

        await ns.singularity.installBackdoor();
    }

    ns.singularity.connect("home");
}
