import { useState, useEffect } from "react";

export default function FabModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleAction = () => {
    setLoading(true);
    // Simulasi proses
    setTimeout(() => {
      setLoading(false);
      onClose(); // Tutup modal setelah selesai
    }, 800);
  };

  // Fungsi untuk menutup saat klik luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const overlay = document.getElementById('modalOverlay');
      if (overlay && e.target === overlay) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div id="modalOverlay" className="overlay active">
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle"></div>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '24px' }}>Initialize Mission</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Assign a new task to your AI swarm.</p>
        </div>
        
        <div className="form-group">
          <label>Mission Name</label>
          <input type="text" className="input-field" placeholder="e.g. Generate Q1 Report" />
        </div>
        <div className="form-group">
          <label>Select Agent</label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
            <div className="ai-avatar" style={{ background: 'var(--accent)', color: '#000' }}><i className="fi fi-sr-robot"></i></div>
            <div className="ai-avatar"><i className="fi fi-sr-palette"></i></div>
            <div className="ai-avatar"><i className="fi fi-sr-pencil"></i></div>
          </div>
        </div>
        
        <button 
          className="btn-action btn-primary" 
          style={{ width: '100%', marginTop: '10px', background: 'var(--accent)', color: 'var(--bg-deep)' }}
          onClick={handleAction}
          disabled={loading}
        >
          <i className="ph ph-rocket-launch"></i> {loading ? 'Launching...' : 'Launch Mission'}
        </button>
      </div>
    </div>
  );
}