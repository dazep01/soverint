// src/types/agent.types.ts

// --- Agent Tool Definition (berdasarkan `ai_tools` dalam JSON) ---
export interface AgentTool {
  name: string;
  url: string;
  primary_use: string[]; // Contoh: ["research", "real-time data"]
  strengths: string[];   // Contoh: ["sumber terverifikasi", "pencarian real-time"]
  // Kita bisa tambahkan properti opsional jika diperlukan
  // misalnya `mark: string` dari JSON, meskipun tidak konsisten
  mark?: string; // "freemium", "paid", "free", dll
}

// --- Rekomendasi AI untuk suatu fase (dari `phases[].ai_recommendations`) ---
export interface AIRecommendation {
  tool_id: string; // Contoh: "perplexity", ini adalah key ke `ai_tools`
  reason: string;  // Deskripsi alasan
  mark?: string;   // "freemium", "paid", dll (opsional karena tidak selalu ada)
  url: string;     // URL alternatif (jika berbeda dari `ai_tools`)
}

// --- Struktur Fase (dari `subcategories[].phases`) ---
export interface WorkflowPhase {
  id: string;      // Contoh: "1.1.1"
  name: string;    // Contoh: "Riset dan Perencanaan"
  checklist: {
    tasks: string[];
    deliverables: string[];
    metrics: string[];
  };
  role: string;    // Contoh: "Senior Research Analyst."
  ai_recommendations: AIRecommendation[]; // Daftar rekomendasi agent
}

// --- Struktur Subkategori (dari `categories[].subcategories`) ---
export interface WorkflowSubcategory {
  id: string;      // Contoh: "1.1"
  name: string;    // Contoh: "Artikel"
  description: string;
  phases: WorkflowPhase[]; // Daftar fase
}

// --- Struktur Kategori (dari `categories`) ---
export interface WorkflowCategory {
  id: 1 | 2;       // 1 = Writing, 2 = Coding
  name: string;    // "Writing" | "Coding & Programming"
  description: string;
  hybrid_team_notes: string;
  subcategories: WorkflowSubcategory[];
}

// --- Struktur Root dari JSON ---
export interface WorkflowIntelligence {
  version: string;
  last_updated: string;
  trends_integrated: string[];
  categories: WorkflowCategory[];
  ai_tools: Record<string, AgentTool>; // Contoh: { "perplexity": { ... }, "chatgpt": { ... } }
  metadata: {
    total_categories: number;
    total_subcategories: number;
    total_phases: number;
    ai_tools_count: number;
    trends_count: number;
    scalability: string;
    phase_patterns: string[];
    last_verified: string;
    compliance_notes: string;
  };
}

// --- Tipe untuk agent yang dipilih untuk suatu fase (digunakan di UI) ---
export interface SelectedAgent {
  phaseId: string;
  agent: AgentTool;
  phaseName: string;
}