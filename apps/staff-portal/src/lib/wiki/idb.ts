const DB_NAME = 'campLawtonWiki';
const DB_VERSION = 1;
const STORE_NAME = 'articles';

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  section?: string;
  content: string;
  offline_priority?: number;
  tags?: string[];
  aliases?: string[];
  revision_no?: number;
}

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('IndexedDB is not available on the server.'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'slug' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveArticlesToIDB = async (articles: Article[]): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      // Clear existing cache first to avoid stale orphan articles
      const clearReq = store.clear();
      
      clearReq.onsuccess = () => {
        articles.forEach((article) => {
          store.put(article);
        });
      };

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.warn('Failed to save articles to IndexedDB:', err);
  }
};

export const loadArticlesFromIDB = async (): Promise<Article[]> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const result = request.result || [];
        resolve(result as Article[]);
      };
      
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed to load articles from IndexedDB:', err);
    return [];
  }
};
