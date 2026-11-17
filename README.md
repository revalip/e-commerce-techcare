# TECHCARE — E-Commerce Retail IT & Perangkat Keras UMKM

Platform webapp e-commerce modern untuk **TECHCARE**, sebuah toko retail UMKM terpercaya yang bergerak di bidang penjualan perangkat teknologi informasi (IT), laptop performa tinggi, peripheral gaming/workstation, monitor, dan aksesoris komputer original dengan garansi resmi unit baru (ASUS, Logitech, Lenovo, Fantech, MSI).

Proyek ini dibangun dengan pendekatan *mobile-first*, estetika monokrom minimalis elegan, animasi mikro interaktif yang halus (*Framer Motion*), serta arsitektur multi-user berbasis peran (*Guest*, *Buyer*, dan *Admin*).

---

## 🚀 Fitur Unggulan

### 1. Pengalaman Belanja Terstruktur (Multiuser Role)
- **Guest (Tamu)**:
  - Menjelajahi katalog perangkat IT, pencarian *real-time*, dan filter kategori hardware (*Laptop & PC*, *Peripherals & Aksesoris*, *Monitor & Display*, *Komponen & Storage*).
  - Melihat detail spesifikasi teknis lengkap dari brand resmi.
  - Memasukkan produk ke keranjang belanja (*Cart Drawer*).
  - **Proteksi Checkout**: Sesuai alur bisnis UMKM, tamu wajib membuat akun atau masuk sebelum menyelesaikan transaksi checkout pesanan.
- **Buyer (Pembeli)**:
  - Pendaftaran akun buyer baru dengan nama, email, password, dan nomor WhatsApp.
  - Akses *Checkout Stepper* 3 tahap (Alamat Pengiriman → Pembayaran & Klaim Voucher Promo → Konfirmasi Pesanan).
  - Pelacakan riwayat pesanan dengan nomor invoice unik (*order tracking*).
- **Admin (Pengelola Toko)**:
  - **Dashboard Eksekutif**: Ringkasan metrik penjualan, total transaksi, inventaris produk aktif, dan status pemrosesan.
  - **Manajemen Produk IT**: Tambah perangkat baru, perbarui harga jual dan stok unit, serta hapus produk yang diskontinu.
  - **Manajemen Promo & Kupon**: Menerbitkan kode voucher diskon baru (tipe persentase atau nominal rupiah) dengan batasan kuota dan minimal belanja.
  - **Manajemen Pesanan**: Pembaruan status pesanan (*Menunggu Bayar → Diproses → Sedang Dikirim → Selesai*) serta penginputan nomor resi pengiriman kurir (JNE / SiCepat).

### 2. Metode Pembayaran Lokal (UMKM Friendly)
- **Transfer Bank**: Mendukung transfer langsung ke rekening bank lokal (BCA).
- **QRIS Instan**: Pembayaran mudah lewat pemindaian kode QRIS menggunakan seluruh aplikasi mobile banking atau e-Wallet Indonesia (GoPay, OVO, Dana, ShopeePay, BCA Mobile).

### 3. UI/UX & Animasi
- **Scroll Reveal**: Fade-in halus dan translasi vertikal dengan stagger antar kartu produk (*Framer Motion*).
- **Cart Drawer**: Tampilan geser dari sisi kanan di desktop dan *bottom sheet* di perangkat mobile.
- **Cart Toast**: Notifikasi interaktif saat barang ditambahkan ke keranjang belanja lengkap dengan tombol *Undo*.
- **Auto-Hide Sticky Navbar**: Navbar otomatis menyembunyikan diri saat pengguna menggulir ke bawah dan muncul kembali saat menggulir ke atas.
- **Desain Bersih**: Mengutamakan tipografi serif elegan, tata letak ruang putih (*whitespace*), dan bebas dari elemen visual yang tidak rapi.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animasi**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Auth**: React Context API (`AuthContext`, `CartContext`) dengan persistensi *Local Storage*.

### Backend (Server)
- **Runtime**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database**: [MySQL](https://www.mysql.com/) (menggunakan driver `mysql2/promise`)
- **Keamanan & Middleware**: CORS, Dotenv, Multer (upload bukti bayar).

### Deployment & Server
- **Platform**: Siap dideploy pada stack aaPanel / Ubuntu Server.
- **Process Manager**: PM2 (`ecosystem.config.js`).
- **Web Server & Reverse Proxy**: Nginx.

---

## 🔑 Akun Demo Pengujian

Aplikasi telah dilengkapi dengan akun demo bawaan untuk mempermudah peninjauan:

| Peran (Role) | Email | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@techcare.id` | `admin` *(atau `admin123`)* | Akses penuh ke Dashboard Admin, kelola produk, kupon, dan status order. |
| **Buyer (Demo)** | `buyer@techcare.id` | `buyer123` | Menjelajah, checkout produk, dan melihat riwayat belanja. |
| **Buyer Baru** | *Daftar mandiri* | *Password sendiri* | Siapapun dapat mendaftar langsung melalui tombol **"Masuk / Daftar"**. |

*(Tersedia tombol pintas **"Masuk Admin Demo"** dan **"Masuk Buyer Demo"** di dalam modal login untuk pengujian cepat 1-klik).*

---

## 📦 Struktur Proyek

```plaintext
e-commerce/
├── client/                     # Frontend React + Vite
│   ├── public/                 # Aset statis & logo
│   ├── src/
│   │   ├── components/         # Komponen UI (Navbar, Hero, CartDrawer, AuthModal, dll)
│   │   ├── context/            # Global state (AuthContext & CartContext)
│   │   ├── data/               # Katalog mock hardware IT & voucher promo
│   │   ├── pages/              # Halaman web (Home, Shop, Detail, Checkout, Admin, dll)
│   │   ├── services/           # Abstraksi API & data layer
│   │   └── utils/              # Formatter Rupiah & tanggal
│   ├── package.json
│   └── vite.config.js
├── server/                     # Backend Express API & Database
│   ├── scripts/                # Database seeder (techcare.sql)
│   ├── src/                    # Controller, model & router
│   ├── package.json
│   └── ecosystem.config.js     # Konfigurasi PM2
├── database/                   # Skema SQL awal
├── nginx/                      # Konfigurasi vhost reverse proxy
├── start-dev.bat               # Skrip 1-klik Windows untuk menjalankan Frontend & Backend
└── README.md                   # Dokumentasi proyek
```

---

## 💻 Panduan Menjalankan Secara Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) (versi 18 ke atas)
- [MySQL](https://dev.mysql.com/downloads/) (atau via XAMPP / Laragon / aaPanel)

### 1. Menjalankan Cepat (Windows)
Cukup jalankan file batch di root direktori proyek:
```powershell
.\start-dev.bat
```
Skrip ini akan memastikan database siap, menyalakan backend Express di port `4000`, dan membuka frontend Vite di port `5173`.

### 2. Menjalankan Manual

**Langkah A: Menyiapkan Backend**
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
