// src/hooks/useIndexedDB.ts

import { useState, useEffect } from 'react';
import { Mission } from '../types/mission.types';
import { AgentTool } from '../types/agent.types';

// Nama database dan object store
const DB_NAME = 'SoverIntDB';
const DB_VERSION = 1;
const MISSIONS_STORE = 'missions';
const AGENTS_STORE = 'agents'; // Opsional, jika ingin menyimpan agen juga

interface DBService {
  saveMission: (mission: Mission) => Promise<void>;
  getMissionById: (id: string) => Promise<Mission | undefined>;
  updateMission: (mission: Mission) => Promise<void>;
  deleteMission: (id: string) => Promise<void>;
  getAllMissions: () => Promise<Mission[]>;
  // Tambahkan fungsi lain sesuai kebutuhan
}

export const useIndexedDB = (): DBService => {
  const [db, setDb] = useState<IDBDatabase | null>(null);

  useEffect(() => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Database failed to open');
    };

    request.onsuccess = () => {
      setDb(request.result);
    };

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(MISSIONS_STORE)) {
        const objectStore = db.createObjectStore(MISSIONS_STORE, { keyPath: 'mission_id' });
        objectStore.createIndex('created_at', 'created_at', { unique: false });
        objectStore.createIndex('status', 'status', { unique: false });
      }
      // Tambahkan store lain jika diperlukan
      if (!db.objectStoreNames.contains(AGENTS_STORE)) {
        db.createObjectStore(AGENTS_STORE, { keyPath: 'name' });
      }
    };
  }, []);

  const saveMission = async (mission: Mission): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject('Database not ready');
        return;
      }
      const transaction = db.transaction([MISSIONS_STORE], 'readwrite');
      const objectStore = transaction.objectStore(MISSIONS_STORE);
      const request = objectStore.put(mission);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const getMissionById = async (id: string): Promise<Mission | undefined> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject('Database not ready');
        return;
      }
      const transaction = db.transaction([MISSIONS_STORE], 'readonly');
      const objectStore = transaction.objectStore(MISSIONS_STORE);
      const request = objectStore.get(id);

      request.onsuccess = () => {
        resolve(request.result || undefined);
      };
      request.onerror = () => reject(request.error);
    });
  };

  const updateMission = async (mission: Mission): Promise<void> => {
    // Sama seperti saveMission, karena put akan mengupdate jika key sudah ada
    return saveMission(mission);
  };

  const deleteMission = async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject('Database not ready');
        return;
      }
      const transaction = db.transaction([MISSIONS_STORE], 'readwrite');
      const objectStore = transaction.objectStore(MISSIONS_STORE);
      const request = objectStore.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const getAllMissions = async (): Promise<Mission[]> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject('Database not ready');
        return;
      }
      const transaction = db.transaction([MISSIONS_STORE], 'readonly');
      const objectStore = transaction.objectStore(MISSIONS_STORE);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => reject(request.error);
    });
  };

  // Kembalikan fungsi-fungsi yang bisa digunakan oleh service atau komponen
  return {
    saveMission,
    getMissionById,
    updateMission,
    deleteMission,
    getAllMissions,
  };
};