export const DATABASE_NAME = "MyGameDatabase";
export const STORE_NAME = "servers";

export const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request: IDBOpenDBRequest = indexedDB.open(DATABASE_NAME, 1);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Error opening IndexedDB.");
    });
};

export const getTransaction = async (mode: IDBTransactionMode = "readonly"): Promise<IDBObjectStore> => {
    const db: IDBDatabase = await openDatabase();
    return db.transaction(STORE_NAME, mode).objectStore(STORE_NAME);
};

export const getAllServers = async (): Promise<any[]> => {
    const store: IDBObjectStore = await getTransaction();
    return new Promise<any[]>((resolve, reject) => {
        const request: IDBRequest = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Error retrieving servers.");
    });
};

export const getServerById = async (hostname: string): Promise<any> => {
    const store: IDBObjectStore = await getTransaction();
    return new Promise<any>((resolve, reject) => {
        const request: IDBRequest = store.get(hostname);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(`Error retrieving server: ${hostname}`);
    });
};

export const saveServer = async (server: any): Promise<void> => {
    const store: IDBObjectStore = await getTransaction("readwrite");
    return new Promise<void>((resolve, reject) => {
        const request: IDBRequest = store.put(server);
        request.onsuccess = () => resolve();
        request.onerror = () => reject("Error saving server.");
    });
};

export const deleteServer = async (hostname: string): Promise<void> => {
    const store: IDBObjectStore = await getTransaction("readwrite");
    return new Promise<void>((resolve, reject) => {
        const request: IDBRequest = store.delete(hostname);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(`Error deleting server: ${hostname}`);
    });
};