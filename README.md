# TechCare — E-Commerce Hardware IT & Jasa Upgrade UMKM

**TechCare** adalah aplikasi web e-commerce *mobile-first* & **PWA** dengan desain minimalis bergaya **Apple Store / iOS 17** untuk toko retail IT & workshop UMKM Depok. Menyediakan laptop bisnis pilihan lulus 32 titik QC, monitor, komponen upgrade RAM/SSD, peripheral (Lenovo, Apple, ASUS, Dell, HP, Logitech, Corsair, Kingston, Samsung, LG, MSI, Fantech), serta layanan jasa IT dengan sistem multiuser (*Guest*, *Buyer*, dan *Admin*), pembayaran lokal (QRIS & Transfer Bank), dan kalkulator ongkir ekspedisi 8 zona.

> **Live Website:** https://techcare.lippsrv.my.id  
> **Repositori GitHub:** https://github.com/revalip/e-commerce-techcare  
> **Video Demo YouTube:** *(Tambahkan tautan YouTube setelah upload)*

---

## Fitur Utama

### 1. Produk, Katalog & UI Apple-Grade (Mobile-First + PWA)
- **Antarmuka Mobile-First & PWA:** Desain monokrom bersih ala Apple Store & iOS 17 — dilengkapi **Liquid Glass bottom navigation**, **iOS 17 Search Bar**, **iOS Segmented Control**, logo monokrom orisinal, ikon PWA installable (`sw-v2.js`), target sentuh standar Apple HIG (≥ 44px), dan 0 *horizontal overflow*.
- **Katalog 15 Produk Terkurasi:** Lintas brand utama (**Lenovo, Apple, ASUS, Dell, HP, Logitech, Corsair, Kingston, Samsung, LG, MSI, Fantech**) dengan hero video interaktif, badge hemat, indikator stok menipis/habis, dan preview titik warna.
- **Pencarian & Filter Lengkap:** Tirai pencarian global ala `apple.com`, pencarian real-time di katalog, filter kategori (`Semua · Laptop · RAM · SSD · Monitor · Aksesori`), serta *Filter Sheet* berisi pilihan **tampilan Grid/Daftar**, merek, rentang harga, favorit, dan pengurutan.
- **Halaman Detail Produk:** Galeri multi-sudut + zoom, pemilih warna & konfigurasi dinamis RAM/SSD dengan perhitungan harga otomatis, berat kirim, stok real-time, garansi 30–90 hari, serta standar **32 titik QC teknisi**.

### 2. Penjualan, Keranjang & Siklus Pesanan
- **Keranjang Belanja (*Cart Drawer*)** dan **Favorit (*Wishlist Drawer*)** dengan *toast notification* + tombol *Undo*.
- **Checkout Ringkas:** Alamat & Ekspedisi → Pembayaran & Voucher Promo (`TECHCARE10`) → Invoice & Tracking.
- **Manajemen Stok Otomatis:** Stok berkurang otomatis saat pesanan dibuat dan kembali otomatis bila pesanan dibatalkan.
- **Status Pesanan Lengkap:** `Menunggu Bayar` → `Menunggu Verifikasi` → `Dibayar` → `Dikemas & QC` → `Dikirim` → `Selesai` (serta `Dibatalkan`).
- **Riwayat & Pelacakan Pesanan:** Filter segmen (`Semua · Diproses · Dikirim · Selesai`), pencarian nomor invoice/resi, progress bar real-time, konfirmasi penerimaan, dan **penyamaran data pribadi (PII masking)** otomatis untuk pengunjung tamu (*Guest*).

### 3. Pembayaran Lokal — QRIS & Transfer Bank *(Mode Simulasi)*
> **PENTING (Simulasi):** Fitur pembayaran QRIS dan Transfer Bank (BCA & Mandiri) pada proyek ini adalah **simulasi untuk keperluan tugas kuliah / demo UMKM**. Aplikasi **tidak** terhubung ke payment gateway berbayar dan **tidak** menarik dana sungguhan.
- **Kode Unik 3 Digit** (`+Rp 101` s.d. `+Rp 999`) untuk membedakan nominal tiap transaksi.
- **Batas Waktu Pembayaran (Countdown Timer 24 Jam)** real-time.
- Halaman instruksi pembayaran lengkap: gambar **QRIS TechCare (Simulasi)**, nomor rekening BCA/Mandiri, tombol **Salin Nominal** dan **Salin Rekening**.
- **Upload Bukti Pembayaran** (screenshot/foto) dari sisi Buyer dan **Preview + Verifikasi (Setujui / Tolak)** langsung oleh Admin.

### 4. Ekspedisi Lokal (Tanpa API Berbayar)
- Pilihan kurir: **JNE Reguler**, **JNE YES**, **J&T Express**, **SiCepat BEST**, dan **Ambil di Workshop TechCare Depok**.
- **Estimasi ongkir otomatis** berdasarkan **8 zona wilayah Indonesia** × **total berat paket (kg)** dengan promo gratis ongkir Jabodetabek untuk transaksi ≥ Rp 5.000.000.
- **Input & Tampilan Nomor Resi** oleh Admin beserta tombol *Salin Resi* di halaman detail pesanan.

### 5. Dashboard Admin & Multiuser Role
- **Ringkasan Eksekutif bergaya App Store Connect:** Omzet lunas, pesanan perlu verifikasi bukti, visualisasi distribusi status & stok, peringatan **stok menipis (≤ 5 unit)**, serta total inventaris & akun.
- **Kelola Pesanan & Pembayaran:** Pencarian iOS, filter status, preview bukti transfer, tombol setujui/tolak bayar, update status pesanan, dan input nomor resi.
- **CRUD Produk, Kategori, Kupon Promo & Pengguna:** Kelola penuh katalog, kategori, kode voucher persen/nominal, serta hak akses role (`admin` ↔ `buyer`).
- **Proteksi Route per Role:** Halaman `/admin` hanya dapat diakses oleh akun ber-role `admin`.

### 6. Keamanan & Pengujian Otomatis
- **Hash Password:** `bcryptjs` di backend Express dan Web Crypto **SHA-256 + per-user random salt** di mode standalone demo (tanpa password plaintext di kode maupun `localStorage`).
- **Privasi & Sanitasi Input:** Penyamaran nama, telepon, email, dan alamat pada pelacakan tamu (*PII masking*), validasi ketat email/telepon/kuantitas positif, dan sanitasi XSS.
- **Proteksi Backend:** JWT autentikasi, pembatasan role admin, proteksi IDOR pada detail order, CORS whitelist dari `.env`, security headers, dan rate limiting pada login/register.
- **Automated Test Suite:** Lolos **8/8 pengujian otomatis** (`npm test`).

---

## Tech Stack & Arsitektur Deploy

| Lapisan | Teknologi |
| :--- | :--- |
| **Frontend & PWA** | React 18, Vite 5, VitePWA (`workbox`), Tailwind CSS 3, Framer Motion, Lenis, Lucide React |
| **Backend (Opsional Full-Stack)** | Node.js, Express 4, MySQL2, bcryptjs, JSON Web Token (JWT), Multer |
| **Database (Opsional Full-Stack)** | MySQL 8.0+ / TiDB Cloud Serverless / Aiven MySQL |
| **Hosting Live & SaaS** | Live di **aaPanel / Cloudflare** (`https://techcare.lippsrv.my.id`), siap juga di **Netlify** (`netlify.toml`) & **Vercel** (`vercel.json`) |

### Keputusan Arsitektur Dual-Mode
Netlify dan Vercel dirancang utama untuk frontend statis/serverless dan tidak menyediakan database MySQL permanen secara bawaan. Oleh karena itu, TechCare mendukung **dua mode**:
1. **Mode Standalone Demo (`VITE_API_MODE=demo`, Default di Netlify/Vercel):** Seluruh alur e-commerce (auth ter-hash, katalog, checkout, ongkir, kode unik, upload bukti bayar, verifikasi admin, CRUD produk/kategori/user) berjalan 100% di browser dengan persistensi `localStorage`. Ideal untuk demo tugas kuliah tanpa biaya server dan tanpa risiko backend *cold-start/sleep*.
2. **Mode Full-Stack API (`VITE_API_MODE=api`):** Menghubungkan frontend ke backend `server/` (Express + MySQL) yang dapat dideploy ke Railway / Render / VPS dengan database MySQL cloud gratis (seperti TiDB Cloud Serverless atau Aiven).

---

## Akun Demo Pengujian

| Role | Email | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@techcare.id` | `admin123` | Dashboard Admin, verifikasi pembayaran, resi, CRUD produk/kategori/kupon/user |
| **Buyer (Demo)** | `buyer@techcare.id` | `buyer123` | Belanja, checkout, upload bukti bayar, riwayat & tracking pesanan |
| **Registrasi Baru** | *(Daftar mandiri)* | *(Min. 6 karakter)* | Klik tombol **Masuk** → tab **Buat Akun (Buyer)** |

*(Pada mode demo, tersedia juga tombol pintas 1-klik **"Masuk Admin Demo"** dan **"Masuk Buyer Demo"** di dalam modal login.)*

---

## Cara Install & Menjalankan Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) v18 atau lebih baru (disarankan v20+)
- Git
- *(Opsional, hanya untuk mode Full-Stack)* MySQL 8.0+ (XAMPP / Laragon / Docker)

### A. Menjalankan Cepat — Mode Standalone Demo (Direkomendasikan)
```bash
# 1. Clone repositori
git clone https://github.com/revalip/e-commerce-techcare.git
cd e-commerce-techcare

# 2. Install dependensi frontend
cd client
npm install

# 3. Salin file environment contoh
cp .env.example .env

# 4. Jalankan server development
npm run dev
```
Buka browser di **`http://localhost:5173`**.

### B. Menjalankan Mode Full-Stack (Frontend + Express + MySQL)
```bash
# 1. Siapkan backend
cd server
npm install
cp .env.example .env
# Edit server/.env sesuai kredensial MySQL lokal & JWT_SECRET Anda

# 2. Inisialisasi & seed database MySQL 'techcare'
npm run seed

# 3. Jalankan backend API (port 4000)
npm run dev
```
Lalu pada terminal kedua, ubah `client/.env` menjadi `VITE_API_MODE=api`, kemudian jalankan:
```bash
cd client
npm run dev
```

### C. Menjalankan Pengujian Otomatis & Production Build
Dari root folder proyek:
```bash
npm test    # Menjalankan automated verification suite
npm run build   # Membuat production build di client/dist
```

---

## Panduan Deploy ke SaaS Hosting (Gratis)

### Opsi 1: Deploy ke Netlify (Paling Praktis — 2 Menit)
File `netlify.toml` sudah tersedia di root repo.
1. Login ke [app.netlify.com](https://app.netlify.com) menggunakan akun GitHub.
2. Klik **Add new site** → **Import an existing project** → pilih **GitHub**.
3. Pilih repositori `revalip/e-commerce-techcare`.
4. Netlify akan otomatis membaca `netlify.toml` (`Base directory: client`, `Build command: npm run build`, `Publish directory: client/dist`).
5. Pastikan environment variable `VITE_API_MODE=demo` terpasang (sudah diset default di `netlify.toml`).
6. Klik **Deploy site** dan tunggu ±1 menit hingga URL live muncul.

### Opsi 2: Deploy ke Vercel
File `vercel.json` sudah tersedia di root repo.
1. Login ke [vercel.com](https://vercel.com) menggunakan akun GitHub.
2. Klik **Add New Project** → impor `revalip/e-commerce-techcare`.
3. Vercel otomatis membaca `vercel.json`. Tambahkan env var `VITE_API_MODE=demo`.
4. Klik **Deploy**.

### Opsi 3: Deploy Full-Stack (Backend Express + MySQL Cloud)
1. Buat database MySQL gratis di **TiDB Cloud Serverless** atau **Aiven**.
2. Impor skema `database/schema.sql`.
3. Deploy folder `server/` ke **Render** atau **Railway**, isi env var sesuai `server/.env.example` (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, `JWT_SECRET`, `CLIENT_URL`).
4. Pada Netlify/Vercel, ubah env var frontend menjadi `VITE_API_MODE=api` dan `VITE_API_URL=https://<domain-backend-anda>/api`.

---

## Tim Pengembang (Kelompok 7 Anggota — Teknik Informatika)

> Isi kolom Nama Lengkap & NIM sebelum pengumpulan tugas. Panduan pembagian tugas & alur Git tersedia di [CONTRIBUTING.md](CONTRIBUTING.md).

| No | Nama Lengkap | NIM | Akun GitHub | Paket Tugas |
| :---: | :--- | :--- | :--- | :--- |
| 1 | `[Nama Anggota 1 — Tech Lead]` | `[NIM]` | `@revalip` | Setup Repo, Arsitektur, Review PR & Deploy |
| 2 | `[Nama Anggota 2]` | `[NIM]` | `@username2` | Modul Katalog, Pencarian, Filter Brand/Harga & Detail Produk |
| 3 | `[Nama Anggota 3]` | `[NIM]` | `@username3` | Modul Keranjang, Wishlist, Checkout & Voucher Promo |
| 4 | `[Nama Anggota 4]` | `[NIM]` | `@username4` | Modul Pembayaran Lokal (QRIS/Transfer Simulasi, Kode Unik, Bukti Bayar) |
| 5 | `[Nama Anggota 5]` | `[NIM]` | `@username5` | Modul Ekspedisi (JNE/J&T/SiCepat, Tarif Lokal, Tracking & Resi) |
| 6 | `[Nama Anggota 6]` | `[NIM]` | `@username6` | Modul Admin Dashboard (CRUD Produk, Kategori & Stok Menipis) |
| 7 | `[Nama Anggota 7]` | `[NIM]` | `@username7` | Modul Admin Pesanan, Kelola User/Role, Testing & Video Demo YouTube |

---

## Dokumentasi Terkait
- [CONTRIBUTING.md](CONTRIBUTING.md) — Panduan kolaborasi GitHub, alur PR, pembagian tugas 7 anggota, dan panduan pemula Git.
- [VIDEO-DEMO-SCRIPT.md](VIDEO-DEMO-SCRIPT.md) — Naskah lengkap video demo YouTube (3–5 menit).
- [LAPORAN-PENGERJAAN.md](LAPORAN-PENGERJAAN.md) — Laporan audit, checklist syarat dosen, dan pengujian.

---

## Lisensi
Hak Cipta © 2026 Kelompok TechCare — Tugas Kuliah Teknik Informatika. Digunakan untuk pembelajaran dan demonstrasi e-commerce UMKM.
