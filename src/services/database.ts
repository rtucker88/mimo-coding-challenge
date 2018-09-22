// This file handles using IndexedDB
export interface ILessonCompletion {
    start: string;
    end: string;
    id: number;
}

const dbName = 'MimoDB';

function init() {
    const request = window.indexedDB.open(dbName, 2);

    request.onupgradeneeded = (event) => {
        const db = (event.target as any).result;
    
        db.createObjectStore('lessonCompletions', { keyPath: 'id' });
    };    
}

export function saveCompletedLesson(completedLesson: ILessonCompletion) {
    const request = window.indexedDB.open(dbName, 2);

    return new Promise((resolve, reject) => {
        request.onerror = (event) => {
            reject(event);
        };
    
        request.onsuccess = (event) => {
            const db = (event.target as any).result;

            const transaction = db.transaction(['lessonCompletions'], 'readwrite');

            transaction.oncomplete = (e: any) => {
                resolve(e);
            }

            transaction.onerror = (e: any) => {
                reject(e);
            }

            const objectStore = transaction.objectStore('lessonCompletions');
            objectStore.add(completedLesson);
        };
    });
}

init();