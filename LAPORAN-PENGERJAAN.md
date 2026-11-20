# Laporan Pengerjaan Proyek E-Commerce TECHCARE

Laporan ringkas hasil audit, penyelesaian fitur, penguatan keamanan, uji *mobile-first*, persiapan deploy SaaS, dan dokumentasi kolaborasi untuk repositori **`revalip/e-commerce-techcare`**.

---

## 1. Ringkasan Audit Awal & Perbaikan Risiko Keamanan

### Temuan Audit Awal
- **Stack:** Frontend React 18 + Vite 5 + Tailwind CSS 3 + Framer Motion (`client/`); Backend Express 4 + MySQL2 + bcryptjs + JWT + Multer (`server/`); Skema SQL (`database/schema.sql`).
- **Kesenjangan Utama yang Ditemukan:**
  1. Frontend (`api.js` & `AuthContext.jsx`) sebelumnya berjalan 100% di `localStorage` dan menyimpan **password plaintext** di kode sumber serta `localStorage`.
  2. Backend (`server/`) masih membawa sisa branding `NOVAIRE` (`admin@novaire.com`, order `NOV-`, `qris-novaire.svg`), CORS terbuka penuh (`origin: '*'`), fallback hardcoded `JWT_SECRET`, celah validasi kuantitas negatif pada `createOrder`, celah IDOR pada `GET /orders/:orderNumber` dan upload bukti, serta belum memiliki endpoint CRUD kategori & kelola role user.
  3. Beberapa fitur syarat dosen belum lengkap: belum ada **filter brand** di katalog, belum ada produk **MSI** di data demo, belum ada **kode unik 3 digit & countdown 24 jam** pembayaran, belum ada **preview gambar bukti transfer** di Admin Dashboard, belum ada **J&T Express** & **kalkulasi ongkir berdasarkan berat + wilayah**, belum ada kartu/peringatan **stok menipis**, serta belum ada **CRUD kategori** dan **kelola user/role** di Admin Dashboard.
  4. Pengujian awal di layar tablet (`768px`) menemukan clipping tombol keranjang di kanan header (`Navbar.jsx`) — sudah diperbaiki dan diverifikasi ulang hingga lolos 100%.

### Pemeriksaan Kredensial (Aturan Keamanan)
- Tidak ditemukan API key, token pihak ketiga, atau kredensial produksi yang ter-commit di repositori. File `.env` sudah dikecualikan di `.gitignore`, dan seluruh konfigurasi disediakan melalui `.env.example`.

---

## 2. Ringkasan Perubahan Utama

1. **Produk & Katalog:** Menambahkan produk **MSI MAG 341CQP 34"** (`beratGram: 6800`, stok 3) dan `beratGram` pada seluruh 13 produk; menambahkan **filter Brand**, urutan **Terbaru & Rating Tertinggi**, serta proteksi stok habis (`stok === 0`) di kartu dan halaman detail produk.
2. **Penjualan & Siklus Status Lengkap:** Melengkapi status pesanan menjadi `Menunggu Bayar` → `Menunggu Verifikasi` → `Dibayar` → `Dikemas & QC` → `Dikirim` → `Selesai` (+ `Dibatalkan`), validasi ketersediaan stok sebelum checkout, pengurangan stok otomatis, pembatalan pesanan dengan **pengembalian stok otomatis**, serta pemfilteran riwayat pesanan milik buyer yang sedang login.
3. **Pembayaran Lokal Simulasi (QRIS & Transfer Bank):** Menambahkan aset **QRIS TECHCARE** (`client/public/images/qris-techcare.svg`), **Transfer BCA & Mandiri**, **kode unik 3 digit**, **countdown timer batas waktu 24 jam**, tombol salin nominal/rekening, label transparansi mode simulasi, upload bukti bayar, dan **modal preview gambar bukti bayar** bagi Admin.
4. **Ekspedisi Lokal (Tanpa API Berbayar):** Membuat mesin tarif lokal (`client/src/data/shipping.js`) berisi **8 zona wilayah Indonesia** × **total berat paket (kg)** untuk **JNE Reguler, JNE YES, J&T Express, SiCepat BEST, dan Workshop TECHCARE**, serta input & tampilan nomor resi.
5. **Admin Dashboard Lengkap:** Menambahkan metrik & banner peringatan **Stok Menipis (≤ 5 unit)**, filter & pencarian pesanan, modal **Edit Produk Lengkap**, **Tab Kategori (CRUD)**, dan **Tab Pengguna & Role** (ubah role, aktif/nonaktif, tambah akun).
6. **Keamanan & Backend Hardening:** Menghapus seluruh password plaintext dari client (diganti **SHA-256 + per-user random salt** via Web Crypto API), sanitasi input XSS, proteksi route `/admin` + sinkronisasi URL SPA; mengeraskan Express backend (security headers, rate limiter login/register, CORS whitelist, non-hardcoded `JWT_SECRET`, proteksi IDOR, validasi kuantitas positif, restore stok saat batal, serta endpoint admin kategori & user).
7. **UI Mobile-First & Optimasi Build:** Menambahkan **Mobile Bottom Navigation Bar**, memperbaiki clipping header tablet `768px`, dan mengatur `manualChunks` di `vite.config.js` hingga build lolos tanpa peringatan ukuran chunk.
8. **Deploy & Dokumentasi Tim:** Menambahkan `netlify.toml`, `vercel.json`, automated test (`scripts/verify.mjs`), pembaruan `README.md`, `CONTRIBUTING.md` (7 paket tugas + panduan pemula Git), dan `VIDEO-DEMO-SCRIPT.md`.

---

## 3. Daftar Fitur Final vs Syarat Dosen (Checklist)

| Syarat Dosen | Status | Bukti Implementasi |
| :--- | :---: | :--- |
| **Produk:** katalog, pencarian, filter kategori/brand/harga, urutan, detail (galeri, spec, stok), data demo realistis | **LULUS** | `ShopPage.jsx`, `ProductDetailPage.jsx`, `mock.js` (13 produk: ASUS, Lenovo, Logitech, Fantech, MSI, dll.) |
| **Penjualan:** keranjang, checkout, riwayat, status lengkap (menunggu bayar, dibayar, dikemas, dikirim, selesai, batal), stok otomatis | **LULUS** | `CartContext.jsx`, `CheckoutPage.jsx`, `OrderHistoryPage.jsx`, `OrderDetailPage.jsx`, `api.js` |
| **Pembayaran Lokal (Simulasi):** QRIS & transfer bank, instruksi bayar, kode unik, batas waktu, upload bukti, konfirmasi admin, penjelasan simulasi | **LULUS** | `CheckoutPage.jsx`, `OrderDetailPage.jsx`, `AdminDashboard.jsx`, `qris-techcare.svg`, `README.md` |
| **Ekspedisi (Opsional):** pilih kurir (JNE/J&T/SiCepat), estimasi ongkir berat/wilayah lokal, input & tampil resi | **LULUS** | `client/src/data/shipping.js`, `CheckoutPage.jsx`, `OrderDetailPage.jsx`, `AdminDashboard.jsx` |
| **Admin & Multiuser:** dashboard (pesanan, omzet, stok menipis), CRUD produk/kategori, kelola pesanan/bayar, kelola user/role, proteksi route | **LULUS** | `AdminDashboard.jsx`, `AuthContext.jsx`, `App.jsx`, `server/src/controllers/adminController.js` |
| **Keamanan Dasar:** hash password, validasi input, mitigasi XSS/CSRF, batasi akses admin | **LULUS** | `client/src/utils/security.js`, `server/src/middleware/security.js`, `server/src/middleware/auth.js` |
| **Teknis — UI Mobile-First:** nyaman mulai 360px hingga desktop | **LULUS** | `MobileBottomNav.jsx`, `Navbar.jsx`, uji browser pada `360px`, `768px`, `1280px` |
| **Teknis — GitHub 7 Anggota:** `.gitignore`, `README.md`, `CONTRIBUTING.md` + 7 paket tugas + commit bersih | **LULUS** | `.gitignore`, `README.md`, `CONTRIBUTING.md`, riwayat commit lokal konvensional |
| **Teknis — Siap Deploy SaaS:** Netlify / Vercel | **LULUS** | `netlify.toml`, `vercel.json`, `client/public/_redirects`, `npm run build` lolos |
| **Teknis — Video Demo YouTube:** naskah 3–5 menit + metadata | **LULUS** | `VIDEO-DEMO-SCRIPT.md` |

---

## 4. Hasil Pengujian (Automated Test, Build & Multi-Viewport Browser)

### A. Automated Test & Production Build
- `npm test` (`scripts/verify.mjs`): **8/8 PASS** (hashing SHA-256 + salt, validasi/sanitasi XSS, tabel ongkir 8 zona × 5 kurir, format & 6 status pesanan, integritas 13 produk + 5 brand utama + eksistensi gambar, validasi server).
- Syntax check seluruh file backend (`server/src/**/*.js` & `server/scripts/seed.js`): **PASS**.
- `npm run build` (`vite build`): **PASS tanpa error dan tanpa chunk warning** (`vendor-icons` 23 kB, `vendor-react` 134 kB, `vendor-motion` 159 kB, `index` 258 kB).

### B. Uji Browser Multi-Lebar Layar (Production Preview)
| Viewport | Halaman & Alur Diuji | Horizontal Overflow | Console / Network Error | Status |
| :--- | :--- | :---: | :---: | :---: |
| **360×800 (Mobile)** | Home, Mobile Bottom Nav, Katalog (Filter Brand/Harga), Detail Produk, Tambah Keranjang | **Tidak ada** (`354px <= 360px`) | 0 error | **PASS** |
| **768×1024 (Tablet)** | Header (Login & Logout), Cart Drawer, Checkout 3 Step (Ongkir dinamis, Kode Unik, QRIS), Order Detail (Countdown + 6-step timeline) | **Tidak ada** (`762px <= 768px`, tombol keranjang `x=671..738px`) | 0 error | **PASS** |
| **1280×800 (Desktop)** | Admin Dashboard (4 Metrik, Stok Menipis, 5 Tab: Pesanan + Preview Bukti Bayar, Produk, Kategori, Kupon, Pengguna) | **Tidak ada** (`1274px <= 1280px`) | 0 error | **PASS** |

---

## 5. Cara Menjalankan Lokal & Cara Deploy

- **Lokal Cepat (Mode Demo — tanpa perlu MySQL):**
  ```bash
  cd client
  npm install
  npm run dev
  ```
  Buka `http://localhost:5173`.
- **Lokal Full-Stack (Opsional dengan MySQL):** Jalankan `npm install && npm run seed && npm run dev` di folder `server/` setelah mengisi `server/.env` dari `server/.env.example`, lalu set `VITE_API_MODE=api` di `client/.env`.
- **Deploy Gratis ke Netlify / Vercel:** Hubungkan repo GitHub `revalip/e-commerce-techcare` di dashboard Netlify atau Vercel. Konfigurasi `netlify.toml` dan `vercel.json` otomatis membangun `client/dist` dalam mode `VITE_API_MODE=demo` dengan SPA redirect aktif.

---

## 6. Akun Demo

- **Admin:** `admin@techcare.id` / `admin123` *(atau tombol 1-klik "Masuk Admin Demo")*
- **Buyer:** `buyer@techcare.id` / `buyer123` *(atau tombol 1-klik "Masuk Buyer Demo")*

---

## 7. Asumsi yang Diambil

1. **Arsitektur Dual-Mode (`demo` sebagai default deploy Netlify/Vercel):** Dipilih agar aplikasi langsung dapat diuji penuh oleh dosen dari tautan hosting SaaS gratis tanpa kendala server backend tidur (*cold start*) atau biaya database MySQL, sementara backend Express + MySQL di `server/` tetap diperbarui dan siap pakai jika ingin di-hosting terpisah (Railway/Render + TiDB/Aiven).
2. **Katalog Produk:** Mempertahankan desain katalog *Certified Second-Hand & Jasa IT (< Rp 10 Juta)* yang sudah dikembangkan di workspace sambil memastikan seluruh 5 brand utama (**ASUS, Logitech, Lenovo, Fantech, MSI**) lengkap tersedia.
3. **File Lama Tidak Dihapus Tanpa Alasan:** File lama seperti `client/public/images/qris-novaire.svg`, `client/src/data/mockProducts.js`, `client/src/pages/PromoPage.jsx`, dan `nginx/novaire.conf` dibiarkan tetap ada agar tidak merusak referensi eksternal apa pun, sementara seluruh alur aktif sudah diarahkan ke aset TECHCARE terbaru (`qris-techcare.svg`, `mock.js`).

---

## 8. Keterbatasan yang Tersisa

1. Pada **Mode Demo (`VITE_API_MODE=demo`)**, data tersimpan di `localStorage` masing-masing browser (tidak tersinkron antar perangkat berbeda). Untuk sinkronisasi lintas perangkat secara nyata, aktifkan **Mode Full-Stack (`VITE_API_MODE=api`)** dengan backend `server/` + MySQL cloud.
2. Pada **Mode Demo**, gambar bukti bayar disimpan dalam format *Data URL* di `localStorage`, sehingga dibatasi maksimal `4 MB` agar tidak memenuhi kuota storage browser.
3. Pembayaran QRIS dan Transfer Bank bersifat **simulasi manual** (tidak terhubung ke webhook Midtrans/Xendit).

---

## 9. Langkah Selanjutnya untuk Anda

1. **Tinjau Perubahan & Commit Lokal:** Periksa `git log` dan coba jalankan `npm run dev` untuk memastikan semuanya sesuai selera kelompok Anda.
2. **Push ke GitHub:** Setelah yakin, jalankan `git push origin main` (saya sengaja tidak melakukan push sesuai aturan kerja).
3. **Isi Identitas Kelompok:** Lengkapi tabel nama & NIM 7 anggota di `README.md` dan `VIDEO-DEMO-SCRIPT.md`.
4. **Kolaborasi 7 Anggota:** Undang 6 anggota lain ke repo GitHub lalu jalankan pembagian 7 branch/PR sesuai `CONTRIBUTING.md` agar semua anggota punya jejak commit nyata.
5. **Deploy ke Netlify / Vercel:** Hubungkan repo di Netlify (otomatis baca `netlify.toml`) dan tempelkan link Live Demo ke `README.md`.
6. **Rekam & Upload Video Demo:** Ikuti `VIDEO-DEMO-SCRIPT.md` untuk merekam video 3–5 menit dari link live, upload ke YouTube, lalu cantumkan link YouTube di `README.md`.
