# 🛡️ Cybersecurity Threat Operations Center (SOC) Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/CryptoJS-FF6700?style=for-the-badge&logo=javascript&logoColor=white" alt="CryptoJS" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/muhammetozkaya/security-dashboard?style=flat-square&color=blue" alt="License" />
  <img src="https://img.shields.io/github/stars/muhammetozkaya/security-dashboard?style=flat-square&color=yellow" alt="Stars" />
  <img src="https://img.shields.io/github/forks/muhammetozkaya/security-dashboard?style=flat-square&color=lightgrey" alt="Forks" />
  <img src="https://img.shields.io/badge/Author-Muhammet%20%C3%96zkaya-00f0ff?style=flat-square" alt="Author" />
</p>

---

## 📖 Proje Hakkında

**NEON SHIELD**, modern siber güvenlik operasyon merkezleri (SOC) için tasarlanmış, cyberpunk ve hacker estetiğine sahip tarayıcı tabanlı bir tehdit yönetim panelidir. Güvenlik analistlerinin tehdit durumlarını anlık izlemesine, bütünlük kontrolleri yapmasına, ağ IP bilgilerini sorgulamasına ve küresel zafiyet (CVE) verilerini gerçek zamanlı takip etmesine olanak tanır.

> Proje Kaynak Kodu: [github.com/muhammetozkaya/security-dashboard](https://github.com/muhammetozkaya/security-dashboard/blob/main/README.md)

---

## ✨ Ana Özellikler

Uygulamadaki her modül tamamen bağımsız, modüler ve responsive olarak çalışmaktadır:

| Modül Adı | Açıklama | Görsel Ayrıntı / Teknoloji |
| :--- | :--- | :--- |
| **🖥️ Sistem Teşhis Paneli** | Toplam tarama sayısı (canlı artan), tehditler, CPU/RAM donanım yükleri ve IPS logları. | Canlı donanım progress barları ve terminal log akışı. |
| **📡 Canlı Tehdit Akışı** | DDoS, Port Scan, SQL Injection gibi atak girişimlerinin canlı simülasyon listesi. | Coğrafi ülke tespiti, port analizi ve Gbps trafik yük göstergesi. |
| **🧮 Antivirüs Hash Analizi** | Sürükle-bırak dosya veya metinlerin MD5/SHA-256 hash bütünlük kontrolü. | CryptoJS entegrasyonu, Çoklu AV Motoru taraması ve Zararlı Yazılım Test Modu. |
| **🌐 IP Coğrafi Sorgulama** | Girilen IP'lerin ISP, ASN, şehir, ülke ve zaman dilimlerini haritalama. | Canlı dönen dairesel radar grafiği ve ip-api/ipapi.co hibrit sorgu geçişi. |
| **⚠️ CVE İstihbarat Feed** | NVD (National Vulnerability Database) üzerinden en güncel zafiyetlerin takibi. | CVSS kritiklik skor renk kodlaması, filtreleme ve detaylı platform dökümü. |

---

## 🛠️ Teknoloji ve Mimari Yaklaşım

### Tasarım ve Estetik
- **Glassmorphism:** `backdrop-filter: blur(12px)` ile elde edilen yarı saydam cam paneller.
- **CRT & Scanline Efektleri:** Eski nesil CRT ekranlardaki gibi tarama çizgileri ve neon gölgeler (`box-shadow: 0 0 10px var(--neon-cyan)`).
- **Yazı Tipleri:** Başlıklarda teknolojik **Orbitron** ve **Share Tech Mono**, kod bloklarında **Fira Code**, gövde metinlerinde **Inter** kullanılmıştır.

### Veri ve Entegrasyon
- **Çift Modlu Servis (Dual-Mode):** NVD API'nin CORS politikaları ya da rate limit nedeniyle kesintiye uğramaması için lokal bir fallback veri havuzu entegre edilmiştir.
- **HTTPS Güvenli Geçiş:** ip-api.com HTTP isteklerinin HTTPS sunucularda engellenmesini önlemek için otomatik olarak ipapi.co HTTPS API'sine geçiş yapılır.

---

## 🚀 Kurulum ve Çalıştırma

Projenin yerel ortamınızda çalışabilmesi için **Node.js (LTS v20+)** yüklü olmalıdır.

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/muhammetozkaya/security-dashboard.git
cd security-dashboard
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Uygulama varsayılan olarak **`http://localhost:3000`** portunda çalışacaktır ve tarayıcıda otomatik açılacaktır.

### 4. Optimize Edilmiş Derleme (Build)
```bash
npm run build
```
Bu komut, uygulamanın optimize edilmiş statik dosyalarını `/dist` klasörüne çıkarır.

---

## 📂 Dosya Yapısı

```text
security-dashboard/
├── public/
│   └── index.html         # Alternatif index dosyası
├── src/
│   ├── components/
│   │   ├── CVEFeed.jsx       # CVE listeleme ve arama tablosu
│   │   ├── HashAnalyzer.jsx  # Hash hesaplama ve VirusTotal simülatörü
│   │   ├── IPLookup.jsx      # IP konumu ve radar animasyonu
│   │   ├── Navbar.jsx        # Başlık ve sistem durum barı
│   │   ├── StatsCard.jsx     # Temel metrik kartı şablonu
│   │   └── ThreatMap.jsx     # Canlı tehdit simülatörü listesi
│   ├── services/
│   │   └── api.js            # API çağrıları ve yedek veri katmanı
│   ├── styles/
│   │   └── dashboard.css     # CSS Değişkenleri, Gridler ve Keyframe'ler
│   ├── App.jsx               # Sekme yönlendirmeleri ve donanım monitörü
│   └── main.jsx              # React başlangıç modülü
├── README.md                 # Görselleştirilmiş proje kılavuzu
├── package.json              # Bağımlılıklar ve scriptler
├── vite.config.js            # Sunucu ve derleme ayarları
└── .gitignore                # Git yoksay listesi
```

---

## 👨‍💻 Yazar ve Katkıda Bulunanlar

* **Muhammet Özkaya** - *Geliştirici / Tasarımcı* - [GitHub Profili](https://github.com/muhammetozkaya)
* İletişim: `muhammetozkaya625@icloud.com`

---

## 📄 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır. Detaylar için lisans dosyasına göz atabilirsiniz.
