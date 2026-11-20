# TECHCARE — E-Commerce Retail IT, Perangkat Second & Jasa Service UMKM

**TECHCARE** adalah aplikasi web e-commerce *mobile-first* untuk toko retail IT & elektronik UMKM yang menyediakan laptop, monitor, peripheral (ASUS, Logitech, Lenovo, Fantech, MSI, Apple, Dell, Corsair, Kingston, Samsung, LG), komponen upgrade RAM/SSD, serta layanan jasa IT dengan sistem multiuser (*Guest*, *Buyer*, dan *Admin*), pembayaran lokal (QRIS & Transfer Bank), serta estimasi ongkir ekspedisi lokal.

> **Repositori GitHub:** `https://github.com/revalip/e-commerce-techcare`
> **Live Demo (Netlify / Vercel):** `[Tempel URL hasil deploy di sini]`
> **Video Demo YouTube:** `[Tempel URL video YouTube di sini]`

---

## Fitur Utama

### 1. Produk & Katalog
- Katalog produk IT realistis (13 produk lintas brand **ASUS, Logitech, Lenovo, Fantech, MSI**, Apple, Dell, Corsair, Kingston, Samsung, LG) dengan foto produk, badge diskon, grade kondisi, dan indikator stok menipis/habis.
- **Pencarian real-time**, **filter kategori**, **filter brand**, **filter rentang harga**, **filter favorit/wishlist**, serta **pengurutan** (*Terlaris, Terbaru, Harga Terendah, Harga Tertinggi, Rating Tertinggi*).
- **Halaman Detail Produk**: galeri multi-sudut + lightbox zoom, pemilih varian warna & konfigurasi dinamis RAM/SSD, tampilan berat kirim, stok real-time, serta checklist 32 titik QC teknisi.

### 2. Penjualan & Siklus Pesanan
- **Keranjang Belanja (*Cart Drawer*)** dan **Favorit (*Wishlist Drawer*)** dengan *toast notification* + tombol *Undo*.
- **Checkout 3 Langkah**: Alamat & Ekspedisi → Pembayaran & Voucher Promo → Invoice & Tracking.
- **Pengurangan stok otomatis** saat pesanan dibuat dan **pengembalian stok otomatis** saat pesanan dibatalkan.
- **Status pesanan lengkap**: `Menunggu Bayar` → `Menunggu Verifikasi` → `Dibayar` → `Dikemas & QC` → `Dikirim` → `Selesai` (serta `Dibatalkan`).
- **Riwayat & Pelacakan Pesanan**: filter status, pencarian nomor invoice/resi, timeline checkpoint perjalanan paket, konfirmasi penerimaan, dan pembatalan pesanan sebelum bayar.

### 3. Pembayaran Lokal — QRIS & Transfer Bank *(Mode Simulasi)*
> **PENTING (Simulasi):** Fitur pembayaran QRIS dan Transfer Bank (BCA & Mandiri) pada proyek ini adalah **simulasi untuk keperluan tugas kuliah / demo UMKM**. Aplikasi **tidak** terhubung ke payment gateway berbayar dan **tidak** menarik dana sungguhan.
- **Kode Unik 3 Digit** (`+Rp 101` s.d. `+Rp 999`) untuk membedakan nominal tiap transaksi.
- **Batas Waktu Pembayaran (Countdown Timer 24 Jam)** real-time.
- Halaman instruksi pembayaran lengkap: gambar **QRIS TECHCARE (Simulasi)**, nomor rekening BCA/Mandiri, tombol **Salin Nominal** dan **Salin Rekening**.
- **Upload Bukti Pembayaran** (screenshot/foto) dari sisi Buyer dan **Preview + Verifikasi (Setujui / Tolak)** langsung oleh Admin.

### 4. Ekspedisi Lokal (Tanpa API Berbayar)
- Pilihan kurir: **JNE Reguler**, **JNE YES**, **J&T Express**, **SiCepat BEST**, dan **Ambil di Workshop TECHCARE**.
- **Estimasi ongkir otomatis** berdasarkan **8 zona wilayah Indonesia** × **total berat paket (kg)** dengan promo gratis ongkir Jabodetabek untuk transaksi ≥ Rp 5.000.000.
- **Input & Tampilan Nomor Resi** oleh Admin beserta tombol *Salin Resi* di halaman tracking Buyer.

### 5. Dashboard Admin & Multiuser Role
- **Ringkasan Eksekutif**: total omzet, total pesanan, pesanan perlu verifikasi bukti, peringatan **stok menipis (≤ 5 unit)**, dan jumlah akun/promo.
- **Kelola Pesanan & Pembayaran**: pencarian, filter status, preview gambar bukti transfer, tombol setujui/tolak bayar, update status pesanan, dan input nomor resi.
- **CRUD Produk Lengkap**: tambah, edit lengkap (nama, brand, kategori, kondisi, harga, stok, berat, deskripsi), dan hapus produk.
- **CRUD Kategori Produk**: tambah, edit, dan hapus kategori katalog.
- **Manajemen Kupon Promo**: buat kupon persen/nominal & aktif/nonaktifkan kupon.
- **Manajemen Pengguna & Role**: ubah role (`admin` ↔ `buyer`), aktif/nonaktifkan akun, dan tambah pengguna baru.
- **Proteksi Route per Role**: halaman `/admin` hanya dapat diakses oleh akun ber-role `admin`.

### 6. Keamanan Dasar
- **Hash Password**: `bcryptjs` di backend Express dan Web Crypto **SHA-256 + per-user random salt** di mode standalone demo (tidak ada password plaintext di kode maupun `localStorage`).
- **Validasi & Sanitasi Input**: validasi email, nomor telepon, kekuatan password (min. 6 karakter), validasi kuantitas integer positif, serta sanitasi karakter berbahaya untuk mitigasi XSS.
- **Proteksi Backend**: JWT autentikasi, pembatasan akses role admin, proteksi IDOR pada detail order, CORS whitelist dari `.env`, security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`), dan rate limiting pada endpoint login/register.

---

## Screenshot Aplikasi *(Placeholder)*

> Ganti placeholder di bawah dengan screenshot hasil deploy sebelum pengumpulan tugas.

| Halaman | Tampilan Mobile (360px) | Tampilan Desktop (1280px) |
| :--- | :--- | :--- |
| Beranda & Hero | `![Beranda Mobile](docs/screenshots/home-mobile.png)` | `![Beranda Desktop](docs/screenshots/home-desktop.png)` |
| Katalog & Filter | `![Katalog Mobile](docs/screenshots/shop-mobile.png)` | `![Katalog Desktop](docs/screenshots/shop-desktop.png)` |
| Checkout & Ongkir | `![Checkout Mobile](docs/screenshots/checkout-mobile.png)` | `![Checkout Desktop](docs/screenshots/checkout-desktop.png)` |
| Instruksi QRIS & Resi | `![Order Mobile](docs/screenshots/order-mobile.png)` | `![Order Desktop](docs/screenshots/order-desktop.png)` |
| Dashboard Admin | `![Admin Mobile](docs/screenshots/admin-mobile.png)` | `![Admin Desktop](docs/screenshots/admin-desktop.png)` |

---

## Tech Stack & Arsitektur Deploy

| Lapisan | Teknologi |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Framer Motion, Lucide React |
| **Backend (Opsional Full-Stack)** | Node.js, Express 4, MySQL2, bcryptjs, JSON Web Token (JWT), Multer |
| **Database (Opsional Full-Stack)** | MySQL 8.0+ / TiDB Cloud Serverless / Aiven MySQL |
| **Hosting SaaS** | **Netlify** (`netlify.toml`) atau **Vercel** (`vercel.json`) |

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
