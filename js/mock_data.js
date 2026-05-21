// Global State Platform
const PublicEyeState = {
    metrics: {
        scans: 142,
        findings: 1069,
        iocs: 12,
        cases: 3,
        modules: 32
    },
    threatLevel: "ELEVATED",
    threatSector: "GCC Financial Sector",
    
    // 3 Kasus Investigasi Bawaan (Pre-loaded)
    cases: [
        { id: "INV-2026-089", name: "Op BlackHat Indonesia", priority: "HIGH", iocs: 5, status: "Active", date: "2026-05-18" },
        { id: "INV-2026-090", name: "Phishing Wave Bank Rakyat", priority: "CRITICAL", iocs: 4, status: "Under Review", date: "2026-05-20" },
        { id: "INV-2026-091", name: "Ransomware Affiliates Recon", priority: "MEDIUM", iocs: 3, status: "Archived", date: "2026-05-10" }
    ],

    // 12 Indikator IOC Bawaan (Pre-loaded)
    iocs: [
        { type: "Domain", value: "x-cyber-malicious.net", source: "INV-2026-089", date: "2026-05-21" },
        { type: "IP Address", value: "185.220.101.5", source: "INV-2026-089", date: "2026-05-21" },
        { type: "SHA256 Hash", value: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", source: "INV-2026-090", date: "2026-05-20" },
        { type: "Email", value: "attacker@protonmail.com", source: "INV-2026-090", date: "2026-05-20" },
        { type: "URL", value: "http://update-secure-banking.id/login", source: "INV-2026-090", date: "2026-05-20" },
        { type: "CVE ID", value: "CVE-2026-2713", source: "System Intelligence", date: "2026-05-15" },
        { type: "Domain", value: "tokopedia-promo-palsu.xyz", source: "INV-2026-091", date: "2026-05-19" },
        { type: "IP Address", value: "45.132.22.109", source: "INV-2026-091", date: "2026-05-19" },
        { type: "SHA256 Hash", value: "24a5e05e12e132ef1e0b12e32a21e05e12e132ef1e0b12e32a21e05e12e132ef", source: "INV-2026-089", date: "2026-05-18" },
        { type: "URL", value: "https://pastebin.com/raw/leakdata-indo", source: "INV-2026-089", date: "2026-05-17" },
        { type: "Email", value: "spoofing-alert@gmail.com", source: "INV-2026-091", date: "2026-05-16" },
        { type: "CVE ID", value: "CVE-2026-1104", source: "System Intelligence", date: "2026-05-14" }
    ],

    // Kunci API (Disimpan aman di localStorage browser)
    apiKeys: {
        shodan: localStorage.getItem('pe_api_shodan') || '',
        virustotal: localStorage.getItem('pe_api_vt') || '',
        hunter: localStorage.getItem('pe_api_hunter') || '',
        securitytrails: localStorage.getItem('pe_api_sectrails') || '',
        abuseipdb: localStorage.getItem('pe_api_abuseipdb') || ''
    },

    // 6 Sumber Umpan Ancaman (Threat Feeds Mocking dari real API feed format)
    threatFeeds: [
        { source: "CISA ICS-CERT", title: "Malicious Actors Exploiting Industrial Control Systems", severity: "HIGH", date: "2026-05-21" },
        { source: "AlienVault OTX", title: "New AsyncRAT Infrastructure Detected targeting SE Asia", severity: "CRITICAL", date: "2026-05-21" },
        { source: "URLhaus", title: "Active DanaBot Payload Distribution URLs Identified", severity: "HIGH", date: "2026-05-20" },
        { source: "PhishTank", title: "Massive Phishing Wave impersonating QRIS Payment Gateways", severity: "CRITICAL", date: "2026-05-20" },
        { source: "MalwareBazaar", title: "New Stealer Log Executable Variant SHA256 Uploaded", severity: "MEDIUM", date: "2026-05-19" },
        { source: "FS-ISAC", title: "Cyber Threat Intelligence Update for International Banking Nodes", severity: "HIGH", date: "2026-05-19" }
    ]
};
