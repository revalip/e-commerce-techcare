# TECHCARE — E-Commerce Retail IT & Perangkat Keras UMKM

Platform webapp e-commerce modern untuk **TECHCARE**, sebuah toko retail & workshop IT UMKM terpercaya yang bergerak di bidang penjualan perangkat teknologi informasi (IT) terkurasi lulus 32 titik QC, laptop bisnis & performa tinggi, komponen upgrade RAM/SSD, peripheral workstation, monitor, serta layanan jasa IT (ASUS, Logitech, Lenovo, Fantech, MSI, Apple, Dell, Corsair, Kingston, Samsung, LG).

Proyek ini dibangun dengan pendekatan *mobile-first* & **PWA**, estetika monokrom minimalis modern, animasi mikro interaktif yang halus (*Framer Motion*), serta arsitektur multi-user berbasis peran (*Guest*, *Buyer*, dan *Admin*).

> 🌐 **Live Website:** https://techcare.lippsrv.my.id

---

## 🚀 Fitur Unggulan

### 1. Pengalaman Belanja Terstruktur (Multiuser Role)
- **Guest (Tamu)**:
  - Menjelajahi 15 katalog perangkat IT terkurasi, pencarian *real-time* (pencarian global & kolom pencarian cepat), filter kategori (*Semua*, *Laptop*, *RAM*, *SSD*, *Monitor*, *Aksesori*), serta *Filter Sheet* (merek, rentang harga, favorit, urutkan, dan mode Grid/Daftar).
  - Melihat detail spesifikasi teknis lengkap, konfigurasi dinamis warna/RAM/SSD, serta standar pengecekan **32 titik QC**.
  - Memasukkan produk ke keranjang belanja (*Cart Drawer*) maupun daftar favorit (*Wishlist Drawer*).
  - **Pelacakan & Privasi Tamu**: Tamu dapat melacak status pesanan memakai nomor invoice/resi dengan penyamaran otomatis data pribadi (*PII masking*), dan wajib masuk/daftar sebelum menyelesaikan checkout.
- **Buyer (Pembeli)**:
  - Pendaftaran akun buyer baru dengan nama, email, password (ter-hash aman), dan nomor WhatsApp.
  - Akses *Checkout* dengan **kalkulator ongkir otomatis 8 zona wilayah Indonesia** (JNE, J&T, SiCepat, atau ambil di Workshop Depok), klaim voucher promo (`TECHCARE10`), serta unggah bukti transfer.
  - Pelacakan riwayat pesanan dengan filter segmen (*Semua*, *Diproses*, *Dikirim*, *Selesai*) dan progress bar real-time.
- **Admin (Pengelola Toko)**:
  - **Dashboard Eksekutif**: Ringkasan omzet lunas, pesanan perlu verifikasi bukti, peringatan stok menipis, distribusi status pesanan, dan inventaris produk aktif.
  - **Manajemen Produk & Kategori IT**: Tambah, edit, dan hapus perangkat maupun kategori katalog.
  - **Manajemen Promo, Kupon & Pengguna**: Menerbitkan voucher diskon (persentase atau nominal rupiah) serta mengelola peran akun (*Admin* / *Buyer*).
  - **Manajemen Pesanan & Verifikasi**: Preview dan verifikasi bukti pembayaran (*Setujui / Tolak*), pembaruan status pesanan (*Menunggu Bayar → Verifikasi → Dibayar → Dikemas & QC → Dikirim → Selesai*), serta penginputan nomor resi pengiriman kurir.

### 2. Metode Pembayaran Lokal (UMKM Friendly — Simulasi)
- **Transfer Bank**: Mendukung transfer ke rekening bank lokal (BCA & Mandiri) lengkap dengan **kode unik 3 digit**, **timer batas bayar 24 jam**, tombol salin nominal/rekening, dan unggah bukti bayar.
- **QRIS Instan**: Pembayaran mudah lewat pemindaian kode QRIS untuk seluruh mobile banking atau e-Wallet Indonesia (GoPay, OVO, Dana, ShopeePay, BCA Mobile).

### 3. UI/UX, PWA & Animasi
- **Desain Monokrom Minimalis Modern**: Logo monokrom baru TechCare (Navbar, Login, Footer, Favicon & ikon PWA), *bottom navigation* translucent di mobile, *Search Bar* dengan tombol hapus/batal cepat, *Segmented Control* penuh tanpa terpotong di HP, serta **Hero Video ThinkPad**.
- **Progressive Web App (PWA)**: Installable di HP & desktop dengan Service Worker (`sw-v2.js`) bebas cache macet.
- **Cart & Wishlist Drawer**: Tampilan geser halus dari sisi kanan di desktop dan *bottom sheet* di perangkat mobile lengkap dengan *Cart Toast* + tombol *Undo*.
- **Target Sentuh & Responsivitas**: Target sentuh ergonomis (≥ 44px), 0 *horizontal overflow*, serta animasi halus (*Framer Motion*).

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) + **VitePWA**
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animasi**: [Framer Motion](https://www.framer.com/motion/) & Lenis
- **Icons**: [Lucide React](https://lucide.dev/)
- **State, Auth & Dual-Mode Data**: React Context API (`AuthContext`, `CartContext`, `WishlistContext`) — mendukung **Mode Standalone Demo (`localStorage` + SHA-256 salted hash)** untuk deploy statis maupun **Mode Full-Stack API (`VITE_API_MODE=api`)**.

### Backend (Server — Opsional Full-Stack)
- **Runtime**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database**: [MySQL](https://www.mysql.com/) (menggunakan driver `mysql2/promise`)
- **Keamanan & Middleware**: `bcryptjs`, JWT, CORS whitelist, Dotenv, Multer (upload bukti bayar), sanitasi XSS, dan rate limiting.

### Deployment, Testing & Server
- **Live Hosting**: Deployed di **aaPanel / Ubuntu Server** (`https://techcare.lippsrv.my.id`) dengan Nginx + Cloudflare, sekaligus dilengkapi konfigurasi **Netlify** (`netlify.toml`) & **Vercel** (`vercel.json`).
- **Process Manager**: PM2 (`ecosystem.config.js`).
- **Automated Testing**: `npm test` (8/8 pengujian keamanan, kalkulasi ongkir, format, dan katalog PASS).

---

## 🔑 Akun Demo Pengujian

Aplikasi telah dilengkapi dengan akun demo bawaan untuk mempermudah peninjauan:

| Peran (Role) | Email | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@techcare.id` | `admin123` | Akses penuh ke Dashboard Admin, verifikasi bayar, kelola produk, kategori, kupon, user, dan status order. |
| **Buyer (Demo)** | `buyer@techcare.id` | `buyer123` | Menjelajah, checkout produk, unggah bukti bayar, dan melihat riwayat belanja. |
| **Buyer Baru** | *Daftar mandiri* | *Password sendiri* | Siapapun dapat mendaftar langsung melalui tombol **"Masuk"**. |

*(Tersedia tombol pintas **"Masuk Admin Demo"** dan **"Masuk Buyer Demo"** di dalam modal login untuk pengujian cepat 1-klik).*

---

## 📦 Struktur Proyek

```plaintext
e-commerce/
├── client/                     # Frontend React + Vite + PWA
│   ├── public/                 # Aset statis, video hero, favicon & ikon PWA
│   ├── src/
│   │   ├── components/         # Komponen UI (Navbar, Hero, FilterSheet, CartDrawer, AuthModal, dll)
│   │   ├── context/            # Global state (AuthContext, CartContext, WishlistContext)
│   │   ├── data/               # Katalog mock hardware IT, ongkir 8 zona & voucher promo
│   │   ├── pages/              # Halaman web (Home, Shop, Detail, Checkout, Orders, Admin, dll)
│   │   ├── services/           # Abstraksi API Dual-Mode (Standalone Demo + Express/MySQL)
│   │   └── utils/              # Formatter Rupiah, ongkir & utilitas keamanan
│   ├── package.json
│   └── vite.config.js
├── server/                     # Backend Express API & Database MySQL
│   ├── scripts/                # Database seeder (seed.js)
│   ├── src/                    # Controller, middleware keamanan & router
│   ├── package.json
│   └── ecosystem.config.js     # Konfigurasi PM2
├── database/                   # Skema SQL MySQL
├── scripts/                    # Automated verification test suite (verify.mjs)
├── nginx/                      # Konfigurasi vhost reverse proxy
├── netlify.toml & vercel.json  # Konfigurasi deploy SaaS
├── start-dev.bat               # Skrip 1-klik Windows untuk menjalankan Frontend & Backend
└── README.md                   # Dokumentasi proyek
```

---

## 💻 Panduan Menjalankan Secara Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) (versi 18 ke atas)
- *(Opsional untuk mode Full-Stack)* [MySQL](https://dev.mysql.com/downloads/) (via XAMPP / Laragon / aaPanel)

### 1. Menjalankan Cepat (Windows)
Cukup jalankan file batch di root direktori proyek:
```powershell
.\start-dev.bat
```
Skrip ini akan memastikan database siap, menyalakan backend Express di port `4000`, dan membuka frontend Vite di port `5173`.

### 2. Menjalankan Manual

**Langkah A: Menyiapkan Backend (Opsional — untuk `VITE_API_MODE=api`)**
```bash
cd server
npm install
npm run seed     # Inisialisasi dan seeding database 'techcare'
npm run dev      # Server aktif di http://localhost:4000
```

**Langkah B: Menyiapkan Frontend**
```bash
cd client
npm install
npm run dev      # Frontend aktif di http://localhost:5173
```

**Langkah C: Menjalankan Pengujian Otomatis**
```bash
npm test         # Menjalankan 8/8 pengujian otomatis
```

Buka peramban Anda di **`http://localhost:5173`**.

---

## 👥 Panduan Git & Kolaborasi Tim (Tutorial Push & Pull)

Bagian ini ditujukan sebagai panduan teknis bagi anggota tim pengembang untuk melakukan *clone*, *pull*, *commit*, dan *push* ke repository GitHub **TechCare**.

### 1. Kloning Repository Pertama Kali

Gunakan salah satu cara di bawah ini untuk mengunduh proyek ke komputer lokal Anda:

**Menggunakan Personal Access Token (PAT):**
```bash
git clone https://<GITHUB_TOKEN>@github.com/revalip/e-commerce-techcare.git
cd e-commerce-techcare
```

> **Catatan**: Jika menggunakan URL HTTPS standar (`git clone https://github.com/revalip/e-commerce-techcare.git`), Anda akan diminta login via pop-up browser Git Credential Manager atau memasukkan Personal Access Token sebagai password.

---

### 2. Konfigurasi Identitas Git Anggota Tim

Sebelum membuat commit, pastikan identitas Anda sudah diatur agar riwayat commit tercatat atas nama Anda:

```bash
git config user.name "Nama Lengkap Anda"
git config user.email "emailanda@example.com"
```

---

### 3. Alur Kerja Harian (Workflow Koding)

#### Langkah A: Selalu Tarik Update Terbaru Sebelum Koding
Agar tidak terjadi bentrok kode (*merge conflict*), selalu jalankan pull sebelum mulai bekerja:
```bash
git pull origin main
```

#### Langkah B: Periksa File yang Diubah
Untuk melihat file apa saja yang telah Anda modifikasi atau tambahkan:
```bash
git status
```

#### Langkah C: Simpan Perubahan (Stage & Commit)
Tambahkan perubahan ke dalam staging area dan berikan pesan commit yang deskriptif:
```bash
git add .
git commit -m "feat: tambahkan fitur filter harga di halaman shop"
```

*Contoh format pesan commit yang dianjurkan:*
- `feat:` penambahan fitur baru
- `fix:` perbaikan bug atau error
- `refactor:` perapihan struktur kode tanpa mengubah fungsi
- `style:` perbaikan tampilan UI, margin, atau styling CSS

---

### 4. Melakukan Push ke GitHub

Untuk mengirim commit lokal Anda ke repository GitHub:

```bash
git push origin main
```

> **Tips Jika Terjadi Error Otentikasi (Password Authentication Failed / Permission Denied):**  
> GitHub tidak lagi mendukung password akun biasa untuk push via terminal. Set remote URL dengan token yang telah disediakan:
> ```bash
> git remote set-url origin https://<GITHUB_TOKEN>@github.com/revalip/e-commerce-techcare.git
> git push origin main
> ```

---

### 5. Mengambil Update di Server (aaPanel / VPS / PC Lain)

Jika server atau komputer lain membutuhkan versi kode paling baru:

```bash
cd /path/ke/proyek/e-commerce-techcare
git pull origin main
```
Jika ada perubahan dependensi baru, jangan lupa jalankan:
```bash
# Update backend
cd server && npm install

# Update frontend
cd ../client && npm install && npm run build
```

---

### ⚠️ Aturan Keamanan Bersama
1. **Dilarang Menghapus File `.gitignore`**: File ini melindungi file sensitif seperti `.env` (kredensial database) dan folder `node_modules` agar tidak bocor ke publik.
2. **Jangan Mengedit File `.env` Langsung di Repository**: Buat file `.env` lokal berdasarkan `.env.example`.
3. **Selalu Uji Coba Build Sebelum Push**: Pastikan perintah `npm run build` di dalam folder `client` berhasil tanpa error sebelum melakukan push ke branch `main`.

---

## 📄 Lisensi
Hak Cipta © 2026 **TECHCARE**. Seluruh hak dilindungi undang-undang.
Didedikasikan untuk solusi perangkat IT & digital UMKM Indonesia.
