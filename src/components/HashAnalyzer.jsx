import React, { useState, useRef } from 'react';
import CryptoJS from 'crypto-js';
import { Cpu, ShieldCheck, ShieldAlert, FileText, UploadCloud, AlertCircle, RefreshCw } from 'lucide-react';

const SECURITY_ENGINES = [
  { name: 'CrowdStrike Falcon', status: 'Clean' },
  { name: 'Kaspersky Lab', status: 'Clean' },
  { name: 'Microsoft Defender', status: 'Clean' },
  { name: 'SentinelOne', status: 'Clean' },
  { name: 'Bitdefender Engine', status: 'Clean' },
  { name: 'Symantec Endpoint', status: 'Clean' },
  { name: 'Sophos InterceptX', status: 'Clean' }
];

export default function HashAnalyzer() {
  const [inputText, setInputText] = useState('');
  const [fileDetails, setFileDetails] = useState(null);
  const [hashes, setHashes] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [isMalwareSimulation, setIsMalwareSimulation] = useState(false);
  const fileInputRef = useRef(null);

  // Compute hashes for text
  const analyzeText = () => {
    if (!inputText.trim()) return;
    setFileDetails({ name: 'custom_payload.txt', size: new Blob([inputText]).size });
    
    const md5 = CryptoJS.MD5(inputText).toString();
    const sha256 = CryptoJS.SHA256(inputText).toString();
    
    setHashes({ md5, sha256 });
    startMockScan(sha256);
  };

  // Process file upload and compute hashes
  const handleFile = (file) => {
    if (!file) return;
    setFileDetails({ name: file.name, size: file.size });
    setHashes(null);
    setScanResults(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target.result;
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        
        const md5 = CryptoJS.MD5(wordArray).toString();
        const sha256 = CryptoJS.SHA256(wordArray).toString();
        
        setHashes({ md5, sha256 });
        startMockScan(sha256);
      } catch (err) {
        console.error('Hash hesabı başarısız:', err);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Simulated VirusTotal search scanner
  const startMockScan = (hash) => {
    setIsScanning(true);
    setScanProgress(0);
    setScanResults(null);

    const intervalTime = 30; // Milliseconds per progress tick
    const totalDuration = 1500; // Total 1.5 seconds scan
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += intervalTime;
      const progress = Math.min((elapsed / totalDuration) * 100, 100);
      setScanProgress(Math.floor(progress));

      if (progress >= 100) {
        clearInterval(timer);
        setIsScanning(false);

        // Generate scan results based on Malware Simulation toggle
        // If simulation is active, 3-4 engines will flag as malware. Otherwise clean
        const results = SECURITY_ENGINES.map((engine, idx) => {
          if (isMalwareSimulation && (idx === 0 || idx === 2 || idx === 3 || idx === 5)) {
            return { ...engine, status: 'Infected', threatName: 'Trojan.Win32.Generic.cyber' };
          }
          return { ...engine, status: 'Clean' };
        });

        const detectionCount = results.filter(r => r.status === 'Infected').length;
        setScanResults({
          engines: results,
          detections: detectionCount,
          total: results.length
        });
      }
    }, intervalTime);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="cyber-panel">
      <h3 className="cyber-title neon-text-cyan" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Cpu size={20} />
        ANTIVIRUS HASH ANALİZ MERKEZİ
      </h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 0, 85, 0.05)', padding: '0.6rem 1rem', borderRadius: '4px', border: '1px solid var(--border-magenta)', marginBottom: '1.5rem' }}>
        <AlertCircle size={18} className="neon-text-magenta" />
        <div style={{ fontSize: '0.75rem', flexGrow: 1 }}>
          <span style={{ fontWeight: 'bold' }}>MALWARE SİMÜLASYONU: </span> 
          Aktif edildiğinde, analiz edilen dosya antivirüs motorları tarafından zararlı yazılım olarak tespit edilecektir.
        </div>
        <label className="switch" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem', userSelect: 'none' }}>
          <input 
            type="checkbox" 
            checked={isMalwareSimulation}
            onChange={(e) => setIsMalwareSimulation(e.target.checked)}
            style={{ accentColor: 'var(--neon-magenta)', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-header)', color: isMalwareSimulation ? 'var(--neon-magenta)' : 'var(--text-muted)' }}>
            {isMalwareSimulation ? 'ZARARLI' : 'TEMİZ'}
          </span>
        </label>
      </div>

      <div className="analyzer-grid">
        {/* Left Side: Drag & Drop / Input area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div 
            className={`dropzone ${isDragActive ? 'active' : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <UploadCloud size={32} className="neon-text-cyan" style={{ filter: 'drop-shadow(0 0 5px var(--neon-cyan))' }} />
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Analiz İçin Dosya Sürükleyin</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>veya tıklayarak dosya seçin</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileSelect}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-header)', color: 'var(--text-dim)' }}>VEYA METİN ANALİZİ:</span>
            <textarea
              className="search-input"
              rows="4"
              placeholder="Analiz edilmesini istediğiniz metin, string veya payload'u buraya yapıştırın..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{ resize: 'none', fontFamily: 'var(--font-code)', fontSize: '0.8rem' }}
            />
            <button className="cyber-btn" onClick={analyzeText} style={{ justifyContent: 'center' }}>
              Metni Analiz Et
            </button>
          </div>
        </div>

        {/* Right Side: Results & Scan Status */}
        <div>
          {!hashes && !isScanning ? (
            <div className="status-indicator-box" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Analiz sonucunu görmek için bir dosya yükleyin veya metin girişi yapın.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="hash-result-box">
                {fileDetails && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem', marginBottom: '0.25rem' }}>
                    <FileText size={16} className="neon-text-cyan" />
                    <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{fileDetails.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>({formatBytes(fileDetails.size)})</span>
                  </div>
                )}
                {hashes && (
                  <>
                    <div className="hash-row">
                      <span className="hash-label">MD5 HASH</span>
                      <span className="hash-value">{hashes.md5}</span>
                    </div>
                    <div className="hash-row">
                      <span className="hash-label">SHA-256 HASH</span>
                      <span className="hash-value">{hashes.sha256}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Progress Scan Bar */}
              {isScanning && (
                <div className="scan-progress-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-tech)' }}>
                    <span>TEHDİT VERİ TABANI TARANIYOR...</span>
                    <span className="neon-text-cyan">{scanProgress}%</span>
                  </div>
                  <div className="scan-bar-bg">
                    <div className="scan-bar-fill" style={{ width: `${scanProgress}%` }}></div>
                  </div>
                </div>
              )}

              {/* VirusTotal Output Details */}
              {scanResults && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(0,240,255,0.1)', paddingBottom: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-header)', fontSize: '0.8rem', color: 'var(--text-dim)' }}>TARAMA SONUÇLARI (VIRUSTOTAL MOCK)</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-tech)' }}>TESPİT ORANI:</span>
                      <span 
                        style={{ fontWeight: 'bold', fontSize: '1rem', fontFamily: 'var(--font-code)' }}
                        className={scanResults.detections > 0 ? 'neon-text-magenta' : 'neon-text-green'}
                      >
                        {scanResults.detections} / {scanResults.total}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: scanResults.detections > 0 ? 'rgba(255, 0, 85, 0.08)' : 'rgba(57, 255, 20, 0.08)', border: `1px solid ${scanResults.detections > 0 ? 'var(--border-magenta)' : 'var(--border-green)'}`, borderRadius: '4px', marginBottom: '1rem' }}>
                    {scanResults.detections > 0 ? (
                      <>
                        <ShieldAlert size={20} className="neon-text-magenta" />
                        <span style={{ fontSize: '0.8rem', color: 'var(--neon-magenta)', fontWeight: 'bold' }}>ZARARLI İÇERİK TESPİT EDİLDİ! BU PAYLOAD GÜVENLİ DEĞİL.</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={20} className="neon-text-green" />
                        <span style={{ fontSize: '0.8rem', color: 'var(--neon-green)', fontWeight: 'bold' }}>ZARARLI YAZILIM TESPİT EDİLMEDİ. DOSYA GÜVENLİ GÖRÜNÜYOR.</span>
                      </>
                    )}
                  </div>

                  <div className="engine-status-list">
                    {scanResults.engines.map((engine, index) => (
                      <div key={index} className="engine-status-card">
                        <span style={{ color: 'var(--text-dim)' }}>{engine.name}</span>
                        <span className={engine.status === 'Clean' ? 'status-clean' : 'status-infected'}>
                          {engine.status === 'Clean' ? 'Temiz' : 'Zararlı'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
