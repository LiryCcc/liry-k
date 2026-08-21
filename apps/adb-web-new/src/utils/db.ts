const DB_NAME = 'adb-web-new';
const DB_VERSION = 1;
const STORE_NAME = 'traces';

export type StoredTrace = {
  id: string;
  label: string;
  level: 'info' | 'warn' | 'error';
  data: string;
  timestamp: number;
};

export const initDb = (): Promise<IDBDatabase> => {
  if (window.__ADB_DB__) return Promise.resolve(window.__ADB_DB__);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
    };
    req.onsuccess = () => {
      window.__ADB_DB__ = req.result;
      resolve(req.result);
    };
    req.onerror = () => reject(req.error);
  });
};

export const loadTraces = async (): Promise<StoredTrace[]> => {
  const db = await initDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as StoredTrace[]);
    req.onerror = () => reject(req.error);
  });
};

export const saveTrace = async (trace: StoredTrace): Promise<void> => {
  const db = await initDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(trace);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const clearTraces = async (): Promise<void> => {
  const db = await initDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};
