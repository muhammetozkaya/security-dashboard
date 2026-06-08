import React, { useState, useEffect } from 'react';
import { fetchCVEs } from '../services/api';
import { ShieldAlert, Search, RefreshCw, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export default function CVEFeed() {
  const [cves, setCves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const loadCVEs = async (query = '') => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await fetchCVEs(query);
      setCves(data);
    } catch (err) {
      setErrorMsg('CVE verileri yüklenirken hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCVEs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveQuery(searchTerm);
    loadCVEs(searchTerm);
  };

  const getCvssClass = (score) => {
    if (score >= 9.0) return 'cvss-critical';
    if (score >= 7.0) return 'cvss-high';
    if (score >= 4.0) return 'cvss-medium';
    return 'cvss-low';
  };

  const getSeverityLabel = (score) => {
    if (score >= 9.0) return 'KRİTİK';
    if (score >= 7.0) return 'YÜKSEK';
    if (score >= 4.0) return 'ORTA';
    return 'DÜŞÜK';
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="cyber-panel cve-feed-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 className="cyber-title neon-text-cyan" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={20} />
          CVE GÜVENLİK AÇIĞI AKIŞI
        </h3>
        <button 
          className="cyber-btn" 
          onClick={() => loadCVEs(activeQuery)} 
          disabled={loading}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          YENİLE
        </button>
      </div>

      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem' }}>
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <input
            type="text"
            className="search-input"
            placeholder="CVE ID veya Anahtar Kelime Ara (Örn: Windows, Docker)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button type="submit" className="cyber-btn" disabled={loading}>
          <Search size={16} />
          Sorgula
        </button>
      </form>

      {errorMsg && (
        <div className="status-indicator-box" style={{ borderColor: 'var(--border-magenta)', color: 'var(--neon-magenta)', marginBottom: '1rem' }}>
          <AlertTriangle size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="status-indicator-box">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <RefreshCw size={24} style={{ animation: 'radar-rotate 2s linear infinite' }} className="neon-text-cyan" />
            <span>NVD VERİ TABANI SORGULANIYOR...</span>
          </div>
        </div>
      ) : cves.length === 0 ? (
        <div className="status-indicator-box">
          Kayıt bulunamadı. Lütfen başka bir anahtar kelime deneyin veya filtreyi sıfırlayın.
        </div>
      ) : (
        <div className="cve-table-wrapper">
          <table className="cve-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th style={{ width: '130px' }}>CVE KODU</th>
                <th style={{ width: '80px', textAlign: 'center' }}>CVSS</th>
                <th style={{ width: '90px' }}>KRİTİKLİK</th>
                <th style={{ width: '100px' }}>TARİH</th>
                <th>ÖZET</th>
                <th style={{ width: '110px' }}>KAYNAK</th>
              </tr>
            </thead>
            <tbody>
              {cves.map((cve) => (
                <React.Fragment key={cve.id}>
                  <tr 
                    className="cve-row" 
                    onClick={() => toggleExpand(cve.id)} 
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      {expandedId === cve.id ? <ChevronUp size={16} className="neon-text-cyan" /> : <ChevronDown size={16} />}
                    </td>
                    <td className="cve-id">{cve.id}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`cvss-badge ${getCvssClass(cve.cvss)}`}>
                        {cve.cvss.toFixed(1)}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: cve.cvss >= 9.0 ? 'var(--neon-magenta)' : cve.cvss >= 7.0 ? 'var(--neon-yellow)' : cve.cvss >= 4.0 ? '#c084fc' : 'var(--neon-green)'
                      }}>
                        {getSeverityLabel(cve.cvss)}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-code)', fontSize: '0.75rem' }}>{cve.published}</td>
                    <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-dim)' }}>
                      {cve.description}
                    </td>
                    <td style={{ fontSize: '0.75rem', fontFamily: 'var(--font-tech)', color: 'var(--text-muted)' }}>
                      {cve.source}
                    </td>
                  </tr>

                  {expandedId === cve.id && (
                    <tr>
                      <td colSpan="7" style={{ background: 'rgba(20, 28, 48, 0.25)', padding: '1.2rem', borderLeft: '3px solid var(--neon-cyan)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <div>
                            <span style={{ fontFamily: 'var(--font-header)', fontSize: '0.7rem', color: 'var(--neon-cyan)', display: 'block', marginBottom: '0.25rem' }}>AÇIKLAMA (İNGİLİZCE)</span>
                            <p style={{ lineHeight: '1.5', fontSize: '0.85rem', color: 'var(--text-main)' }}>{cve.description}</p>
                          </div>
                          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', borderTop: '1px solid rgba(0, 240, 255, 0.1)', paddingTop: '0.75rem' }}>
                            <div>
                              <span style={{ fontFamily: 'var(--font-header)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>ETKİLENEN PLATFORM / DOSYALAR</span>
                              <span style={{ fontFamily: 'var(--font-code)', fontSize: '0.8rem', color: 'var(--text-dim)' }}>{cve.platforms}</span>
                            </div>
                            <div>
                              <span style={{ fontFamily: 'var(--font-header)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>NVD BAĞLANTISI</span>
                              <a 
                                href={`https://nvd.nist.gov/vuln/detail/${cve.id}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={{ color: 'var(--neon-cyan)', fontSize: '0.8rem', fontFamily: 'var(--font-code)', textDecoration: 'none', borderBottom: '1px dotted var(--neon-cyan)' }}
                              >
                                nvd.nist.gov/detail/{cve.id}
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
