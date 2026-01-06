// src/services/mission.service.ts

import { Mission, AddMissionState } from '../types/mission.types';
import { SelectedAgent } from '../types/agent.types';

// Interface untuk operasi database (sama seperti sebelumnya)
interface DatabaseService {
  saveMission: (mission: Mission) => Promise<void>;
  getMissionById: (id: string) => Promise<Mission | undefined>;
  updateMission: (mission: Mission) => Promise<void>;
  deleteMission: (id: string) => Promise<void>;
  getAllMissions: () => Promise<Mission[]>;
}

// --- Fungsi-fungsi Service (sama seperti sebelumnya, ditambahkan fungsi baru) ---
export const createMission = async (
  mission: Mission,
  dbService: DatabaseService
): Promise<void> => {
  if (!mission.mission_id) {
    throw new Error('Mission must have a mission_id');
  }
  await dbService.saveMission(mission);
};

export const getMission = async (
  id: string,
  dbService: DatabaseService
): Promise<Mission | undefined> => {
  return await dbService.getMissionById(id);
};

export const updateMission = async (
  mission: Mission,
  dbService: DatabaseService
): Promise<void> => {
  if (!mission.mission_id) {
    throw new Error('Mission must have a mission_id to update');
  }
  await dbService.updateMission(mission);
};

export const deleteMission = async (
  id: string,
  dbService: DatabaseService
): Promise<void> => {
  await dbService.deleteMission(id);
};

export const getAllMissions = async (
  dbService: DatabaseService
): Promise<Mission[]> => {
  return await dbService.getAllMissions();
};

// --- Fungsi tambahan untuk workflow ---
export const buildMissionObject = (state: AddMissionState): Mission => {
  if (!state.mission_id || !state.name || !state.category) {
    throw new Error('Incomplete mission state to build object');
  }

  // Kita asumsikan state sudah lengkap untuk domain tertentu (writing atau coding)
  return state as Mission; // Type assertion karena kita yakin state sudah lengkap
};

// --- Fungsi baru: Menambahkan atau memperbarui agent team ke dalam misi ---
export const addSelectedAgentsToMission = async (
  missionId: string,
  selectedAgents: SelectedAgent[],
  dbService: DatabaseService
): Promise<void> => {
  const mission = await getMission(missionId, dbService);
  if (!mission) {
    throw new Error('Mission not found');
  }

  // Perbarui properti ai_team
  mission.ai_team = selectedAgents;

  await updateMission(mission, dbService);
};