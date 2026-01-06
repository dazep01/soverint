import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AgentTool } from './DetailAgent';

interface FilterAgentsProps {
  initialAgents: AgentTool[];
  onAgentClick: (agent: AgentTool) => void;
}

type FilterType = 'name-asc' | 'name-desc' | 'featured';

export default function FilterAgents({ initialAgents, onAgentClick }: FilterAgentsProps) {
  // --- State Management ---
  const [filteredAgents, setFilteredAgents] = useState<AgentTool[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('name-asc');
  const [currentSearch, setCurrentSearch] = useState('');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // --- Refs ---
  const searchInputRef = useRef<HTMLInputElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  // --- Constants ---
  const filterTextMap: Record<FilterType, string> = {
    'name-asc': 'A-Z',
    'name-desc': 'Z-A',
    'featured': 'Featured'
  };

  const featuredNames = ['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'Midjourney'];

  // --- Avatar Color Generator ---
  const getAvatarColor = useCallback((name: string): string => {
    const colors = ['var(--accent)', '#ffffff', '#4dabf7', '#ff922b', '#51cf66', '#f06595'];
    const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = nameHash % colors.length;
    return colors[colorIndex];
  }, []);

  // --- Filter and Sort Logic ---
  const filterAndSortAgents = useCallback(() => {
    let agentsToRender = [...initialAgents];

    // Apply search filter
    if (currentSearch.trim() !== '') {
      const searchTerm = currentSearch.toLowerCase();
      agentsToRender = agentsToRender.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm) ||
        agent.primary_use.some(use => use.toLowerCase().includes(searchTerm)) ||
        agent.strengths.some(strength => strength.toLowerCase().includes(searchTerm))
      );
    }

    // Apply sorting
    switch (currentFilter) {
      case 'name-asc':
        agentsToRender.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        agentsToRender.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'featured':
        agentsToRender.sort((a, b) => {
          const aIndex = featuredNames.indexOf(a.name);
          const bIndex = featuredNames.indexOf(b.name);
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          return a.name.localeCompare(b.name);
        });
        break;
    }

    setFilteredAgents(agentsToRender);
  }, [initialAgents, currentFilter, currentSearch]);

  // --- Event Handlers ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSearch(e.target.value);
  };

  const handleFilterChange = (filter: FilterType) => {
    setCurrentFilter(filter);
    setIsFilterMenuOpen(false);
  };

  const handleClearFilters = () => {
    setCurrentSearch('');
    setCurrentFilter('name-asc');
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
  };

  // --- Hotkey Support ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on '/' key
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }

      // Clear search on Escape
      if (e.key === 'Escape' && searchInputRef.current && searchInputRef.current.value !== '') {
        handleClearFilters();
        searchInputRef.current.focus();
      }

      // Close filter menu on Escape
      if (e.key === 'Escape' && isFilterMenuOpen) {
        setIsFilterMenuOpen(false);
      }
    };

    // Close filter menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterMenuRef.current && 
        !filterMenuRef.current.contains(event.target as Node) &&
        filterButtonRef.current && 
        !filterButtonRef.current.contains(event.target as Node)
      ) {
        setIsFilterMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterMenuOpen]);

  // --- Initialize filtered agents ---
  useEffect(() => {
    filterAndSortAgents();
  }, [filterAndSortAgents]);

  return (
    <>
      <div className="page-header">
        <h1>Agents Roster</h1>
        <p>Manage your specialized AI workforce.</p>
      </div>

      {/* Search & Filter Controls */}
      <div className="card-glass" style={{ marginBottom: '16px', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ flex: 1, position: 'relative' }}>
            <i 
              className="ph ph-magnifying-glass" 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--text-muted)', 
                zIndex: 1 
              }} 
            />
            <input
              ref={searchInputRef}
              type="text"
              id="agent-search"
              placeholder="Search AI agents..."
              value={currentSearch}
              onChange={handleSearchChange}
              style={{
                width: '100%',
                padding: '10px 10px 10px 36px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                color: '#fff',
                fontFamily: 'var(--font-ui)',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Filter Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              ref={filterButtonRef}
              id="filter-button"
              className="btn-action"
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              style={{
                padding: '10px 16px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-muted)',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="ph ph-funnel"></i>
              <span style={{ marginLeft: '6px' }} id="current-filter">
                {filterTextMap[currentFilter]}
              </span>
            </button>

            {/* Dropdown Menu */}
            {isFilterMenuOpen && (
              <div
                ref={filterMenuRef}
                id="filter-menu"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  width: '160px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  padding: '8px',
                  zIndex: 1000,
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button
                    className={`filter-option ${currentFilter === 'name-asc' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('name-asc')}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: currentFilter === 'name-asc' ? 'rgba(205,255,101,0.1)' : 'transparent',
                      border: 'none',
                      color: currentFilter === 'name-asc' ? 'var(--accent)' : 'var(--text-main)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <i className="ph ph-arrow-up" style={{ marginRight: '8px' }}></i>
                    A-Z
                  </button>
                  <button
                    className={`filter-option ${currentFilter === 'name-desc' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('name-desc')}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: currentFilter === 'name-desc' ? 'rgba(205,255,101,0.1)' : 'transparent',
                      border: 'none',
                      color: currentFilter === 'name-desc' ? 'var(--accent)' : 'var(--text-main)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <i className="ph ph-arrow-down" style={{ marginRight: '8px' }}></i>
                    Z-A
                  </button>
                  <hr style={{ border: 'none', height: '1px', background: 'var(--glass-border)', margin: '4px 0' }} />
                  <button
                    className={`filter-option ${currentFilter === 'featured' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('featured')}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: currentFilter === 'featured' ? 'rgba(205,255,101,0.1)' : 'transparent',
                      border: 'none',
                      color: currentFilter === 'featured' ? 'var(--accent)' : 'var(--text-main)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <i className="ph ph-star" style={{ marginRight: '8px' }}></i>
                    Featured
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Stats */}
        <div id="search-stats" style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
          <span>
            Showing <span id="agent-count" style={{ fontWeight: '600', color: 'var(--accent)' }}>{filteredAgents.length}</span> agents
          </span>
          {(currentSearch || currentFilter !== 'name-asc') && (
            <button
              id="clear-search"
              onClick={handleClearFilters}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent)',
                cursor: 'pointer',
                fontSize: '12px',
                padding: '2px 6px',
                borderRadius: '4px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(205,255,101,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Agents Grid Container */}
      <div className="grid-misi" id="ai-agents-container" style={{ paddingBottom: '100px' }}>
        {filteredAgents.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <i className="ph ph-magnifying-glass" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}></i>
            <h3 style={{ marginBottom: '8px', color: 'var(--text-main)' }}>No agents found</h3>
            <p>Try a different search term or filter</p>
          </div>
        ) : (
          filteredAgents.map((agent) => {
            const avatarColor = getAvatarColor(agent.name);
            const textColor = avatarColor === '#ffffff' || avatarColor === '#4dabf7' || avatarColor === '#f06595' ? '#000' : '#fff';

            return (
              <div
                key={agent.name}
                className="card-glass agent-card"
                onClick={() => onAgentClick(agent)}
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
                    {['ChatGPT', 'Claude', 'Gemini'].includes(agent.name) && (
                      <span style={{ fontSize: '10px', background: 'rgba(205,255,101,0.2)', color: 'var(--accent)', padding: '2px 6px', borderRadius: '10px' }}>
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
                      <span style={{ fontSize: '10px', background: 'rgba(205,255,101,0.1)', padding: '2px 6px', borderRadius: '10px', color: 'var(--accent)' }}>
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
          })
        )}
      </div>
    </>
  );
}