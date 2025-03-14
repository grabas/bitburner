import { NS } from "@ns";
import { Crawler } from "/src/utils/crawler";
import { Server } from "/src/entity/server/server";

import {DATABASE_NAME, STORE_NAME} from "/src/database/serverDatabase";

export async function main(ns: NS) {
    ns.tprint("Building database...");

    const servers = (new Crawler(ns))
        .getNetwork()
        .map((hostname: string) => new Server(ns, hostname));
    servers.push(new Server(ns, "home"));

    const request = indexedDB.open(DATABASE_NAME, 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest)?.result;
        if (db && !db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: "hostname" });
        }
    };

    request.onsuccess = (event: Event) => {
        const db = (event.target as IDBOpenDBRequest)?.result;
        if (db) {
            const txn = db.transaction(STORE_NAME, "readwrite");
            const store = txn.objectStore(STORE_NAME);

            store.clear().onsuccess = () => {
                servers.forEach((server: Server) => store.put(server));
            };

            txn.oncomplete = () => ns.tprint("Database built!");
        } else {
            ns.tprint("Error: Database is null on success.");
        }
    };

    request.onerror = () => ns.tprint("Error opening IndexedDB.");
}
