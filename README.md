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
- **Automated Testing**: `npm test` (18/18 pengujian unit testing keranjang, varian multi-sudut, SSD SATA ODM, Foresee NVMe OEM 128/256GB, RAM second terkalibrasi & aset foto fisik real 100% PASS).

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

**Langkah C: Menjalankan Pengujian Otomatis (Test Suite)**
```bash
cd client
npm test         # Menjalankan 16/16 unit test bawaan Node.js
```

#### Matriks Pengujian Otomatis (Automated Unit Testing Matrix):
| Modul Pengujian | Kasus Uji (Test Case) | Ekspektasi | Hasil |
| :--- | :--- | :--- | :---: |
| **Cart & Pricing** | Base price calculation | Mengembalikan harga standar unit tanpa upgrade | ✅ PASS |
| **Cart & Pricing** | RAM & SSD Price Delta | Menghitung harga unit + variasi RAM/SSD dinamis | ✅ PASS |
| **Cart & Pricing** | Multi-item Subtotal | Akumulasi subtotal beberapa produk dengan kuantitas | ✅ PASS |
| **Shipping** | Cart Weight & Billable Kg | Konversi gramasi ke kilogram dengan pembulatan ke atas | ✅ PASS |
| **Shipping** | Floor minimum weight 1kg | Pembulatan berat minimal 1 kg untuk kurir ekspedisi | ✅ PASS |
| **Catalog** | Active products structure | Seluruh produk memiliki ID unik, nama, harga, dan gambar | ✅ PASS |
| **Catalog** | MacBook Air M1 Galleries | 3 Varian (Space Gray, Silver, Gold) memiliki galeri multi-sudut | ✅ PASS |
| **Catalog** | ASUS ZenBook 14 Galleries | 2 Varian (Aqua Celadon, Ponder Blue) memiliki galeri multi-sudut | ✅ PASS |
| **Catalog** | Laptop Hero Perspective | Foto utama katalog mempertahankan sudut pandang tegap 3/4 | ✅ PASS |
| **Catalog** | SATA SSD (RX7, KYO, V-GeN)| Kapasitas 128GB - 1TB dengan rentang harga pasar nyata | ✅ PASS |
| **Catalog** | Foresee OEM SSD 128/256GB | Verifikasi harga 128GB (350k) dan 256GB (625k) serta delta | ✅ PASS |
| **Pricing** | RAM Second 8GB - 32GB | Kalibrasi harga pasar Tokopedia/Shopee & Kingston 512k | ✅ PASS |
| **Catalog** | Authentic Photo Assets | Memastikan aset hardware berupa foto fisik asli (.jpg/.webp) | ✅ PASS |
| **Security** | Zero Third-Party Watermarks | Verifikasi tidak ada nama toko luar & seluruh file aset ada di disk | ✅ PASS |
| **Security** | Email regex validation | Validasi format email RFC standard & domain check | ✅ PASS |
| **Security** | Indonesian Phone sanitization | Validasi panjang nomor 9–15 digit dan prefix `08` / `+62` | ✅ PASS |
| **Security** | XSS sanitization | Pembersihan tag `<script>` dan pemotongan teks batas aman | ✅ PASS |
| **Security** | Password hashing & salt | Enkripsi salted SHA-256 dan verifikasi cocok/salah | ✅ PASS |

#### 📊 Hasil Riset Pasar Hardware Second & SSD SATA (Tokopedia & Shopee 2026):
1. **RAM Second & Gaming SODIMM (DDR4 Laptop & PC):**
   - **Kingston FURY Impact DDR4 (Official Benchmark kingston.com):** 8GB SODIMM (Rp 512.000 / Diskon coret Rp 620.000), 16GB (Rp 850.000), 32GB Kit (Rp 1.620.000).
   - **8GB DDR4 (Copotan OEM Samsung / Hynix):** Rp 195.000 – Rp 235.000 (diskon coret Rp 260.000 – Rp 310.000).
   - **16GB DDR4 (Samsung / SK Hynix / Corsair):** Rp 395.000 – Rp 445.000.
   - **32GB DDR4 (Kit 2x16GB / Single 32GB):** Rp 790.000 – Rp 880.000.
2. **SSD SATA 2.5" Internal (ODM vs Brand Resmi):**
   - **RX7 SATA III (ODM Value Budget):** 128GB (Rp 175rb), 256GB (Rp 285rb), 512GB (Rp 515rb), 1TB (Rp 1.095rb).
   - **KYO Kaizen SATA III (ODM Metal Casing):** 128GB (Rp 195rb), 256GB (Rp 320rb), 512GB (Rp 585rb), 1TB (Rp 1.180rb).
   - **V-GeN Platinum (Brand Terpercaya Garansi 3 Tahun):** 128GB (Rp 245rb), 256GB (Rp 390rb), 512GB (Rp 640rb), 1TB (Rp 1.080rb).
3. **SSD M.2 NVMe OEM Second Copotan Laptop (Foresee Longsys):**
   - **Foresee 128GB NVMe PCIe (Health 99-100%):** Rp 350.000 (diskon coret Rp 435.000).
   - **Foresee 256GB NVMe PCIe (Health 99-100%):** Rp 625.000 (diskon coret Rp 750.000).

#### 📸 Pembuktian Sumber Aset Foto Fisik Asli (Non-AI Generated & Zero Watermark):
| Nama Perangkat | Sumber Aset Fisik | Tipe Foto |
| :--- | :--- | :--- |
| **Foresee OEM M.2 NVMe SSD** | Dokumentasi unit copotan laptop OEM Lenovo/HP/ASUS (Shopee Verified) | Modul fisik depan M.2 2280 & foto close-up label part number |
| **Kingston FURY Impact**| Kingston Official Authorized Distributor CDN (`kingstonmemoryshop.co.uk`) | Foto resmi modul SODIMM hitam bersih tanpa watermark toko |
| **RX7 SATA III SSD** | Tokopedia & Shopee Partner Store (`aphluv / ACECOMPUTER`) | Unit fisik depan & retail box asli |
| **KYO Kaizen SATA SSD** | Shopee Indonesia Official Partner Listing | Casing metal gunmetal & retail blister pack |
| **V-GeN Platinum SSD** | Tokopedia V-GeN Official Partner & Shopee Listing | Bodi SSD platinum navy & kemasan retail box |
| **Samsung OEM SODIMM** | Dokumentasi modul RAM copotan laptop bisnis ThinkPad | Modul PCB hijau asli dengan stiker part number Samsung |
| **SK Hynix OEM SODIMM** | Dokumentasi modul RAM copotan laptop Dell Latitude | Modul PCB hijau asli dengan stiker part number SK Hynix |
| **Corsair Vengeance LPX**| Corsair Official Product Gallery CDN & studio photography | Heatsink aluminium anodized black |

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
