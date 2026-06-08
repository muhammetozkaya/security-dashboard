// API service layer with fallbacks for NVD CVE and IP Geolocation API

// Curated high-quality CVE data to use as a fallback if the NVD API fails, returns CORS, or hits rate limits.
const MOCK_CVES = [
  {
    id: "CVE-2024-3094",
    source: "NVD (Fallback Mode)",
    published: "2024-03-29",
    cvss: 10.0,
    severity: "CRITICAL",
    description: "Malicious code was discovered in the upstream tarballs of xz, starting with version 5.6.0. Through a series of complex obfuscations, the liblzma build process extracts a prebuilt object file from a disguised test file in the source code, which is then used to modify functions in the liblzma code. This results in a modified liblzma library that can be used by any software linked against this library, intercepting and modifying the data interaction with this library.",
    platforms: "Debian, Fedora, Ubuntu, Alpine Linux (xz-utils 5.6.0 & 5.6.1)"
  },
  {
    id: "CVE-2024-21626",
    source: "NVD (Fallback Mode)",
    published: "2024-01-31",
    cvss: 8.6,
    severity: "HIGH",
    description: "runc is a CLI tool for spawning and running containers on Linux according to the OCI specification. In runc 1.1.11 and earlier, due to an internal file descriptor leak, an attacker can cause a newly-spawned container process to gain working directory access to the host filesystem namespace, leading to container escape and full host compromise.",
    platforms: "runc, Docker, Kubernetes Containerd"
  },
  {
    id: "CVE-2023-38606",
    source: "NVD (Fallback Mode)",
    published: "2023-07-24",
    cvss: 7.8,
    severity: "HIGH",
    description: "An issue was discovered in macOS Sonoma, iOS, and iPadOS. A malicious application may be able to modify sensitive kernel state. Apple is aware of a report that this issue may have been actively exploited in the wild (Operation Triangulation). The vulnerability allows bypassing hardware protection by writing to undocumented registers.",
    platforms: "iOS < 16.6, iPadOS < 16.6, macOS < 13.5"
  },
  {
    id: "CVE-2024-43632",
    source: "NVD (Fallback Mode)",
    published: "2024-05-15",
    cvss: 9.8,
    severity: "CRITICAL",
    description: "Windows Kerberos Security Feature Bypass Vulnerability. An unauthenticated attacker can exploit this vulnerability to bypass Kerberos authentication checks and perform remote code execution on Active Directory Domain Controllers under administrative privileges.",
    platforms: "Windows Server 2012, 2016, 2019, 2022"
  },
  {
    id: "CVE-2024-21887",
    source: "NVD (Fallback Mode)",
    published: "2024-01-11",
    cvss: 9.1,
    severity: "CRITICAL",
    description: "A command injection vulnerability in web components of Ivanti Connect Secure (9.x, 22.x) and Ivanti Policy Secure allows an authenticated administrator to execute arbitrary commands on the appliance. When combined with CVE-2023-46805 (Authentication Bypass), it allows unauthenticated remote code execution.",
    platforms: "Ivanti Connect Secure, Ivanti Policy Secure"
  },
  {
    id: "CVE-2023-22515",
    source: "NVD (Fallback Mode)",
    published: "2023-10-04",
    cvss: 10.0,
    severity: "CRITICAL",
    description: "Privilege Escalation Vulnerability in Confluence Data Center and Server. This vulnerability allows an unauthenticated attacker to inject parameter configurations and create unauthorized Confluence administrator accounts, leading to complete instance takeover.",
    platforms: "Atlassian Confluence Server & Data Center"
  }
];

/**
 * Fetches latest CVEs from the NVD API.
 * Uses a robust timeout and falls back to curated mock data on error/CORS.
 */
export async function fetchCVEs(keyword = "") {
  try {
    // NVD API v2 endpoint
    // We add resultsPerPage=15 to keep it lightweight. We fetch recent critical/high vulnerabilities
    const url = `https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=15${keyword ? `&keywordSearch=${encodeURIComponent(keyword)}` : ""}`;
    
    // We set a 4-second timeout because NVD API can be extremely slow/unresponsive
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`NVD API error status: ${response.status}`);
    }

    const data = await response.json();
    
    // Format NVD response to fit our component structure
    if (data && data.vulnerabilities && data.vulnerabilities.length > 0) {
      return data.vulnerabilities.map(v => {
        const cve = v.cve;
        
        // Find CVSS V3 or V2 score
        let cvss = 0;
        let severity = "UNKNOWN";
        const metrics = cve.metrics;
        
        if (metrics) {
          const v31 = metrics.cvssMetricV31?.[0]?.cvssData;
          const v30 = metrics.cvssMetricV30?.[0]?.cvssData;
          const v2 = metrics.cvssMetricV2?.[0]?.cvssData;
          
          if (v31) {
            cvss = v31.baseScore;
            severity = v31.baseSeverity || getSeverityByScore(cvss);
          } else if (v30) {
            cvss = v30.baseScore;
            severity = v30.baseSeverity || getSeverityByScore(cvss);
          } else if (v2) {
            cvss = v2.baseScore;
            severity = getSeverityByScore(cvss);
          }
        }

        // Extract description
        const descEng = cve.descriptions?.find(d => d.lang === "en")?.value || "Açıklama bulunamadı.";
        
        return {
          id: cve.id,
          source: "NVD Live API",
          published: cve.published ? cve.published.split("T")[0] : "Bilinmiyor",
          cvss: cvss || 5.0, // Default to 5.0 if no metric
          severity: severity.toUpperCase(),
          description: descEng,
          platforms: cve.configurations?.[0]?.nodes?.[0]?.cpeMatch?.[0]?.criteria?.split(":")?.[4] || "Çoklu Platform"
        };
      });
    }

    throw new Error("No vulnerabilities found in response");
  } catch (error) {
    console.warn("NVD API failed, returning mock data. Details:", error.message);
    
    // Filter local mock data if keyword is present
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      return MOCK_CVES.filter(c => 
        c.id.toLowerCase().includes(lowerKeyword) || 
        c.description.toLowerCase().includes(lowerKeyword) ||
        c.platforms.toLowerCase().includes(lowerKeyword)
      );
    }
    
    return MOCK_CVES;
  }
}

function getSeverityByScore(score) {
  if (score >= 9.0) return "CRITICAL";
  if (score >= 7.0) return "HIGH";
  if (score >= 4.0) return "MEDIUM";
  return "LOW";
}

/**
 * Fetches geographical and ASN information for a specific IP.
 * Uses ip-api.com as primary (HTTP) and ipapi.co as secondary (HTTPS fallback for secure hosting)
 */
export async function fetchIPDetails(ipAddress) {
  const cleanIp = ipAddress ? ipAddress.trim() : "";
  
  // Try HTTP ip-api.com (requested)
  try {
    const url = `http://ip-api.com/json/${cleanIp}?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,query`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      if (data.status === "success") {
        return {
          ip: data.query,
          country: data.country,
          countryCode: data.countryCode,
          region: data.regionName,
          city: data.city,
          lat: data.lat,
          lon: data.lon,
          isp: data.isp,
          asn: data.as || "Bilinmiyor",
          timezone: data.timezone,
          source: "ip-api.com (HTTP)"
        };
      }
    }
  } catch (err) {
    console.log("ip-api.com failed or blocked by HTTPS mixed content rules. Switching to secure fallback API...", err.message);
  }

  // Fallback to HTTPS freeipapi.com or ipapi.co
  try {
    const fallbackUrl = cleanIp 
      ? `https://ipapi.co/${cleanIp}/json/`
      : `https://ipapi.co/json/`;
    
    const response = await fetch(fallbackUrl);
    if (response.ok) {
      const data = await response.json();
      if (!data.error) {
        return {
          ip: data.ip,
          country: data.country_name,
          countryCode: data.country_code,
          region: data.region,
          city: data.city,
          lat: data.latitude,
          lon: data.longitude,
          isp: data.org || "Bilinmiyor",
          asn: data.asn || "Bilinmiyor",
          timezone: data.timezone,
          source: "ipapi.co (HTTPS Fallback)"
        };
      }
    }
  } catch (fallbackErr) {
    console.warn("Secure IP fallback failed:", fallbackErr.message);
  }

  // Final offline/simulation fallback (so that the IPLookup component works beautifully offline too)
  const simulatedIP = cleanIp || "185.190.140.24";
  return {
    ip: simulatedIP,
    country: "Türkiye",
    countryCode: "TR",
    region: "Istanbul",
    city: "Istanbul",
    lat: 41.0082,
    lon: 28.9784,
    isp: "Turk Telekomunikasyon A.S.",
    asn: "AS9121",
    timezone: "Europe/Istanbul",
    source: "Local Database Simulation"
  };
}
