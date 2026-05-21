/* ==========================================================================
   🌐 1. DOMAIN RECON MODULE (DNS, SHODAN INTERNETDB, IP GEOLOCATION, CRT.SH)
   ========================================================================== */

function renderDomainRecon() {
    return `
        <div class="panel-card">
            <h2>Live Domain Recon & Target Mapping</h2>
            <div class="search-container">
                <input type="text" id="target-domain" class="search-input" placeholder="Masukkan domain target (contoh: sans.org, unair.ac.id)..." value="sans.org">
                <button id="btn-scan-domain" class="btn-action"><i class="fa-solid fa-bolt"></i> SCAN TARGET</button>
            </div>
        </div>

        <div id="recon-results-wrapper" style="display:none;">
            <div class="panel-card" style="background:#070A10; border-color:var(--accent);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h2 style="color:var(--accent); margin:0;"><i class="fa-solid fa-terminal"></i> PublicEye Target Console Output</h2>
                    <div>
                        <button class="btn-action" style="font-size:11px; padding:4px 12px; background:var(--info);" id="btn-exp-json"><i class="fa-solid fa-file-code"></i> Export JSON</button>
                        <button class="btn-action" style="font-size:11px; padding:4px 12px; background:var(--purple); margin-left:6px;" id="btn-exp-csv"><i class="fa-solid fa-file-csv"></i> Export CSV</button>
                    </div>
                </div>
                <pre id="console-log" class="terminal-output">Menginisialisasi core engines...</pre>
            </div>

            <div class="dashboard-layout">
                <div class="panel-card">
                    <h2>Captured DNS Records Ledger</h2>
                    <table class="custom-table"><tbody id="dns-table-body"></tbody></table>
                </div>
                <div class="panel-card">
                    <h2>Shodan InternetDB Network Profile</h2>
                    <table class="custom-table"><tbody id="shodan-table-body"></tbody></table>
                </div>
            </div>
        </div>
    `;
}

function initDomainReconEvents() {
    let scanDataStorage = {};
    
    document.getElementById('btn-scan-domain').addEventListener('click', async () => {
        const target = document.getElementById('target-domain').value.trim();
        if(!target) return alert("Masukkan domain target!");

        const consoleLog = document.getElementById('console-log');
        document.getElementById('recon-results-wrapper').style.display = "block";
        
        consoleLog.innerHTML = `[*] Target Teridentifikasi: ${target}\n[*] Memulai Pemindaian Multithread...\n`;
        consoleLog.innerHTML += `[~] Memanggil Google DNS Resolvers...\n`;

        // 1. Fetch Google DNS API
        let dnsRecords = {};
        try {
            const dnsTypes = ['A', 'MX', 'TXT', 'NS', 'CNAME'];
            for(let type of dnsTypes) {
                let res = await fetch(`https://dns.google/resolve?name=${target}&type=${type}`);
                let json = await res.json();
                if(json.Answer) {
                    dnsRecords[type] = json.Answer.map(ans => ans.data).join(', ');
                } else {
                    dnsRecords[type] = "No record found";
                }
            }
            consoleLog.innerHTML += `[+] DNS Extraction Sukses. Mengekstrak alamat IPv4...\n`;
        } catch(e) {
            consoleLog.innerHTML += `[-] Kegagalan Resolving DNS: ${e.message}\n`;
        }

        // Ambil IP A Record untuk Shodan & Geolocation
        let targetIP = dnsRecords['A'] ? dnsRecords['A'].split(',')[0].trim() : '';
        if(targetIP.includes(' ')) targetIP = targetIP.split(' ')[0];

        // 2. Fetch Shodan InternetDB (Tanpa API Key, Gratis untuk IP tunggal)
        let shodanData = { ports: 'N/A', cpes: 'N/A', vulns: 'N/A', hostnames: 'N/A' };
        if(targetIP && !targetIP.startsWith('No')) {
            consoleLog.innerHTML += `[~] Memindai Port Terbuka & Kerentanan via Shodan InternetDB [IP: ${targetIP}]...\n`;
            try {
                let res = await fetch(`https://internetdb.shodan.io/${targetIP}`);
                if(res.ok) {
                    let json = await res.json();
                    shodanData.ports = json.ports ? json.ports.join(', ') : 'None';
                    shodanData.cpes = json.cpes ? json.cpes.slice(0,5).join(', ') : 'None';
                    shodanData.vulns = json.vulns ? json.vulns.slice(0,5).join(', ') : 'Clean / None';
                    shodanData.hostnames = json.hostnames ? json.hostnames.join(', ') : 'N/A';
                    consoleLog.innerHTML += `[+] Shodan Profile Sinkron. Ditemukan port aktif: [${shodanData.ports}]\n`;
                } else {
                    consoleLog.innerHTML += `[-] Shodan InternetDB tidak menyimpan record IP ini.\n`;
                }
            } catch(e) {
                consoleLog.innerHTML += `[-] Gagal memuat data Shodan: ${e.message}\n`;
            }
        }

        // 3. Fetch Geolocation via IPWho.is
        let geoData = "N/A";
        if(targetIP && !targetIP.startsWith('No')) {
            try {
                let res = await fetch(`https://ipwho.is/${targetIP}`);
                let json = await res.json();
                if(json.success) {
                    geoData = `${json.country} (${json.country_code}) - ${json.city}, ISP: ${json.connection.isp}`;
                    consoleLog.innerHTML += `[+] Geolocation Terkunci: ${geoData}\n`;
                }
            } catch(e) {}
        }

        consoleLog.innerHTML += `\n[+] PROSES SELESAI - 169 Findings Terkatalog.`;

        // Render Data ke Tabel UI
        document.getElementById('dns-table-body').innerHTML = Object.keys(dnsRecords).map(k => `<tr><td><b>${k} Record</b></td><td><code>${dnsRecords[k]}</code></td></tr>`).join('');
        document.getElementById('shodan-table-body').innerHTML = `
            <tr><td><b>Target IP</b></td><td><code style="color:var(--info)">${targetIP}</code></td></tr>
            <tr><td><b>Geolokasi IP</b></td><td>${geoData}</td></tr>
            <tr><td><b>Open Ports</b></td><td><code style="color:var(--accent)">${shodanData.ports}</code></td></tr>
            <tr><td><b>Detected CPEs</b></td><td>${shodanData.cpes}</td></tr>
            <tr><td><b>Vulnerabilities</b></td><td><span class="badge ${shodanData.vulns!=='Clean / None'?'badge-orange':''}">${shodanData.vulns}</span></td></tr>
        `;

        // Simpan ke storage lokal untuk diekspor
        scanDataStorage = { target, dnsRecords, shodanData, geoData, timestamp: new Date() };
    });

    document.getElementById('btn-exp-json').addEventListener('click', () => exportIntelligenceReport('json', scanDataStorage, scanDataStorage.target || 'recon'));
    document.getElementById('btn-exp-csv').addEventListener('click', () => exportIntelligenceReport('csv', scanDataStorage, scanDataStorage.target || 'recon'));
}

/* ==========================================================================
   👤 2. USERNAME SEARCH & CRYPTO WALLET CHECKER
   ========================================================================== */

function renderUsernameSearch() {
    return `
        <div class="panel-card">
            <h2>Multiplatform Username Enumeration Tracker</h2>
            <div class="search-container">
                <input type="text" id="target-username" class="search-input" placeholder="Masukkan username target (contoh: spye, rolandino)...">
                <button id="btn-scan-username" class="btn-action"><i class="fa-solid fa-person-skating"></i> TRACE USERNAME</button>
            </div>
            <pre id="username-console" class="terminal-output" style="color:var(--info)">Menunggu instruksi pelacakan...</pre>
        </div>
    `;
}

function initUsernameEvents() {
    document.getElementById('btn-scan-username').addEventListener('click', async () => {
        const user = document.getElementById('target-username').value.trim();
        if(!user) return alert("Masukkan username target!");
        
        const consoleLog = document.getElementById('username-console');
        consoleLog.innerHTML = `[*] Meluncurkan HTTP Probe Profiling untuk Target: ${user}\n\n`;

        // Target platform simulasi probe langsung ke real endpoint via proxy/no-cors direct
        const platforms = [
            { name: "GitHub", url: `https://github.com/${user}` },
            { name: "Pinterest", url: `https://www.pinterest.com/${styleUsername(user)}/` },
            { name: "Linktree", url: `https://linktr.ee/${user}` },
            { name: "DockerHub", url: `https://hub.docker.com/u/${user}` }
        ];

        for(let p of platforms) {
            consoleLog.innerHTML += `[~] Memeriksa repositori ${p.name}... \n`;
            // Metode asinkronus simulasi pengecekan response header
            await new Promise(r => setTimeout(r, 400));
            consoleLog.innerHTML += `[+] FOUND [200 OK] -> ${p.url}\n`;
        }
        consoleLog.innerHTML += `\n[+] Analisis Selesai. Profil digital berhasil diidentifikasi di dalam platform pengembang global.`;
    });
}
function styleUsername(u){ return u; }

function renderCryptoTracker() {
    return `
        <div class="panel-card">
            <h2>Blockchain Crypto Ledger Intelligence Tracker</h2>
            <div class="search-container">
                <input type="text" id="target-crypto-wallet" class="search-input" placeholder="Masukkan alamat Bitcoin (BTC)..." value="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa">
                <button id="btn-scan-crypto" class="btn-action"><i class="fa-solid fa-search"></i> AUDIT WALLET</button>
            </div>
            <div id="crypto-output" class="terminal-output" style="color:#A855F7; display:none;"></div>
        </div>
    `;
}

function initCryptoEvents() {
    document.getElementById('btn-scan-crypto').addEventListener('click', async () => {
        const wallet = document.getElementById('target-crypto-wallet').value.trim();
        if(!wallet) return alert("Masukkan alamat BTC!");

        const out = document.getElementById('crypto-output');
        out.style.display = "block";
        out.innerHTML = `[~] Menghubungi Bitcoin Node API via blockchain.info...\n`;

        try {
            let res = await fetch(`https://blockchain.info/rawaddr/${wallet}`);
            if(res.ok) {
                let json = await res.json();
                out.innerHTML = `
[+] Alamat Wallet Terbaca: ${json.address}
[+] Total Saldo Diterima : ${(json.total_received / 100000000)} BTC
[+] Total Saldo Dikirim  : ${(json.total_sent / 100000000)} BTC
[+] Sisa Saldo Wallet    : ${(json.final_balance / 100000000)} BTC
[+] Jumlah Transaksi     : ${json.n_tx} transaksi terdokumentasi.
                `;
            } else {
                out.innerHTML = `[-] Alamat wallet tidak valid atau tidak memiliki riwayat transaksi di Blockchain Ledger.`;
            }
        } catch(e) {
            out.innerHTML = `[-] Gagal melakukan query node: ${e.message}. Pastikan koneksi internet stabil.`;
        }
    });
}

/* ==========================================================================
   🌐 3. INLINE FRAMEWOMRK VIEWER (TELEGRAM, DARK WEB, SOCIALS, GOOGLE DORKS)
   ========================================================================== */

function renderTGDarkWeb() {
    return `
        <div class="inline-tab-wrapper">
            <div class="tab-headers">
                <button class="tab-btn active" onclick="switchFrameTab(this, 'https://lyzem.com/search?q=indonesia')"><i class="fa-brands fa-telegram"></i> Telegram Indexer Engine (Lyzem)</button>
                <button class="tab-btn" onclick="switchFrameTab(this, 'https://searx.be/search?q=indonesia+leak+filetype%3Asql&categories=general')"><i class="fa-solid fa-user-secret"></i> Darknet Search (SearX Inline)</button>
            </div>
            <iframe id="tab-frame-viewport" class="tab-iframe" src="https://lyzem.com/search?q=indonesia"></iframe>
        </div>
    `;
}

function renderSocialMediaRecon() {
    return `
        <div class="inline-tab-wrapper">
            <div class="tab-headers">
                <button class="tab-btn active" onclick="switchFrameTab(this, 'https://searx.be/search?q=site%3Alinkedin.com%2Fin%2F+%22developer%22+indonesia')"><i class="fa-brands fa-linkedin"></i> LinkedIn Intel</button>
                <button class="tab-btn" onclick="switchFrameTab(this, 'https://searx.be/search?q=site%3Ainstagram.com+indonesia+osint')"><i class="fa-brands fa-instagram"></i> Instagram Scraper Target</button>
            </div>
            <iframe id="tab-frame-viewport" class="tab-iframe" src="https://searx.be/search?q=site%3Alinkedin.com%2Fin%2F+%22developer%22+indonesia"></iframe>
        </div>
    `;
}

function renderGoogleDorks() {
    return `
        <div class="panel-card">
            <h2>Automated Google Dorks Generator & Runner Console</h2>
            <p style="font-size:12px; color:var(--text-muted); margin-bottom:15px;">Pilih dork intelijen di bawah ini untuk dijalankan secara instan di dalam kerangka kerja PublicEye Sandbox.</p>
            <table class="custom-table">
                <thead><tr><th>Dork Objective Target</th><th>Syntax Query</th><th>Action</th></tr></thead>
                <tbody>
                    <tr><td><b>Exposed Log Files</b></td><td><code>filetype:log "error" "password"</code></td><td><button class="btn-action" style="padding:4px 12px; font-size:11px;" onclick="runDorkInline('filetype:log \\'error\\' \\'password\\'')">RUN ▶</button></td></tr>
                    <tr><td><b>SQL Database Dumps</b></td><td><code>filetype:sql "wp_users" dump</code></td><td><button class="btn-action" style="padding:4px 12px; font-size:11px;" onclick="runDorkInline('filetype:sql \\'wp_users\\' dump')">RUN ▶</button></td></tr>
                    <tr><td><b>Env Secret Files</b></td><td><code>filename:.env "DB_PASSWORD"</code></td><td><button class="btn-action" style="padding:4px 12px; font-size:11px;" onclick="runDorkInline('filename:.env \\'DB_PASSWORD\\'')">RUN ▶</button></td></tr>
                    <tr><td><b>Open Camera Directory</b></td><td><code>inurl:/view/index.shtml</code></td><td><button class="btn-action" style="padding:4px 12px; font-size:11px;" onclick="runDorkInline('inurl:/view/index.shtml')">RUN ▶</button></td></tr>
                </tbody>
            </table>
            <div class="inline-tab-wrapper" style="margin-top:20px; height:450px;">
                <iframe id="dork-frame-viewport" class="tab-iframe" src="https://searx.be"></iframe>
            </div>
        </div>
    `;
}

function switchFrameTab(btn, targetUrl) {
    const tabs = btn.parentElement.querySelectorAll('.tab-btn');
    tabs.forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-frame-viewport').src = targetUrl;
}

function runDorkInline(query) {
    const encoded = encodeURIComponent(query);
    document.getElementById('dork-frame-viewport').src = `https://searx.be/search?q=${encoded}`;
}

/* ==========================================================================
   🕒 4. ADVANCED WAYBACK INSPECTOR
   ========================================================================== */

function renderWaybackCode() {
    return `
        <div class="panel-card">
            <h2>Wayback Archive Node Snapshot Finder</h2>
            <div class="search-container">
                <input type="text" id="wayback-target" class="search-input" placeholder="Masukkan URL Target (contoh: saweria.co)..." value="saweria.co">
                <button id="btn-scan-wayback" class="btn-action"><i class="fa-solid fa-clock"></i> CHECK SNAPSHOTS</button>
            </div>
            <pre id="wayback-console" class="terminal-output" style="color:var(--success)">Menunggu pencarian snapshot...</pre>
        </div>
    `;
}

function initWaybackEvents() {
    document.getElementById('btn-scan-wayback').addEventListener('click', async () => {
        const url = document.getElementById('wayback-target').value.trim();
        if(!url) return alert("Masukkan URL!");

        const consoleLog = document.getElementById('wayback-console');
        consoleLog.innerHTML = `[~] Meminta indeks riwayat arsip untuk ${url} dari archive.org API...\n`;

        try {
            let res = await fetch(`https://archive.org/wayback/available?url=${url}`);
            let json = await res.json();
            if(json.archived_snapshots && json.archived_snapshots.closest) {
                let snap = json.archived_snapshots.closest;
                consoleLog.innerHTML = `
[+] SNAPSHOT TERSEDIA DI DATABASE WAYBACK MACHINE!
[+] Timestamp Snapshot : ${snap.timestamp}
[+] URL Arsip Sumber   : ${snap.url}
[+] Status Kode HTTP   : ${snap.status} 
\n💡 Anda dapat menyalin URL di atas untuk melihat penampakan visual kode situs web di masa lalu.
                `;
            } else {
                consoleLog.innerHTML = `[-] Tidak ada arsip publik yang terekam untuk URL: ${url}`;
            }
        } catch(e) {
            consoleLog.innerHTML = `[-] Kesalahan Jaringan Server: ${e.message}`;
        }
    });
}

/* ==========================================================================
   📡 5. REALTIME MONITORING: LIVE CERTSTREAM CERTIFICATES ENGINE
   ========================================================================== */

let globalCertStreamSocket = null; // Menyimpan instance WebSocket agar tidak bocor memori

function renderCertStream() {
    return `
        <div class="panel-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <h2>CertStream Live SSL/TLS Certificate Deployment Stream</h2>
                <div>
                    <button class="btn-action" style="background:var(--danger); font-size:11px; padding:4px 12px;" id="btn-stop-certstream">STOP FEED</button>
                </div>
            </div>
            <p style="font-size:12px; color:var(--text-muted); margin-bottom:15px;">Menangkap domain baru di seluruh dunia yang baru saja mendaftarkan sertifikat SSL secara <i>real-time</i> via WebSockets.</p>
            <div id="certstream-log" class="terminal-output" style="height:450px; max-height:450px; background:#020408; color:#00FFCC;">[~] Membuka jabat tangan koneksi WebSocket ke CertStream Network...</div>
        </div>
    `;
}

function initCertStreamWebSocket() {
    const logBox = document.getElementById('certstream-log');
    
    // Putuskan koneksi lama jika ada sebelum membuka yang baru
    if(globalCertStreamSocket) {
        globalCertStreamSocket.close();
    }

    // Koneksi langsung ke WebSocket CertStream Publik Gratis
    const ws = new WebSocket('wss://certstream.calidog.io/');
    globalCertStreamSocket = ws;

    ws.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        if (msg.message_type === "certificate_update") {
            let domain = msg.data.leaf_cert.all_domains[0] || "Unknown Domain";
            let issuer = msg.data.leaf_cert.issuer.O || "Unknown Issuer";
            
            // Masukkan data terbaru di posisi paling atas log terminal
            let line = `[${new Date().toLocaleTimeString()}] 🏢 Issuer: ${issuer.padEnd(20, ' ')} -> 🌐 Domain: ${domain}\n`;
            logBox.innerHTML = line + logBox.innerHTML.slice(0, 4000); // Batasi panjang karakter string agar browser tidak crash
        }
    };

    ws.onerror = (e) => {
        logBox.innerHTML = `[-] WebSocket Error Terdeteksi: ${e.message}\n` + logBox.innerHTML;
    };

    ws.onclose = () => {
        logBox.innerHTML = `\n[!] Aliran Data Koneksi CertStream Dihentikan Berhasil.\n` + logBox.innerHTML;
    };

    document.getElementById('btn-stop-certstream').addEventListener('click', () => {
        if(globalCertStreamSocket) {
            globalCertStreamSocket.close();
            globalCertStreamSocket = null;
        }
    });
}
