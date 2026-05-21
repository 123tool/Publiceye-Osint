## PublicEye v3.0 - Open Source Intelligence (OSINT) Platform

**PublicEye** adalah platform intelijen sumber terbuka (OSINT) berbasis web modern yang dirancang untuk analis keamanan, penyelidik siber, dan tim *Blue Team*. Platform ini memungkinkan pengumpulan data secara *real-time* langsung dari sisi klien (*client-side*) memanfaatkan API publik gratis dan protokol asinkronus berkecepatan tinggi tanpa memerlukan infrastruktur backend yang berat.

Platform ini hadir dengan antarmuka bertema *Cyber-Dark Glassmorphism* yang intuitif, menyatukan puluhan modul pengintaian, manajemen kasus, dan pemantauan lalu lintas sertifikat global dalam satu dasbor terpadu.

---

## Fitur

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
## 1. Termux (Android)
Untuk menjalankan PublicEye langsung dari ponsel Android Anda, pastikan Anda sudah memasang aplikasi Termux dari F-Droid, lalu jalankan perintah berikut :

1. Perbarui paket repositori Termux
```
pkg update && pkg upgrade -y
```
2. Pasang git dan python (atau nodejs)
```
pkg install git python -y
```
3. Klon repositori
```
git clone https://github.com/123tool/Publiceye-Osint.git
cd Publiceye-Osint
```
3. Jalankan server lokal ringan menggunakan Python
```
python -m http.server 8080
```
Setelah server berjalan, buka peramban web (Chrome/Brave) di Android Anda dan akses:
```
http://localhost:8080
```
​
## Ubuntu / Linux
​Untuk pengguna distro Linux berbasis Ubuntu atau Debian, Anda bisa menggunakan modul bawaan Python atau memasang Node.js:
​Opsi A: Menggunakan Python Bawaan
```
sudo apt update
sudo apt install git python3 -y
cd /path/to/publiceye-osint
python3 -m http.server 8080
```
Opsi B: Menggunakan Node.js (http-server)
```
sudo apt update
sudo apt install nodejs npm -y
sudo npm install -g http-server
cd /path/to/publiceye-osint
http-server -p 8080
```
Buka peramban web Anda dan akses :
```
http://localhost:8080
```

## Docker (Advanced Deployment)
​Jika Anda ingin membungkus platform ini ke dalam kontainer agar mudah disebarkan di server VPS :

## Jalankan container menggunakan image Nginx minimalis langsung dari folder proyek
```
docker run --name publiceye-framework -v $(pwd):/usr/share/nginx/html:ro -p 8080:80 -d nginx:alpine
```

## Konfigurasi API

​Secara bawaan (default), PublicEye bekerja memanfaatkan modul public scraping gratis. Jika Anda memiliki kunci akses premium untuk memperdalam hasil analisis data (seperti Shodan premium atau VirusTotal API), Anda dapat memasukkannya langsung melalui halaman menu Settings & API Keys.

​## Catatan Keamanan :

Semua API Key disimpan dengan aman di dalam localStorage peramban web lokal Anda. Kunci tersebut tidak dikirimkan ke server luar mana pun selain ke titik akhir resmi penyedia API terkait.

​## Disclaimer

Segala bentuk penyalahgunaan alat ini untuk tindakan ofensif di luar hukum atau tanpa izin tertulis dari pemilik target berada di luar tanggung jawab pengembang platform. Gunakan platform ini secara bijak demi tujuan riset keamanan dan forensik digital.
