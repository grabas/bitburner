export const DATABASE_NAME = "bitburnerSave";
export const STORE_NAME = "savestring";

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

export const getSave = async (): Promise<any> => {
    try {
        const store: IDBObjectStore = await getTransaction();

        return new Promise<any>((resolve, reject) => {
            const request: IDBRequest = store.get("save");

            request.onsuccess = async () => {
                if (request.result instanceof Uint8Array) {
                    try {
                        const decompressedData = await decompressGzip(request.result);
                        resolve(decompressedData);
                    } catch (error) {
                        reject(`Error decompressing savefile: ${error}`);
                    }
                } else {
                    reject("Save data is not a Uint8Array, Try to save game first!");
                }
            };

            request.onerror = () => reject("Error retrieving savefile");
        });
    } catch (error) {
        alert(`Error getting save: ${error}, Try to save game first!`);
    }
};

async function decompressGzip(data: Uint8Array): Promise<any> {
    const stream = new ReadableStream({
        start(controller) {
            controller.enqueue(data);
            controller.close();
        }
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const decompressedStream = new Response(stream.pipeThrough(new DecompressionStream("gzip")));
    const decompressedText = await decompressedStream.text();

    return JSON.parse(decompressedText);
}