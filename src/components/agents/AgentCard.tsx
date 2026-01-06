import React from 'react';
import { AgentTool } from './DetailAgent';

interface AgentCardProps {
  agent: AgentTool;
  onDetailClick: (agent: AgentTool) => void;
  getAvatarColor?: (name: string) => string;
  isPopular?: boolean;
}

export default function AgentCard({ 
  agent, 
  onDetailClick, 
  getAvatarColor, 
  isPopular 
}: AgentCardProps) {
  // Warna avatar: gunakan fungsi dari props jika ada, atau hitung secara lokal
  const colors = ['var(--accent)', '#ffffff', '#4dabf7', '#ff922b', '#51cf66', '#f06595'];
  const nameHash = agent.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = nameHash % colors.length;
  const avatarColor = getAvatarColor ? getAvatarColor(agent.name) : colors[colorIndex];
  
  // Tentukan warna teks berdasarkan kontras
  const textColor = avatarColor === '#ffffff' || avatarColor === '#4dabf7' || avatarColor === '#f06595' ? '#000' : '#fff';
  
  // Tampilkan badge popular berdasarkan prop atau daftar default
  const defaultPopularAgents = ['ChatGPT', 'Claude', 'Gemini'];
  const showPopularBadge = isPopular !== undefined 
    ? isPopular 
    : defaultPopularAgents.includes(agent.name);

  return (
    <div
      className="card-glass agent-card"
      onClick={() => onDetailClick(agent)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        cursor: 'pointer',
        transition: 'transform 0.2s, border-color 0.2s',
        position: 'relative',
        zIndex: 1
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = 'rgba(205,255,101,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--glass-border)';
      }}
    >
      <div 
        className="ai-avatar"
        style={{
          width: '50px',
          height: '50px',
          background: avatarColor,
          color: textColor,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}
      >
        <i className="fi fi-sr-robot"></i>
      </div>
      
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '16px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {agent.name}
          {showPopularBadge && (
            <span style={{ 
              fontSize: '10px', 
              background: 'rgba(205,255,101,0.2)', 
              color: 'var(--accent)', 
              padding: '2px 6px', 
              borderRadius: '10px' 
            }}>
              POPULAR
            </span>
          )}
        </h3>
        
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          {agent.primary_use.slice(0, 2).join(', ')}
          {agent.primary_use.length > 2 && '...'}
        </p>
        
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {agent.strengths.slice(0, 2).map((strength, index) => (
            <span 
              key={index}
              style={{
                fontSize: '10px',
                background: 'rgba(255,255,255,0.05)',
                padding: '2px 6px',
                borderRadius: '10px',
                color: 'var(--text-muted)'
              }}
            >
              {strength}
            </span>
          ))}
          {agent.strengths.length > 2 && (
            <span style={{
              fontSize: '10px',
              background: 'rgba(205,255,101,0.1)',
              padding: '2px 6px',
              borderRadius: '10px',
              color: 'var(--accent)'
            }}>
              +{agent.strengths.length - 2}
            </span>
          )}
        </div>
      </div>
      
      <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
        <i className="ph ph-info"></i>
      </div>
    </div>
  );
}