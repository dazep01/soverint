import React, { useState, useEffect } from 'react';
import DetailAgent, { AgentTool } from './agents/DetailAgent';

interface AISelectionProps {
  missionData: any;
  onComplete: () => void;
}

const AISelection: React.FC<AISelectionProps> = ({ missionData, onComplete }) => {
  const [selectedAgents, setSelectedAgents] = useState<Record<string, AgentTool>>({});
  const [showDetail, setShowDetail] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentTool | null>(null);
  const [phases, setPhases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasi loading workflow intelligence dari JSON
    setTimeout(() => {
      const mockPhases = [
        {
          id: 'phase-1',
          name: 'Research & Planning',
          agents: [
            { 
              name: 'Research Agent', 
              url: 'https://soverint.ai/agents/researcher',
              primary_use: ['Data Collection', 'Market Research', 'Competitor Analysis'],
              strengths: ['Web Scraping', 'Data Structuring', 'Trend Analysis']
            },
            { 
              name: 'Planning Agent', 
              url: 'https://soverint.ai/agents/planner',
              primary_use: ['Project Timeline', 'Resource Allocation', 'Risk Assessment'],
              strengths: ['Gantt Chart', 'Milestone Planning', 'Stakeholder Mapping']
            }
          ]
        },
        {
          id: 'phase-2',
          name: 'Implementation',
          agents: [
            { 
              name: 'Development Agent', 
              url: 'https://soverint.ai/agents/developer',
              primary_use: ['Frontend Coding', 'API Integration', 'Testing'],
              strengths: ['React', 'TypeScript', 'RESTful APIs', 'Jest Testing']
            },
            { 
              name: 'Content Agent', 
              url: 'https://soverint.ai/agents/writer',
              primary_use: ['Creative Writing', 'SEO Content', 'Documentation'],
              strengths: ['Storytelling', 'Technical Writing', 'Copy Editing']
            }
          ]
        },
        {
          id: 'phase-3',
          name: 'Review & Optimization',
          agents: [
            { 
              name: 'Review Agent', 
              url: 'https://soverint.ai/agents/reviewer',
              primary_use: ['Code Review', 'Content Audit', 'Performance Check'],
              strengths: ['Quality Assurance', 'Optimization Suggestions', 'Bug Detection']
            }
          ]
        }
      ];
      setPhases(mockPhases);
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleSelectAgent = (agent: AgentTool) => {
    setSelectedAgent(agent);
    setShowDetail(true);
  };

  const handleRecruitAgent = (agent: AgentTool, phaseId: string) => {
    setSelectedAgents(prev => ({
      ...prev,
      [phaseId]: agent
    }));
    setShowDetail(false);
  };

  const handleExecuteMission = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onComplete();
    }, 2000);
  };

  if (isLoading && !showDetail) {
    return (
      <div className="loading-state">
        <div className="spinner">🔄</div>
        <p>menyiapkan misi dan tim agen AI rekomendasi...</p>
      </div>
    );
  }

  return (
    <div className="ai-selection">
      <h2>Pilih Tim AI untuk Misi Anda</h2>
      <p>Pilih agen AI untuk setiap fase dalam workflow Anda</p>

      <div className="phases-container">
        {phases.map((phase) => (
          <div key={phase.id} className="phase-section">
            <h3>{phase.name}</h3>
            <div className="agents-grid">
              {phase.agents.map((agent: AgentTool) => (
                <div key={agent.name} className="agent-card">
                  <h4>{agent.name}</h4>
                  <p className="agent-url">{agent.url}</p>
                  <div className="agent-actions">
                    <button 
                      onClick={() => handleSelectAgent(agent)}
                      className="btn-secondary"
                    >
                      Detail
                    </button>
                    <button 
                      onClick={() => handleRecruitAgent(agent, phase.id)}
                      className="btn-primary"
                    >
                      Rekrut
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedAgents[phase.id] && (
              <div className="selected-agent-badge">
                Terpilih: {selectedAgents[phase.id].name}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button 
          onClick={handleExecuteMission} 
          disabled={Object.keys(selectedAgents).length === 0}
          className="btn-primary"
        >
          {isLoading ? 'Misi disiapkan...' : 'Jalankan Misi'}
        </button>
      </div>

      <DetailAgent
        isOpen={showDetail}
        agent={selectedAgent}
        onClose={() => setShowDetail(false)}
      />
    </div>
  );
};

export default AISelection;