import React, { useEffect, useRef, useState } from 'react';
import '../../styles/main.css'; // Pastikan path CSS sesuai

// --- Interface untuk struktur data Agent ---
export interface AgentTool {
  name: string;
  url: string;
  primary_use: string[];
  strengths: string[];
}

// --- Props untuk komponen DetailAgent ---
interface DetailAgentProps {
  isOpen: boolean;
  agent: AgentTool | null;
  onClose: () => void;
}

// --- Komponen Utama ---
export default function DetailAgent({ isOpen, agent, onClose }: DetailAgentProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [avatarColor, setAvatarColor] = useState<string>('var(--accent)');

  // --- Efek untuk menghandle ESC key dan klik luar ---
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && 
          event.target instanceof Node && 
          modalRef.current.contains(event.target) && 
          event.target === modalRef.current) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.addEventListener('click', handleClickOutside);
      
      // Nonaktifkan scroll body saat modal terbuka
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // --- Hitung warna avatar berdasarkan nama ---
  useEffect(() => {
    if (agent) {
      const colors = ['var(--accent)', '#ffffff', '#4dabf7', '#ff922b', '#51cf66', '#f06595'];
      const nameHash = agent.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const colorIndex = nameHash % colors.length;
      setAvatarColor(colors[colorIndex]);
    }
  }, [agent]);

  // --- Handler untuk tombol actions ---
  const handleVisitWebsite = () => {
    if (agent?.url) {
      window.open(agent.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleAskAgent = () => {
    if (agent) {
      alert(`Fitur "Tanya ${agent.name}" masih dalam pengembangan.\nAkan terhubung ke chat interface nantinya.`);
    }
  };

  // Jika modal tidak terbuka, jangan render apa-apa
  if (!isOpen || !agent) return null;

  return (
    <div 
      ref={modalRef}
      className={`overlay ${isOpen ? 'active' : ''}`} 
      id="agentDetailModal"
      style={{ 
        position: 'fixed', 
        inset: 0, 
        zIndex: 2000,
        display: isOpen ? 'flex' : 'none'
      }}
    >
      <div 
        className="sheet" 
        style={{ 
          maxWidth: '500px',
          width: '100%',
          background: '#141f18',
          borderTop: '1px solid var(--glass-border)',
          borderRadius: '24px 24px 0 0',
          padding: '10px 20px 40px 20px',
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
          transition: 'transform 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle untuk drag (mobile) */}
        <div className="sheet-handle" style={{
          width: '40px',
          height: '5px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '10px',
          margin: '0 auto 20px auto'
        }}></div>
        
        {/* Agent Header dengan Avatar */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div 
            id="detail-agent-avatar" 
            className="ai-avatar" 
            style={{ 
              width: '60px', 
              height: '60px', 
              margin: '0 auto 10px', 
              background: avatarColor, 
              color: avatarColor === '#ffffff' || avatarColor === '#4dabf7' || avatarColor === '#f06595' ? '#000' : '#fff',
              fontSize: '24px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255,255,255,0.1)'
            }}
          >
            <i className="fi fi-sr-robot"></i>
          </div>
          <h3 
            id="detail-agent-name" 
            style={{ 
              fontFamily: 'var(--font-head)', 
              fontSize: '24px',
              color: 'var(--text-main)',
              marginBottom: '4px'
            }}
          >
            {agent.name}
          </h3>
          <p 
            id="detail-agent-url" 
            style={{ 
              fontSize: '13px', 
              color: 'var(--text-muted)',
              wordBreak: 'break-all',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {agent.url}
          </p>
        </div>
        
        {/* Primary Use */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            color: 'var(--text-muted)',
            fontSize: '12px',
            marginBottom: '6px',
            fontWeight: '500'
          }}>
            Primary Use
          </label>
          <div 
            id="detail-agent-primary-use" 
            style={{ 
              display: 'block', 
              padding: '12px', 
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '12px',
              maxHeight: '120px', 
              overflowY: 'auto',
              border: '1px solid var(--glass-border)'
            }}
          >
            {agent.primary_use.map((use, index) => (
              <span 
                key={index}
                style={{
                  display: 'inline-block',
                  background: 'rgba(205,255,101,0.1)',
                  color: 'var(--accent)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  margin: '2px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                {use}
              </span>
            ))}
          </div>
        </div>
        
        {/* Strengths */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            color: 'var(--text-muted)',
            fontSize: '12px',
            marginBottom: '6px',
            fontWeight: '500'
          }}>
            Strengths
          </label>
          <div 
            id="detail-agent-strengths" 
            style={{ 
              display: 'block', 
              padding: '12px', 
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '12px',
              maxHeight: '120px', 
              overflowY: 'auto',
              border: '1px solid var(--glass-border)'
            }}
          >
            {agent.strengths.map((strength, index) => (
              <span 
                key={index}
                style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-main)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  margin: '2px',
                  fontSize: '12px'
                }}
              >
                {strength}
              </span>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginTop: '30px',
          flexDirection: window.innerWidth < 600 ? 'column' : 'row'
        }}>
          <button 
            id="detail-ask-button"
            className="btn-action btn-primary"
            onClick={handleAskAgent}
            style={{ 
              flex: 1,
              padding: '14px',
              background: 'var(--accent)',
              color: 'var(--bg-deep)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              fontFamily: 'var(--font-ui)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'filter 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
          >
            <i className="ph ph-chat-text"></i>
            Tanya <span id="ask-agent-name">{agent.name}</span>
          </button>
          
          <button 
            id="detail-visit-button"
            className="btn-action"
            onClick={handleVisitWebsite}
            style={{ 
              flex: 1,
              padding: '14px',
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--accent)',
              border: '1px solid rgba(205, 255, 101, 0.2)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              fontFamily: 'var(--font-ui)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(205, 255, 101, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(205, 255, 101, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(205, 255, 101, 0.2)';
            }}
          >
            <i className="ph ph-globe-hemisphere-west"></i>
            Visit Website
          </button>
        </div>
        
        {/* Close Button */}
        <button 
          id="closeAgentDetail"
          className="btn-action"
          onClick={onClose}
          style={{ 
            width: '100%', 
            marginTop: '15px', 
            padding: '12px',
            background: 'rgba(255,255,255,0.02)',
            color: 'var(--text-muted)',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'var(--font-ui)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.color = 'var(--text-main)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <i className="ph ph-x"></i>
          Close
        </button>
      </div>
    </div>
  );
}
