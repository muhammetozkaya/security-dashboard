import React, { useState, useEffect } from 'react';
import { ShieldAlert, Terminal, Wifi, Cpu, Clock } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('tr-TR', { hour12: false });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <header className="cyber-navbar">
      <div className="nav-brand">
        <ShieldAlert size={28} className="neon-text-cyan" />
        <div>
          <h1 className="cyber-title neon-text-cyan" style={{ fontSize: '1.4rem', margin: 0 }}>
            NEON SHIELD
          </h1>
          <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-tech)', letterSpacing: '2px', color: 'var(--text-muted)' }}>
            THREAT OPERATIONS CENTER // V1.0.4
          </span>
        </div>
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Terminal size={14} />
          Terminal
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'hash' ? 'active' : ''}`}
          onClick={() => setActiveTab('hash')}
        >
          <Cpu size={14} />
          Hash Analizi
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'ip' ? 'active' : ''}`}
          onClick={() => setActiveTab('ip')}
        >
          <Wifi size={14} />
          IP Sorgulama
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'cve' ? 'active' : ''}`}
          onClick={() => setActiveTab('cve')}
        >
          <ShieldAlert size={14} />
          CVE İstihbaratı
        </button>
      </nav>

      <div className="nav-meta">
        <div className="nav-meta-item">
          <span className="indicator-pulse-green"></span>
          <span style={{ color: 'var(--neon-green)', textShadow: 'var(--glow-green)' }}>SECURE</span>
        </div>
        <div className="nav-meta-item" style={{ gap: '0.4rem' }}>
          <Clock size={14} className="neon-text-cyan" />
          <span style={{ fontFamily: 'var(--font-tech)' }}>
            {formatDate(time)} | {formatTime(time)}
          </span>
        </div>
      </div>
    </header>
  );
}
