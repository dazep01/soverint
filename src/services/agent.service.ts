// src/services/agent.service.ts

import { AgentTool, WorkflowIntelligence, AIRecommendation } from '../types/agent.types';

// --- Fungsi untuk mengambil data dari JSON ---
export const loadWorkflowIntelligence = async (): Promise<WorkflowIntelligence> => {
  // Import statis adalah cara terbaik di Vite untuk mengakses file JSON
  const data = await import('../assets/data/soverint_workflow_intelligence.json');
  return data.default as WorkflowIntelligence;
};

// --- Fungsi untuk mengambil daftar semua agent tools ---
export const getAllAgentTools = async (): Promise<Record<string, AgentTool>> => {
  const workflow = await loadWorkflowIntelligence();
  return workflow.ai_tools;
};

// --- Fungsi untuk mencari agent berdasarkan `tool_id` dari rekomendasi ---
export const getAgentByToolId = async (toolId: string): Promise<AgentTool | undefined> => {
  const allTools = await getAllAgentTools();
  return allTools[toolId];
};

// --- Fungsi untuk mengambil rekomendasi agent untuk suatu fase ---
export const getPhaseRecommendations = async (categoryId: number, subcategoryId: string, phaseId: string): Promise<AIRecommendation[]> => {
  const workflow = await loadWorkflowIntelligence();
  const category = workflow.categories.find(cat => cat.id === categoryId);
  if (!category) return [];

  const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
  if (!subcategory) return [];

  const phase = subcategory.phases.find(p => p.id === phaseId);
  if (!phase) return [];

  return phase.ai_recommendations;
};

// --- Fungsi untuk mengambil semua rekomendasi untuk semua fase dalam suatu subkategori ---
export const getAllRecommendationsForSubcategory = async (categoryId: number, subcategoryId: string): Promise<Record<string, AIRecommendation[]>> => {
  const workflow = await loadWorkflowIntelligence();
  const category = workflow.categories.find(cat => cat.id === categoryId);
  if (!category) return {};

  const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
  if (!subcategory) return {};

  const recommendations: Record<string, AIRecommendation[]> = {};
  subcategory.phases.forEach(phase => {
    recommendations[phase.id] = phase.ai_recommendations;
  });

  return recommendations;
};

// --- Fungsi untuk mengambil agent tools berdasarkan rekomendasi (resolve `tool_id` ke `AgentTool`) ---
export const getAgentToolsFromRecommendations = async (recommendations: AIRecommendation[]): Promise<AgentTool[]> => {
  const agentTools: AgentTool[] = [];
  for (const rec of recommendations) {
    const tool = await getAgentByToolId(rec.tool_id);
    if (tool) {
      agentTools.push(tool);
    }
  }
  return agentTools;
};

// Jika Anda menyimpan agent yang dipilih ke DB
export const saveSelectedAgents = async (missionId: string, agents: any[]): Promise<void> => {
  console.log('Saving agents for mission:', missionId, agents);
  // Implementasi akan menggunakan useIndexedDB dari hook
};