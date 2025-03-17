import { NS } from "@ns";
import { Crawler } from "/src/utils/crawler";
import { ServerEntity } from "/src/entity/server/server.entity";

import {DATABASE_NAME, STORE_NAME} from "/src/database/server.database";

export async function main(ns: NS) {
    ns.tprint("Building database...");

    const servers = (new Crawler(ns))
        .getNetwork()
        .map((hostname: string) => new ServerEntity(ns.getServer(hostname)));

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
                servers.forEach((server: ServerEntity) => store.put(server));
            };

            txn.oncomplete = () => ns.tprint("Database built!");
        } else {
            ns.tprint("Error: Database is null on success.");
        }
    };

    request.onerror = () => ns.tprint("Error opening IndexedDB.");
}
