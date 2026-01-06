// src/types/mission.types.ts

// --- Import tipe dari agent.types.ts ---
import { SelectedAgent } from './agent.types';

// --- Core Schema (dari soverint_core_schema.json) ---
export interface MissionCoreSchema {
  mission_id: string; // UUID unik untuk setiap misi
  created_at: string; // Tanggal pembuatan (ISO string)
  status: 'draft' | 'active' | 'completed' | 'failed'; // Status misi

  name: string;
  description: string;
  intent_summary: string;

  category: {
    id: 1 | 2; // 1 = Writing, 2 = Coding & Programming
    name: 'Writing' | 'Coding & Programming';
  };
}

// --- Domain Schema: Writing (dari soverint_domain_writing_schema.json) ---
export interface WritingDomainSchema {
  domain: 'writing';

  subcategory: {
    id: '1.1' | '1.2' | '1.3' | '1.4' | '1.5' | '1.6' | '1.7' | '1.8' | '1.9' | '1.10' | '1.11' | '1.12';
    name: string; // Nama subkategori, sesuai dengan id
  };

  intent_schema: {
    purpose: 'Educate' | 'Inform' | 'Entertain' | 'Persuade' | 'Document';
    target_audience: string;
    language: 'id' | 'en' | 'other';
  };

  preference_schema: {
    tone: 'Formal' | 'Casual' | 'Technical' | 'Storytelling';
    approx_length: 'Short' | 'Medium' | 'Long';
  };

  context_schema: {
    references?: string[]; // URL array, opsional
    style_reference?: string; // string, opsional
    existing_assets?: File[]; // File array, opsional (akan menjadi string path setelah upload)
    notes?: string; // text, opsional
  };
}

// --- Domain Schema: Coding & Programming (dari soverint_domain_coding_schema.json) ---
export interface CodingDomainSchema {
  domain: 'coding_programming';

  subcategory: {
    id: '2.1' | '2.2' | '2.3' | '2.4' | '2.5' | '2.6';
    name: string; // Nama subkategori, sesuai dengan id
  };

  intent_schema: {
    purpose: 'Build' | 'Refactor' | 'Optimize' | 'Debug' | 'Integrate';
    target_users: string;
    complexity: 'Simple' | 'Medium' | 'Complex';
  };

  technical_direction_schema: {
    environment: 'Web' | 'Mobile' | 'Backend' | 'CLI' | 'Hybrid';
    preferred_stack: ('JavaScript' | 'Python' | 'Other')[]; // Array, karena bisa lebih dari satu
  };

  constraint_schema: {
    timeline: '1-2 days' | '1 week' | '2-4 weeks' | '1-3 months';
    quality_focus: ('Performance' | 'Security' | 'Maintainability')[];
  };

  context_schema: {
    references?: string[]; // URL array, opsional
    dependencies?: string[]; // string array, opsional
    existing_codebase?: File[]; // File array, opsional (akan menjadi string path setelah upload)
    notes?: string; // text, opsional
  };
}

// --- Gabungan Domain Schema ---
export type DomainSchema = WritingDomainSchema | CodingDomainSchema;

// --- Mission Type Final ---
// Ini adalah tipe lengkap dari sebuah misi, menggabungkan Core dan salah satu Domain
export interface Mission extends MissionCoreSchema, Omit<DomainSchema, keyof MissionCoreSchema> {
  // Tidak perlu duplikasi properti, karena `extends` dan `Omit` menanganinya
  // `Omit` digunakan untuk mencegah konflik antara `category` dari MissionCoreSchema dan DomainSchema
  // Properti tambahan:
  ai_team?: SelectedAgent[]; // Daftar agent yang dipilih untuk fase-fase tertentu (dari AISelection)
  updated_at?: string; // Tanggal terakhir diupdate (opsional)
}

// --- Type untuk input form tahap 1 (Core) ---
export interface MissionCoreFormData {
  name: string;
  description: string;
  intent_summary: string;
  category: {
    id: 1 | 2;
    name: 'Writing' | 'Coding & Programming';
  };
}

// --- Type untuk input form tahap 2 (Domain) ---
// Kita gunakan type guard untuk membedakan antara writing dan coding
export type MissionDomainFormData = WritingDomainSchema | CodingDomainSchema;

// --- Type untuk state AddMissionFlow ---
// Gunakan Partial karena state disusun secara bertahap
export interface AddMissionState extends Partial<MissionCoreSchema>, Partial<DomainSchema> {
  ai_team?: SelectedAgent[]; // Tambahkan di sini juga untuk state flow
  // State awal kosong, lalu diisi secara bertahap
  // Gunakan Partial karena tidak semua field diisi sekaligus
}