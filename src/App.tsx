import React, { useState, useEffect } from 'react';
import AppShell from './shell/AppShell';
import FabModal from './shell/FabModal';
import FilterAgents from './components/agents/FilterAgents';
import DetailAgent, { AgentTool } from './components/agents/DetailAgent';

// Import JSON
import { loadWorkflow } from '@/data/workflow';

// Styles
import './styles/main.css';

function App() {
  // --- State Management ---
  const [selectedAgent, setSelectedAgent] = useState<AgentTool | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [allAgents, setAllAgents] = useState<AgentTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFabModalOpen, setIsFabModalOpen] = useState(false); // State untuk FabModal

  // --- Load Data dari JSON lokal (via import) ---
  useEffect(() => {
    const loadAgentsData = async () => {
      try {
        setIsLoading(true);

        const data = workflowIntelligence;
        // Sesuaikan 'ai_tools' dengan kunci aktual di JSON Anda
        const agentsArray = Object.values(data.ai_tools || data.agents || data) as AgentTool[];

        setAllAgents(agentsArray);
      } catch (error) {
        console.error('Error loading agents data from import:', error);
        setAllAgents(getExampleAgents());
      } finally {
        setIsLoading(false);
      }
    };

    loadAgentsData();
  }, []);

  // --- Data contoh sebagai fallback ---
  const getExampleAgents = (): AgentTool[] => [
    {
      name: "ChatGPT",
      url: "https://chat.openai.com",
      primary_use: ["Coding", "Writing", "Research", "Analysis"],
      strengths: ["Natural Language", "Code Generation", "Creative Writing", "Context Understanding"]
    },
    {
      name: "Claude",
      url: "https://claude.ai",
      primary_use: ["Writing", "Analysis", "Summarization"],
      strengths: ["Long Context", "Safety", "Detailed Responses", "Document Processing"]
    },
    {
      name: "Gemini",
      url: "https://gemini.google.com",
      primary_use: ["Multimodal", "Coding", "Research"],
      strengths: ["Image Understanding", "Real-time Web Search", "Code Execution", "Multilingual"]
    },
    {
      name: "Midjourney",
      url: "https://www.midjourney.com",
      primary_use: ["Image Generation", "Art Creation", "Design"],
      strengths: ["High Quality", "Artistic Styles", "Prompt Understanding", "Community"]
    },
    {
      name: "Perplexity",
      url: "https://www.perplexity.ai",
      primary_use: ["Research", "Question Answering", "Fact Checking"],
      strengths: ["Source Citations", "Real-time Data", "Accuracy", "Concise Answers"]
    }
  ];

  // --- Handler untuk klik agent ---
  const handleAgentClick = (agent: AgentTool) => {
    setSelectedAgent(agent);
    setIsDetailModalOpen(true);
    console.log('Agent clicked:', agent.name);
  };

  // --- Handler untuk menutup modal ---
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedAgent(null);
  };

  // --- Handler untuk FAB click ---
  const handleFabClick = () => {
    setIsFabModalOpen(true);
  };

  // --- Render Loading State ---
  if (isLoading) {
    return (
      <div className="app-container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: 'var(--bg-deep)',
          color: 'var(--text-main)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <i className="ph ph-spinner" style={{ 
              fontSize: '48px', 
              color: 'var(--accent)', 
              animation: 'spin 1s linear infinite',
              marginBottom: '20px'
            }}></i>
            <h3>Loading AI Command Center...</h3>
            <p style={{ color: 'var(--text-muted)' }}>Initializing your AI workforce</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Ambient Glow */}
      <div className="ambient-glow"></div>
      
      {/* Header */}
      <header className="header">
        <div className="brand">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 28 25" width="550" height="550" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
            <path d="M9 21v-2.5h6v2.5" fill="none"/>
            <path d="M9 21h-6v-15a5 5 0 0 1 4-5h9a5 5 0 0 1 5 5v15h-6" fill="none"/>
            <path d="M16 6h-8c-1.105 0-2 .895-2 2v5c0 1.105.895 2 2 2h8c1.105 0 2-.895 2-2v-5c0-1.105-.895-2-2-2zM9.5 12c-.828 0-1.5-.672-1.5-1.5S8.672 9 9.5 9 11 9.672 11 10.5 10.328 12 9.5 12zm5 0c-.828 0-1.5-.672-1.5-1.5S13.672 9 14.5 9 16 9.672 16 10.5 15.328 12 14.5 12z" fill="currentColor" style={{ color: 'var(--accent)' }} stroke="none"/>
            <circle cx="2" cy="11" r="1" fill="none"/>
            <circle cx="22" cy="11" r="1" fill="none"/>
          </svg>
          <span>SoverInt. <span style={{ color: 'var(--accent)', fontWeight: '300' }}>PRO</span></span>
        </div>
        <div className="user-avatar" style={{ 
          width: '32px', 
          height: '32px', 
          background: 'var(--glass-border)', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <i className="fi fi-rr-user" style={{ fontSize: '12px' }}></i>
        </div>
      </header>

      {/* Blur Overlay untuk desktop */}
      <div className="blur-overlay"></div>

      {/* Gunakan AppShell untuk mengelilingi panel dan navigasi */}
      <AppShell>
        {/* Panel 1: Neural Search */}
        <section id="panel-magnify" className="panel">
          <div className="page-header">
            <h1>Neural Search</h1>
            <p>Access the global database node.</p>
          </div>
          <div className="card-glass" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px' }}>
            <i className="ph ph-magnifying-glass" style={{ color: 'var(--text-muted)' }}></i>
            <input 
              type="text" 
              placeholder="Command or Search..." 
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                width: '100%',
                fontFamily: 'var(--font-ui)',
                fontSize: '14px'
              }}
            />
          </div>
        </section>

        {/* Panel 2: Command Center */}
        <section id="panel-misi" className="panel">
          <div className="page-header">
            <h1>Command Center</h1>
            <p>Orchestrate your AI agents & active missions.</p>
          </div>

          <div className="stats-row">
            <div className="card-glass stat-card">
              <span className="stat-num">3</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="card-glass stat-card">
              <span className="stat-num">89%</span>
              <span className="stat-label">Efficiency</span>
            </div>
            <div className="card-glass stat-card">
              <span className="stat-num">{allAgents.length}</span>
              <span className="stat-label">Agents</span>
            </div>
          </div>

          <div className="grid-misi">
            <div className="card-glass mission-card">
              <div className="mission-header">
                <span className="mission-title">Landing Page AetherOS</span>
                <span className="badge process">Running</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Deployed Agents:</p>
              <div className="ai-squad">
                <div className="ai-avatar"><i className="fi fi-sr-robot"></i></div>
                <div className="ai-avatar"><i className="fi fi-rr-bug"></i></div>
                <div className="ai-avatar" style={{ borderStyle: 'dashed', opacity: 0.5 }}><i className="ph ph-plus"></i></div>
              </div>
              <div className="mission-actions">
                <button className="btn-action btn-primary">Monitor <i className="ph ph-activity"></i></button>
                <button className="btn-action btn-danger"><i className="ph ph-trash"></i></button>
              </div>
            </div>

            <div className="card-glass mission-card">
              <div className="mission-header">
                <span className="mission-title">Instagram Content Gen</span>
                <span className="badge done">Success</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Deployed Agents:</p>
              <div className="ai-squad">
                <div className="ai-avatar"><i className="fi fi-sr-palette"></i></div>
                <div className="ai-avatar"><i className="fi fi-sr-pencil"></i></div>
              </div>
              <div className="mission-actions">
                <button className="btn-action btn-primary">Result <i className="ph ph-check"></i></button>
                <button className="btn-action btn-danger"><i className="ph ph-trash"></i></button>
              </div>
            </div>
            
            <div className="card-glass mission-card" style={{ borderStyle: 'dashed', opacity: 0.6, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <i className="ph ph-plus-circle" style={{ fontSize: '20px' }}></i> Initialize New Mission
              </span>
            </div>
          </div>
        </section>

        {/* Panel 3: Agents Roster */}
        <section id="panel-agents" className="panel">
          <FilterAgents 
            initialAgents={allAgents}
            onAgentClick={handleAgentClick}
          />
        </section>

        {/* Panel 4: System Config */}
        <section id="panel-gear" className="panel">
          <div className="page-header">
            <h1>System Config</h1>
            <p>Adjust core parameters.</p>
          </div>
          <div className="card-glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span>Haptic Feedback</span>
              <i className="fi fi-sr-toggle-on" style={{ color: 'var(--accent)', fontSize: '20px' }}></i>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
              <span>Data Saver Mode</span>
              <i className="fi fi-rr-toggle-off" style={{ color: 'var(--text-muted)', fontSize: '20px' }}></i>
            </div>
          </div>
        </section>
      </AppShell>

      {/* Modal Detail Agent */}
      <DetailAgent 
        isOpen={isDetailModalOpen}
        agent={selectedAgent}
        onClose={handleCloseDetailModal}
      />

      {/* Gunakan FabModal yang diatur oleh state */}
      <FabModal 
        isOpen={isFabModalOpen}
        onClose={() => setIsFabModalOpen(false)}
      />
    </div>
  );
}

export default App;
