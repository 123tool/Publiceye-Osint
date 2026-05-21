## PublicEye v3.0 - Open Source Intelligence (OSINT) Platform

**PublicEye** adalah platform intelijen sumber terbuka (OSINT) berbasis web modern yang dirancang untuk analis keamanan, penyelidik siber, dan tim *Blue Team*. Platform ini memungkinkan pengumpulan data secara *real-time* langsung dari sisi klien (*client-side*) memanfaatkan API publik gratis dan protokol asinkronus berkecepatan tinggi tanpa memerlukan infrastruktur backend yang berat.

Platform ini hadir dengan antarmuka bertema *Cyber-Dark Glassmorphism* yang intuitif, menyatukan puluhan modul pengintaian, manajemen kasus, dan pemantauan lalu lintas sertifikat global dalam satu dasbor terpadu.

---

## Fitur & Modul

* **Dasbor:** Menampilkan metrik langsung, matriks kemampuan platform, status tingkat ancaman sektoral, dan tindakan cepat (*quick action*).
* **Manajer Investigasi:** Sistem manajemen kasus (*case registry*) lokal terintegrasi lengkap dengan ID KASUS otomatis, penentuan prioritas ancaman (*Critical/High/Medium*), dan jumlah IOC tertaut.
* **Centralized IOC Vault:** Mengelola indikator ancaman (Domain, IP, SHA256, Email, URL, CVE) yang siap diekspor untuk kebutuhan integrasi SIEM/EDR.
* **Threat Feeds Aggregator:** Sinkronisasi info intelijen ancaman dari 6 sumber global tepercaya (CISA ICS-CERT, AlienVault OTX, URLhaus, PhishTank, MalwareBazaar, FS-ISAC).
* **Intelligence Exporter:** Ekspor hasil pemindaian dan temuan intelijen secara instan ke format berkas **JSON** atau **CSV** tanpa keluar dari aplikasi.

## Modul & API

* **DNS Record Ledger:** Ekstraksi asinkronus rekaman DNS (A, MX, TXT, NS, CNAME) menggunakan *Google DNS Over HTTPS* (DoH) API.
* **Shodan InternetDB Profiler:** Pemetaan port aktif, CPE, dan daftar kerentanan CVE (1-click scan tanpa memerlukan API Key).
* **IP Geolocation Radar:** Pelacakan koordinat negara, kota, ISP, dan nomor ASN via API `ipwho.is`.
* **Crypto Tracker Ledger:** Audit mutasi saldo, total dana masuk/keluar, dan jumlah transaksi alamat Bitcoin (BTC) via Blockchain Node Explorer.
* **Advanced Wayback Inspector:** Pemeriksaan arsip riwayat snapshot situs web masa lalu secara instan melalui integrasi Wayback Machine API (`archive.org`).
* **CertStream Live Engine:** Pemantauan pendaftaran sertifikat SSL/TLS di seluruh dunia secara *real-time* menggunakan koneksi murni WebSocket (`wss://`).
* **Username Enumeration Probe:** Metode *HTTP probing* cepat untuk melacak keberadaan profil digital target di berbagai platform pengembang global.

## Sandbox Framework

* **Telegram & Dark Web Indexer:** Tab pencarian terintegrasi (Lyzem & SearX Darknet) di dalam *viewport frame* aplikasi untuk melacak kebocoran data.
* **Social Media Recon:** Pencarian intelijen spesifik untuk LinkedIn dan Instagram Scraper Target.
* **Automated Google Dorks Generator:** Pembuat dork otomatis (Exposed Logs, SQL Dumps, Env Secrets, Open Camera) dilengkapi dengan tombol eksekusi langsung (Run ▶).

---

## Instalasi & Penggunaan
### 📱 1. Via Termux (Android)
Untuk menjalankan PublicEye langsung dari ponsel Android Anda, pastikan Anda sudah memasang aplikasi Termux dari F-Droid, lalu jalankan perintah berikut:

```bash
# Perbarui paket repositori Termux
pkg update && pkg upgrade -y

# Pasang git dan python (atau nodejs)
pkg install git python -y

# Klon repositori PublicEye Anda
git clone [https://github.com/USERNAME/publiceye-osint.git](https://github.com/USERNAME/publiceye-osint.git)
cd publiceye-osint

# Jalankan server lokal ringan menggunakan Python
python -m http.server 8080
