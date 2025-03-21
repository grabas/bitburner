import { NS } from "@ns";
import { Crawler } from "/lib/utils/crawler";
import { ServerEntity } from "/lib/entity/server/server.entity";
import { DATABASE_NAME, STORE_NAME } from "/lib/database/server.database";
import {COLORS} from "/lib/enum/colors.enum";
import {setColor} from "/lib/utils/helpers/set-color";

export async function main(ns: NS) {
    ns.tprint(setColor("Building database...", COLORS.ORANGE));

    const servers = new Crawler(ns)
        .getNetwork()
        .map((hostname: string) => new ServerEntity(ns.getServer(hostname)));

    const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DATABASE_NAME, 1);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (db && !db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "hostname" });
            }
        };

        request.onsuccess = (event: Event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (db) {
                resolve(db);
            } else {
                reject(new Error("Database is null on success."));
            }
        };

        request.onerror = () => reject(new Error("Error opening IndexedDB."));
    });

    await new Promise<void>((resolve, reject) => {
        const txn = db.transaction(STORE_NAME, "readwrite");
        const store = txn.objectStore(STORE_NAME);

        store.clear().onsuccess = () => {
            servers.forEach((server: ServerEntity) => store.put(server));
        };

        txn.oncomplete = () => {
            ns.tprint(setColor("Database built!", COLORS.GREEN));
            resolve();
        };

        txn.onerror = () => reject(new Error("Transaction error."));
    });

    return ns;
}