import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, RefreshCw } from 'lucide-react';

// Seeding vectors for simulated threat generator
const ATTACK_VECTORS = [
  { type: 'SSH Brute Force', port: 22, severity: 'warning' },
  { type: 'SQL Injection', port: 3306, severity: 'critical' },
  { type: 'DDoS SYN Flood', port: 80, severity: 'critical' },
  { type: 'XSS Girişimi', port: 443, severity: 'info' },
  { type: 'TCP Port Tarama', port: 139, severity: 'info' },
  { type: 'Ransomware İndirme', port: 445, severity: 'critical' },
  { type: 'API Kimlik İhlali', port: 8080, severity: 'warning' }
];

const SOURCE_IPS = [
  { ip: '185.220.101.4', country: 'Almanya', code: 'DE' },
  { ip: '45.143.203.14', country: 'Rusya', code: 'RU' },
  { ip: '221.229.172.9', country: 'Çin', code: 'CN' },
  { ip: '104.244.75.13', country: 'ABD', code: 'US' },
  { ip: '185.190.140.24', country: 'Hollanda', code: 'NL' },
  { ip: '82.222.11.89', country: 'Türkiye', code: 'TR' },
  { ip: '190.111.45.2', country: 'Brezilya', code: 'BR' }
];

export default function ThreatMap() {
  const [threats, setThreats] = useState([
    {
      id: 1,
      time: '15:52:10',
      ip: '104.244.75.13',
      country: 'ABD',
      code: 'US',
      vector: 'TCP Port Tarama',
      port: 139,
      severity: 'info'
    },
    {
      id: 2,
      time: '15:52:14',
      ip: '45.143.203.14',
      country: 'Rusya',
      code: 'RU',
      vector: 'SSH Brute Force',
      port: 22,
      severity: 'warning'
    },
    {
      id: 3,
      time: '15:52:17',
      ip: '221.229.172.9',
      country: 'Çin',
      code: 'CN',
      vector: 'SQL Injection',
      port: 3306,
      severity: 'critical'
    }
  ]);

  const [packetLoad, setPacketLoad] = useState(42);
  const [threatCount, setThreatCount] = useState(142);

  useEffect(() => {
    // Periodically add new simulated threat
    const threatInterval = setInterval(() => {
      const vector = ATTACK_VECTORS[Math.floor(Math.random() * ATTACK_VECTORS.length)];
      const source = SOURCE_IPS[Math.floor(Math.random() * SOURCE_IPS.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      const newThreat = {
        id: Date.now(),
        time: timeStr,
        ip: source.ip,
        country: source.country,
        code: source.code,
        vector: vector.type,
        port: vector.port,
        severity: vector.severity
      };

      setThreats((prev) => {
        // Keep list to max 10 items to prevent bloating
        const updated = [newThreat, ...prev];
        return updated.slice(0, 10);
      });

      // Update packet rate randomly
      setPacketLoad(Math.floor(Math.random() * 50) + 35);
      // Increment total threat counter
      setThreatCount(prev => prev + 1);
    }, 3000);

    return () => clearInterval(threatInterval);
  }, []);

  return (
    <div className="cyber-panel threat-map-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 className="cyber-title neon-text-cyan" style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} />
          CANLI TEHDİT AKIŞI
        </h3>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-tech)', color: 'var(--text-muted)' }}>
          AKTİF SİMÜLASYON HIZI: 3.0s
        </span>
      </div>

      {/* Packet Load Progress Indicator */}
      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(0, 240, 255, 0.1)', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-tech)', marginBottom: '0.35rem' }}>
          <span>PAKET TRAFİK YÜKÜ</span>
          <span className="neon-text-cyan">{packetLoad} Gbps</span>
        </div>
        <div className="scan-bar-bg" style={{ margin: 0, height: '4px' }}>
          <div 
            className="scan-bar-fill" 
            style={{ 
              width: `${packetLoad}%`, 
              background: packetLoad > 75 ? 'var(--neon-magenta)' : 'var(--neon-cyan)',
              boxShadow: packetLoad > 75 ? 'var(--glow-magenta)' : 'var(--glow-cyan)' 
            }}
          ></div>
        </div>
      </div>

      <div className="threat-list">
        {threats.map((threat) => (
          <div 
            key={threat.id} 
            className={`threat-item level-${threat.severity}`}
          >
            <div>
              <span className="threat-time">{threat.time}</span>
            </div>
            
            <div>
              <span className="threat-ip">{threat.ip}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                ({threat.code} - {threat.country})
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={`threat-badge ${threat.severity}`}>
                {threat.vector}
              </span>
            </div>
            
            <div>
              <span style={{ color: 'var(--neon-cyan)' }}>Port: {threat.port}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
