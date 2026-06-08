import React from 'react';

export default function StatsCard({ title, value, icon: Icon, change, trendUp, type = 'cyan', subtitle }) {
  // Determine border and text styling based on card type
  const getPanelClass = () => {
    switch (type) {
      case 'magenta': return 'panel-critical';
      case 'green': return 'panel-success';
      case 'yellow': return 'panel-warning';
      default: return '';
    }
  };

  const getTextColorClass = () => {
    switch (type) {
      case 'magenta': return 'neon-text-magenta';
      case 'green': return 'neon-text-green';
      case 'yellow': return 'neon-text-yellow';
      default: return 'neon-text-cyan';
    }
  };

  return (
    <div className={`cyber-panel stats-card ${getPanelClass()}`}>
      <div className="stats-card-header">
        <span>{title}</span>
        {Icon && <Icon size={18} className={getTextColorClass()} />}
      </div>
      
      <div className="stats-card-body">
        <div className={`tech-value ${getTextColorClass()}`}>
          {value}
        </div>
      </div>
      
      <div className="stats-card-footer">
        {change && (
          <span style={{ 
            color: trendUp ? 'var(--neon-green)' : 'var(--neon-magenta)',
            fontWeight: 'bold'
          }}>
            {change}
          </span>
        )}
        <span>{subtitle}</span>
      </div>
    </div>
  );
}
