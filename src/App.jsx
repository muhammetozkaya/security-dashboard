import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsCard from './components/StatsCard';
import ThreatMap from './components/ThreatMap';
import HashAnalyzer from './components/HashAnalyzer';
import IPLookup from './components/IPLookup';
import CVEFeed from './components/CVEFeed';
import { Scan, ShieldAlert, Activity, CheckCircle, Server, HardDrive, Cpu, Terminal } from 'lucide-react';
import './styles/dashboard.css';

const MOCK_SYSTEM_LOGS = [
  { time: '15:53:01', msg: 'Sızma Tespit Sistemi (NIDS) kuralları güncellendi.', type: 'info' },
  { time: '15:53:15', msg: 'Firewall: 198.51.100.72 ip adresinden gelen DDoS paketi engellendi.', type: 'warning' },
  { time: '15:53:42', msg: 'Bütünlük Kontrolü: /usr/bin dizini hash değerleri doğrulandı.', type: 'success' },
  { time: '15:54:02', msg: 'Sunucu CPU sıcaklığı optimal düzeyde: 42°C.', type: 'info' },
  { time: '15:54:08', msg: 'Yetkisiz SSH bağlantı girişimi engellendi: Port 22.', type: 'warning' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Dashboard Metrics State
  const [totalScans, setTotalScans] = useState(14829);
  const [threatsDetected, setThreatsDetected] = useState(142);
  const [activeMonitors, setActiveMonitors] = useState(8);
  const [resolutionRate, setResolutionRate] = useState(98.4);

  // Diagnostic states
  const [cpuUsage, setCpuUsage] = useState(24);
  const [ramUsage, setRamUsage] = useState(6.4);
  const [systemLogs, setSystemLogs] = useState(MOCK_SYSTEM_LOGS);

  useEffect(() => {
    // Increment total scans and randomize cpu/ram slightly in the background
    const metricInterval = setInterval(() => {
      setTotalScans((prev) => prev + Math.floor(Math.random() * 3) + 1);
      setCpuUsage((prev) => {
        const next = prev + (Math.random() > 0.5 ? 2 : -2);
        return Math.max(12, Math.min(next, 56));
      });
      setRamUsage((prev) => {
        const next = prev + (Math.random() > 0.5 ? 0.1 : -0.1);
        return Math.max(5.8, Math.min(next, 7.8));
      });
    }, 2500);

    // Dynamic threat alert simulator link
    const threatSync = setInterval(() => {
      setThreatsDetected((prev) => prev + 1);
      
      // Inject new system log occasionally
      const logs = [
        'IDS/IPS imza veri tabanı senkronize edildi.',
        'WAF: SQL Injection kalıbı engellendi.',
        'SSH brute-force koruması tetiklendi: IP bloklandı.',
        'VPN ağ geçidi aktif oturumlar kontrol edildi.'
      ];
      const randomLogMsg = logs[Math.floor(Math.random() * logs.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      
      setSystemLogs((prev) => [
        { time: timeStr, msg: randomLogMsg, type: Math.random() > 0.5 ? 'warning' : 'info' },
        ...prev.slice(0, 4)
      ]);
    }, 9000);

    return () => {
      clearInterval(metricInterval);
      clearInterval(threatSync);
    };
  }, []);

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Global Security Metrics Banner */}
      <section className="stats-grid">
        <StatsCard
          title="TOPLAM TARAMA SAYISI"
          value={totalScans.toLocaleString()}
          icon={Scan}
          change="+14.2%"
          trendUp={true}
          type="cyan"
          subtitle="Son 24 saatlik trafik"
        />
        <StatsCard
          title="TESPİT EDİLEN TEHDİT"
          value={threatsDetected}
          icon={ShieldAlert}
          change="+3.4%"
          trendUp={false}
          type="magenta"
          subtitle="Aktif engellenen saldırı"
        />
        <StatsCard
          title="AKTİF MONİTÖR"
          value={`${activeMonitors} / 8`}
          icon={Activity}
          change="NORMAL"
          trendUp={true}
          type="yellow"
          subtitle="Sunucu & NIDS düğümleri"
        />
        <StatsCard
          title="ÇÖZÜLEN OLAY ORANI"
          value={`%${resolutionRate.toFixed(1)}`}
          icon={CheckCircle}
          change="STABLE"
          trendUp={true}
          type="green"
          subtitle="Saldırı önleme başarısı"
        />
      </section>

      {/* Tab Navigation Content */}
      <main style={{ minHeight: '500px' }}>
        {activeTab === 'dashboard' && (
          <div className="dashboard-main-grid">
            {/* Live Attack Feed */}
            <ThreatMap />

            {/* Diagnostic Console Panel */}
            <div className="cyber-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <h3 className="cyber-title neon-text-cyan" style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Server size={18} />
                SİSTEM TEŞHİS PANELİ
              </h3>

              {/* Hardware resources mockup */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', background: 'rgba(8,10,16,0.6)', padding: '1rem', borderRadius: '4px', border: '1px solid rgba(0,240,255,0.08)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-tech)', marginBottom: '0.25rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Cpu size={12} /> CPU YÜKÜ</span>
                    <span className="neon-text-cyan">{cpuUsage}%</span>
                  </div>
                  <div className="scan-bar-bg" style={{ margin: 0, height: '4px' }}>
                    <div className="scan-bar-fill" style={{ width: `${cpuUsage}%` }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-tech)', marginBottom: '0.25rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><HardDrive size={12} /> RAM KULLANIMI</span>
                    <span className="neon-text-cyan">{ramUsage.toFixed(1)} GB / 16 GB</span>
                  </div>
                  <div className="scan-bar-bg" style={{ margin: 0, height: '4px' }}>
                    <div className="scan-bar-fill" style={{ width: `${(ramUsage / 16) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              {/* System Console Logs */}
              <div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-header)', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  <Terminal size={12} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
                  KONSOL OLAY GÜNLÜĞÜ
                </span>
                <div style={{ background: '#020306', border: '1px solid rgba(0, 240, 255, 0.1)', padding: '0.75rem', borderRadius: '4px', fontFamily: 'var(--font-code)', fontSize: '0.72rem', height: '170px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {systemLogs.map((log, idx) => (
                    <div key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.02)', paddingBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--neon-cyan)' }}>[{log.time}]</span>{' '}
                      <span style={{ 
                        color: log.type === 'warning' ? 'var(--neon-yellow)' : log.type === 'success' ? 'var(--neon-green)' : 'var(--text-dim)' 
                      }}>
                        {log.msg}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hash' && <HashAnalyzer />}
        {activeTab === 'ip' && <IPLookup />}
        {activeTab === 'cve' && <CVEFeed />}
      </main>

      <footer style={{ marginTop: '3rem', borderTop: '1px solid rgba(0, 240, 255, 0.1)', paddingTop: '1.2rem', textAlign: 'center', fontSize: '0.75rem', fontFamily: 'var(--font-tech)', color: 'var(--text-muted)' }}>
        <div>NEON SHIELD THREAT OPERATIONS CENTER © 2026 // ALL SYSTEM SENSORS ACTIVE</div>
        <div style={{ marginTop: '0.25rem' }}>
          Developed by <span style={{ color: 'var(--neon-cyan)', textShadow: 'var(--glow-cyan)' }}>Muhammet Özkaya</span>
        </div>
      </footer>
    </div>
  );
}
