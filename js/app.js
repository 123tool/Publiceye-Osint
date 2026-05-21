document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    loadView('dashboard'); // Halaman default saat pertama kali dibuka
});

// Sistem Navigasi SPA (Single Page Application)
function initNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const target = item.getAttribute('data-target');
            const title = item.innerText.trim();
            
            document.getElementById('current-view-title').innerText = title;
            loadView(target);
        });
    });
    updateBadges();
}

function updateBadges() {
    document.getElementById('badge-cases').innerText = PublicEyeState.cases.length;
    document.getElementById('badge-iocs').innerText = PublicEyeState.iocs.length;
}

// Router View Loader Engine
function loadView(viewName) {
    const container = document.getElementById('view-container');
    
    switch (viewName) {
        case 'dashboard':
            container.innerHTML = renderDashboard();
            break;
        case 'investigations':
            container.innerHTML = renderInvestigations();
            initInvestigationEvents();
            break;
        case 'ioc-manager':
            container.innerHTML = renderIOCManager();
            initIOCEvents();
            break;
        case 'domain-recon':
            container.innerHTML = renderDomainRecon();
            initDomainReconEvents();
            break;
        case 'username-search':
            container.innerHTML = renderUsernameSearch();
            initUsernameEvents();
            break;
        case 'crypto-tracker':
            container.innerHTML = renderCryptoTracker();
            initCryptoEvents();
            break;
        case 'tg-darkweb':
            container.innerHTML = renderTGDarkWeb();
            break;
        case 'social-media-recon':
            container.innerHTML = renderSocialMediaRecon();
            break;
        case 'google-dorks':
            container.innerHTML = renderGoogleDorks();
            break;
        case 'wayback-code':
            container.innerHTML = renderWaybackCode();
            initWaybackEvents();
            break;
        case 'certstream':
            container.innerHTML = renderCertStream();
            initCertStreamWebSocket();
            break;
        case 'threat-feeds':
            container.innerHTML = renderThreatFeeds();
            break;
        case 'settings':
            container.innerHTML = renderSettings();
            initSettingsEvents();
            break;
        default:
            container.innerHTML = `<h2>View ${viewName} not found</h2>`;
    }
}

/* ==========================================================================
   🧠 UI TEMPLATE ENGINE (HTML RENDERERS)
   ========================================================================== */

function renderDashboard() {
    return `
        <div class="grid-metrics">
            <div class="card-metric"><div class="border-line" style="background:var(--accent)"></div><h3>${PublicEyeState.metrics.scans}</h3><p>Scans Run</p></div>
            <div class="card-metric"><div class="border-line" style="background:var(--info)"></div><h3>${PublicEyeState.metrics.findings}</h3><p>Findings Collected</p></div>
            <div class="card-metric"><div class="border-line" style="background:var(--purple)"></div><h3>${PublicEyeState.iocs.length}</h3><p>Active IOCs</p></div>
            <div class="card-metric"><div class="border-line" style="background:var(--success)"></div><h3>${PublicEyeState.cases.length}</h3><p>Cases Managed</p></div>
            <div class="card-metric"><div class="border-line" style="background:var(--danger)"></div><h3>${PublicEyeState.metrics.modules}</h3><p>Total Modules</p></div>
        </div>
        <div class="dashboard-layout">
            <div class="left-panel">
                <div class="panel-card">
                    <h2>OSINT Capabilities Matrix</h2>
                    <table class="custom-table">
                        <thead>
                            <tr><th>Category</th><th>Target Modules Covered</th><th>Integration Mode</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><b>Domain Recon</b></td><td>DNS, Subdomains (crt.sh), Shodan InternetDB, WHOIS</td><td><span class="indicator-live" style="animation:none">LIVE API</span></td></tr>
                            <tr><td><b>Identity Intelligence</b></td><td>Username Checking (20 platforms), Email Leaks Check</td><td><span class="indicator-live" style="animation:none">LIVE API</span></td></tr>
                            <tr><td><b>Financial Tracking</b></td><td>Bitcoin Address & Blockchain Explorer Ledger</td><td><span class="indicator-live" style="animation:none">LIVE API</span></td></tr>
                            <tr><td><b>Dark Web / Socials</b></td><td>Telegram Engine, SearX.be Darknet & Social Crawlers</td><td><span class="badge badge-purple">INLINE WORKFRAME</span></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="right-panel">
                <div class="panel-card" style="text-align:center; padding:40px 20px;">
                    <p style="color:var(--text-muted); font-size:11px; font-family:var(--font-mono)">CURRENT THREAT LEVEL</p>
                    <h1 style="color:var(--danger); font-size:42px; font-weight:700; margin:10px 0;">${PublicEyeState.threatLevel}</h1>
                    <span class="badge badge-orange">${PublicEyeState.threatSector}</span>
                </div>
                <div class="panel-card">
                    <h2>Quick Launch Shortcuts</h2>
                    <button class="btn-action" style="width:100%; margin-bottom:10px;" onclick="document.querySelector('[data-target=\\'domain-recon\\']').click()"><i class="fa-solid fa-magnifying-glass"></i> New Domain Scan</button>
                    <button class="btn-action" style="width:100%; background:var(--bg-input); color:var(--text-primary); border:1px solid var(--border-color);" onclick="document.querySelector('[data-target=\\'certstream\\']').click()"><i class="fa-solid fa-satellite-dish"></i> Launch CertStream</button>
                </div>
            </div>
        </div>
    `;
}

function renderInvestigations() {
    let rows = PublicEyeState.cases.map(c => `
        <tr>
            <td><code style="color:var(--accent)">${c.id}</code></td>
            <td><b>${c.name}</b></td>
            <td><span class="badge ${c.priority === 'CRITICAL' || c.priority === 'HIGH' ? 'badge-orange' : 'badge-purple'}">${c.priority}</span></td>
            <td>${c.iocs} Indicators</td>
            <td><span class="pulse-green" style="background:${c.status==='Active'?'var(--success)':'var(--text-muted)'}"></span> ${c.status}</td>
            <td>${c.date}</td>
        </tr>
    `).join('');

    return `
        <div class="panel-card">
            <h2>Create New Investigation Case</h2>
            <div class="search-container">
                <input type="text" id="new-case-name" class="search-input" placeholder="Case Name / Operation Title...">
                <select id="new-case-priority" class="search-input" style="max-width: 200px;">
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                </select>
                <button id="btn-add-case" class="btn-action"><i class="fa-solid fa-folder-plus"></i> Open Case</button>
            </div>
        </div>
        <div class="panel-card">
            <h2>Active Threat Case Registries</h2>
            <table class="custom-table">
                <thead>
                    <tr><th>Case ID</th><th>Title/Description</th><th>Priority</th><th>Linked IOCs</th><th>Status</th><th>Created Date</th></tr>
                </thead>
                <tbody id="case-table-body">${rows}</tbody>
            </table>
        </div>
    `;
}

function renderIOCManager() {
    let rows = PublicEyeState.iocs.map(i => `
        <tr>
            <td><span class="badge badge-purple">${i.type}</span></td>
            <td><code style="color:var(--info)">${i.value}</code></td>
            <td>${i.source}</td>
            <td>${i.date}</td>
        </tr>
    `).join('');

    return `
        <div class="panel-card">
            <h2>Add Custom Indicator of Compromise (IOC)</h2>
            <div class="search-container">
                <select id="new-ioc-type" class="search-input" style="max-width:200px;">
                    <option value="Domain">Domain</option>
                    <option value="IP Address">IP Address</option>
                    <option value="SHA256 Hash">SHA256 Hash</option>
                    <option value="Email">Email</option>
                    <option value="URL">URL</option>
                    <option value="CVE ID">CVE ID</option>
                </select>
                <input type="text" id="new-ioc-value" class="search-input" placeholder="Enter indicator value (e.g., 1.1.1.1, malicious.com)...">
                <button id="btn-add-ioc" class="btn-action"><i class="fa-solid fa-plus"></i> Add IOC</button>
            </div>
        </div>
        <div class="panel-card">
            <h2>Centralized IOC Database Vault</h2>
            <table class="custom-table">
                <thead>
                    <tr><th>Type</th><th>Indicator Value</th><th>Linked Origin Source</th><th>Timestamp</th></tr>
                </thead>
                <tbody id="ioc-table-body">${rows}</tbody>
            </table>
        </div>
    `;
}

function renderThreatFeeds() {
    let list = PublicEyeState.threatFeeds.map(f => `
        <tr>
            <td><b>${f.source}</b></td>
            <td>${f.title}</td>
            <td><span class="badge ${f.severity==='CRITICAL'?'badge-orange':''}">${f.severity}</span></td>
            <td><code style="color:var(--text-muted)">${f.date}</code></td>
        </tr>
    `).join('');
    return `
        <div class="panel-card">
            <h2>Real-time Intel Threat Feeds</h2>
            <table class="custom-table">
                <thead><tr><th>Feed Intelligence Source</th><th>Threat Intel Update Content</th><th>Severity</th><th>Logged Date</th></tr></thead>
                <tbody>${list}</tbody>
            </table>
        </div>
    `;
}

function renderSettings() {
    return `
        <div class="panel-card">
            <h2>User-Supplied API Keys configuration (Optional)</h2>
            <p style="font-size:12px; color:var(--text-muted); margin-bottom:20px;">By default, PublicEye uses public tier scrapers. Add your premium keys below to amplify requests depth.</p>
            <div style="display:flex; flex-direction:column; gap:14px;">
                <div><label style="display:block; font-size:12px; margin-bottom:5px;">Shodan API Key</value><input type="password" id="key-shodan" class="search-input" style="width:100%" value="${PublicEyeState.apiKeys.shodan}"></div>
                <div><label style="display:block; font-size:12px; margin-bottom:5px;">VirusTotal API Key</value><input type="password" id="key-vt" class="search-input" style="width:100%" value="${PublicEyeState.apiKeys.virustotal}"></div>
                <div><label style="display:block; font-size:12px; margin-bottom:5px;">Hunter.io API Key</value><input type="password" id="key-hunter" class="search-input" style="width:100%" value="${PublicEyeState.apiKeys.hunter}"></div>
                <button id="btn-save-settings" class="btn-action" style="align-self:flex-start;"><i class="fa-solid fa-floppy-disk"></i> Commit API Configuration</button>
            </div>
        </div>
    `;
}

/* ==========================================================================
   ⚙️ INTERACTIVE UI EVENT LISTENERS
   ========================================================================== */

function initInvestigationEvents() {
    document.getElementById('btn-add-case').addEventListener('click', () => {
        const name = document.getElementById('new-case-name').value.trim();
        const priority = document.getElementById('new-case-priority').value;
        if(!name) return alert("Masukan Nama Kasus!");
        
        const newID = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
        const dateStr = new Date().toISOString().split('T')[0];
        
        PublicEyeState.cases.unshift({ id: newID, name, priority, iocs: 0, status: "Active", date: dateStr });
        updateBadges();
        loadView('investigations');
    });
}

function initIOCEvents() {
    document.getElementById('btn-add-ioc').addEventListener('click', () => {
        const type = document.getElementById('new-ioc-type').value;
        const value = document.getElementById('new-ioc-value').value.trim();
        if(!value) return alert("Masukan Nilai Indikator!");

        const dateStr = new Date().toISOString().split('T')[0];
        PublicEyeState.iocs.unshift({ type, value, source: "Manual Injection", date: dateStr });
        updateBadges();
        loadView('ioc-manager');
    });
}

function initSettingsEvents() {
    document.getElementById('btn-save-settings').addEventListener('click', () => {
        const shodan = document.getElementById('key-shodan').value.trim();
        const vt = document.getElementById('key-vt').value.trim();
        const hunter = document.getElementById('key-hunter').value.trim();
        
        localStorage.setItem('pe_api_shodan', shodan);
        localStorage.setItem('pe_api_vt', vt);
        localStorage.setItem('pe_api_hunter', hunter);
        
        PublicEyeState.apiKeys.shodan = shodan;
        PublicEyeState.apiKeys.virustotal = vt;
        PublicEyeState.apiKeys.hunter = hunter;
        
        alert("Konfigurasi API Keys Berhasil Disimpan Ke Browser LocalStorage!");
    });
}

/* ==========================================================================
   📑 CORE DATA EXPORTER (INTELLIGENCE REPORTS ENGINE)
   ========================================================================== */
function exportIntelligenceReport(format, dataObj, scanTitle) {
    let dataStr = "";
    let mimeType = "text/plain";
    let filename = `PublicEye_Report_${scanTitle.replace('.', '_')}_2026`;

    if (format === 'json') {
        dataStr = JSON.stringify({ metadata: { platform: "PublicEye v3.0", timestamp: new Date() }, intel: dataObj }, null, 4);
        mimeType = "application/json";
        filename += ".json";
    } else if (format === 'csv') {
        let csvRows = ["Parameter,Value"];
        for (let key in dataObj) {
            if (typeof dataObj[key] === 'object') {
                csvRows.push(`"${key}","${JSON.stringify(dataObj[key]).replace(/"/g, '""')}"`);
            } else {
                csvRows.push(`"${key}","${dataObj[key]}"`);
            }
        }
        dataStr = csvRows.join("\n");
        mimeType = "text/csv";
        filename += ".csv";
    }

    const blob = new Blob([dataStr], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
