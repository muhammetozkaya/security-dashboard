import React, { useState, useEffect } from 'react';
import { fetchIPDetails } from '../services/api';
import { Search, MapPin, Globe, Server, Info, RefreshCw } from 'lucide-react';

const QUICK_IPS = [
  { ip: '185.190.140.24', label: 'Tor Çıkış Düğümü (Hollanda)', type: 'warning' },
  { ip: '45.143.203.14', label: 'Zararlı Bot Kaynağı (Rusya)', type: 'danger' },
  { ip: '221.229.172.9', label: 'SQLi Problama Odağı (Çin)', type: 'danger' },
  { ip: '104.244.75.13', label: 'Şüpheli IP (ABD)', type: 'warning' },
  { ip: '82.222.11.89', label: 'Yerel Sunucu (Türkiye)', type: 'safe' }
];

export default function IPLookup() {
  const [ipAddress, setIpAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [ipData, setIpData] = useState(null);
  const [error, setError] = useState('');

  // Initial load with a standard default IP
  const executeLookup = async (ipToQuery = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchIPDetails(ipToQuery);
      setIpData(data);
      if (ipToQuery === '') {
        setIpAddress(data.ip);
      }
    } catch (err) {
      setError('IP bilgileri çekilemedi. Bağlantıyı kontrol edip tekrar deneyin.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeLookup();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!ipAddress.trim()) return;
    executeLookup(ipAddress);
  };

  const handleQuickClick = (ip) => {
    setIpAddress(ip);
    executeLookup(ip);
  };

  // Radar dot position offset based on latitude and longitude to make it look active
  const getRadarDotStyle = () => {
    if (!ipData) return { top: '50%', left: '50%' };
    // Map Lat/Lon to percentages on the 2D radar screen (clamped to fit reasonably)
    const latFactor = (ipData.lat + 90) / 180; // 0 to 1
    const lonFactor = (ipData.lon + 180) / 360; // 0 to 1
    
    // Scale slightly to keep dot centered on screen rather than edges
    const topVal = 20 + latFactor * 60; 
    const leftVal = 20 + lonFactor * 60;
    
    return {
      top: `${100 - topVal}%`, // Invert latitude for screen space (North is up)
      left: `${leftVal}%`
    };
  };

  return (
    <div className="cyber-panel">
      <h3 className="cyber-title neon-text-cyan" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Globe size={20} />
        IP COĞRAFİ SORGULAMA VE ASN ANALİZİ
      </h3>

      <div className="ip-grid">
        {/* Left column: Search and Quick Clicks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="search-input"
              placeholder="IP adresi sorgulayın (Örn: 8.8.8.8)..."
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              style={{ fontFamily: 'var(--font-code)' }}
            />
            <button type="submit" className="cyber-btn" disabled={loading}>
              <Search size={16} />
              Sorgula
            </button>
          </form>

          <div>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-header)', color: 'var(--text-muted)' }}>HIZLI ŞÜPHELİ IP LİSTESİ</span>
            <div className="ip-quick-clicks">
              {QUICK_IPS.map((item, idx) => (
                <button
                  key={idx}
                  className="ip-quick-btn"
                  onClick={() => handleQuickClick(item.ip)}
                  disabled={loading}
                >
                  <span style={{ fontWeight: 'bold' }}>{item.ip}</span>
                  <span style={{ 
                    fontSize: '0.65rem', 
                    color: item.type === 'danger' ? 'var(--neon-magenta)' : item.type === 'warning' ? 'var(--neon-yellow)' : 'var(--neon-green)'
                  }}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Results and Radar map */}
        <div>
          {loading ? (
            <div className="status-indicator-box" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <RefreshCw size={24} style={{ animation: 'radar-rotate 2s linear infinite' }} className="neon-text-cyan" />
                <span>COĞRAFİ KOORDİNATLAR SORGULANIYOR...</span>
              </div>
            </div>
          ) : error ? (
            <div className="status-indicator-box" style={{ borderColor: 'var(--border-magenta)', color: 'var(--neon-magenta)' }}>
              {error}
            </div>
          ) : ipData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              
              {/* Animated Radar Graphic */}
              <div className="radar-map-panel">
                <div className="radar-circle c1"></div>
                <div className="radar-circle c2"></div>
                <div className="radar-circle c3"></div>
                <div className="radar-sweep"></div>
                
                {/* Geolocation Dot */}
                <div className="radar-dot" style={getRadarDotStyle()}></div>
                
                <div className="radar-coordinates">
                  LAT: {ipData.lat?.toFixed(4)} | LON: {ipData.lon?.toFixed(4)}
                </div>
              </div>

              {/* Geo details output table */}
              <div style={{ background: 'rgba(8, 10, 16, 0.6)', padding: '1rem', border: '1px solid rgba(0, 240, 255, 0.1)', borderRadius: '4px' }}>
                <table className="ip-details-table">
                  <tbody>
                    <tr>
                      <td>IP ADRESİ</td>
                      <td style={{ color: 'var(--neon-cyan)', fontWeight: 'bold' }}>{ipData.ip}</td>
                    </tr>
                    <tr>
                      <td>ÜLKE / ŞEHİR</td>
                      <td>
                        <MapPin size={12} className="neon-text-cyan" style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                        {ipData.country} ({ipData.countryCode}) / {ipData.city}, {ipData.region}
                      </td>
                    </tr>
                    <tr>
                      <td>İNTERNET SAĞLAYICI (ISP)</td>
                      <td>{ipData.isp}</td>
                    </tr>
                    <tr>
                      <td>ASN BİLGİSİ</td>
                      <td>
                        <Server size={12} className="neon-text-cyan" style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                        {ipData.asn}
                      </td>
                    </tr>
                    <tr>
                      <td>ZAMAN DİLİMİ</td>
                      <td>{ipData.timezone}</td>
                    </tr>
                    <tr>
                      <td>VERİ KAYNAĞI</td>
                      <td style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{ipData.source}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
