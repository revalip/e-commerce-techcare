import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Tag,
  RefreshCw,
  X,
  Package,
  ShoppingBag,
  Trash2,
  Edit3,
  Check,
  ShieldCheck,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import {
  getProducts,
  getOrders,
  getDiscounts,
  createDiscount,
  toggleDiscountStatus,
  updateOrderStatus,
  createProduct,
  updateProduct,
  deleteProduct
} from '../../services/api';
import { formatIDR, formatDate } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';
import Reveal from '../../components/Reveal';

export default function AdminDashboard({ onBackToShop }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'discounts'

  // Data States
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  // Discount Form State
  const [showAddDiscountModal, setShowAddDiscountModal] = useState(false);
  const [kodeDiskon, setKodeDiskon] = useState('');
  const [namaDiskon, setNamaDiskon] = useState('');
  const [tipeDiskon, setTipeDiskon] = useState('persen'); // 'persen' | 'nominal'
  const [nilaiDiskon, setNilaiDiskon] = useState('');
  const [minBelanja, setMinBelanja] = useState('500000');
  const [kuotaDiskon, setKuotaDiskon] = useState('50');
  const [submittingDiscount, setSubmittingDiscount] = useState(false);

  // Product Create Form State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('ASUS');
  const [newProdTagline, setNewProdTagline] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Laptop & PC');
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdImagePreset, setNewProdImagePreset] = useState('/images/products/laptop.svg');
  const [newProdCustomImage, setNewProdCustomImage] = useState('');
  const [newProdDeskripsi, setNewProdDeskripsi] = useState('');
  const [submittingProduct, setSubmittingProduct] = useState(false);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Load all dashboard data
  const loadData = async () => {
    setLoading(true);
    const [ordRes, prodRes, discRes] = await Promise.all([
      getOrders(),
      getProducts(),
      getDiscounts()
    ]);
    if (ordRes.success) setOrders(ordRes.data);
    if (prodRes.success) setProducts(prodRes.data);
    if (discRes.success) setDiscounts(discRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handler: Create Discount
  const handleCreateDiscount = async (e) => {
    e.preventDefault();
    if (!kodeDiskon.trim() || !nilaiDiskon) return;

    setSubmittingDiscount(true);
    const res = await createDiscount({
      kode: kodeDiskon,
      nama: namaDiskon || `Diskon ${kodeDiskon.toUpperCase()}`,
      tipe: tipeDiskon,
      nilai: nilaiDiskon,
      minBelanja: minBelanja,
      kuota: kuotaDiskon
    });

    setSubmittingDiscount(false);
    if (res.success) {
      setFeedback(`Kupon diskon "${res.data.kode}" berhasil dibuat!`);
      setShowAddDiscountModal(false);
      setKodeDiskon('');
      setNamaDiskon('');
      setNilaiDiskon('');
      loadData();
      setTimeout(() => setFeedback(''), 3500);
    }
  };

  // Handler: Toggle Discount Status
  const handleToggleDiscount = async (id) => {
    await toggleDiscountStatus(id);
    loadData();
  };

  // Handler: Update Order Status
  const handleUpdateStatus = async (orderId, newStatusKey) => {
    await updateOrderStatus(orderId, newStatusKey);
    loadData();
  };

  // Handler: Create IT Product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;

    setSubmittingProduct(true);
    const imageToUse = newProdCustomImage.trim() || newProdImagePreset;

    const res = await createProduct({
      nama: newProdName.trim(),
      brand: newProdBrand,
      tagline: newProdTagline.trim() || `${newProdBrand} OFFICIAL HARDWARE`,
      harga: newProdPrice,
      hargaCoret: newProdOriginalPrice ? Number(newProdOriginalPrice) : null,
      koleksi: newProdCategory,
      stok: newProdStock,
      gambar: imageToUse,
      deskripsi: newProdDeskripsi.trim()
    });

    setSubmittingProduct(false);
    if (res.success) {
      setShowAddProductModal(false);
      setNewProdName('');
      setNewProdTagline('');
      setNewProdPrice('');
      setNewProdOriginalPrice('');
      setNewProdDeskripsi('');
      setNewProdCustomImage('');
      setFeedback(`Produk "${res.data.nama}" berhasil ditambahkan ke katalog!`);
      loadData();
      setTimeout(() => setFeedback(''), 3500);
    }
  };

  // Handler: Open Edit Product
  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setEditPrice(p.harga);
    setEditStock(p.stok);
  };

  // Handler: Save Edit Product
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSubmittingEdit(true);
    await updateProduct(editingProduct.id, {
      harga: editPrice,
      stok: editStock
    });
    setSubmittingEdit(false);
    setEditingProduct(null);
    setFeedback(`Perubahan produk "${editingProduct.nama}" berhasil disimpan!`);
    loadData();
    setTimeout(() => setFeedback(''), 3500);
  };

  // Handler: Delete Product
  const handleDeleteProduct = async (id, nama) => {
    if (window.confirm(`Yakin ingin menghapus produk "${nama}" dari katalog?`)) {
      await deleteProduct(id);
      setFeedback(`Produk "${nama}" telah dihapus.`);
      loadData();
      setTimeout(() => setFeedback(''), 3500);
    }
  };

  // Metrics
  const totalOmzet = orders.reduce((acc, o) => acc + o.total, 0);
  const activeDiscountsCount = discounts.filter((d) => d.aktif).length;

  return (
    <div className="bg-[#fcfcfd] min-h-screen py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* Top Header - CLEAN LUXURY MINIMALIST */}
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-neutral-200">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-neutral-400">
                  ADMIN PORTAL • TECHCARE IT STORE
                </span>
                <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-[9px] font-bold uppercase tracking-wider text-neutral-700">
                  {user?.name || 'Administrator'}
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 tracking-tight">
                Dashboard Pengelolaan Toko
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={loadData}
                className="p-2.5 rounded-full border border-neutral-200 hover:bg-neutral-100 text-neutral-700 transition-colors"
                title="Perbarui Data"
              >
                <RefreshCw size={15} />
              </button>

              <button
                onClick={onBackToShop}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full border border-neutral-300 hover:border-black text-neutral-900 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Lihat Katalog Toko</span>
              </button>

              <button
                onClick={logout}
                className="p-2.5 rounded-full border border-neutral-200 hover:border-red-500 hover:text-red-600 text-neutral-500 transition-colors"
                title="Keluar dari Admin"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Feedback Alert Banner */}
        {feedback && (
          <div className="p-3.5 bg-neutral-900 text-white rounded-2xl text-xs font-medium tracking-wide flex items-center justify-between shadow-sm">
            <span>{feedback}</span>
            <button onClick={() => setFeedback('')} className="p-1 hover:text-neutral-400">
              <X size={14} />
            </button>
          </div>
        )}

        {/* 4 Clean Metric Cards (NO UGLY CHECKMARK ICONS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-100 shadow-xs space-y-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 block">
              Total Penjualan
            </span>
            <p className="font-serif text-2xl sm:text-3xl font-medium text-neutral-900">
              {formatIDR(totalOmzet)}
            </p>
            <span className="text-[11px] text-neutral-500 font-medium">Dari {orders.length} transaksi</span>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-100 shadow-xs space-y-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 block">
              Total Produk Aktif
            </span>
            <p className="font-serif text-2xl sm:text-3xl font-medium text-neutral-900">
              {products.length} Unit
            </p>
            <span className="text-[11px] text-neutral-500 font-medium">ASUS, Logitech, Lenovo, dll</span>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-100 shadow-xs space-y-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 block">
              Pesanan Diproses
            </span>
            <p className="font-serif text-2xl sm:text-3xl font-medium text-neutral-900">
              {orders.filter((o) => o.statusKey === 'processing').length} Pesanan
            </p>
            <span className="text-[11px] text-neutral-500 font-medium">Perlu pengemasan & resi</span>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-100 shadow-xs space-y-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 block">
              Voucher Promo Aktif
            </span>
            <p className="font-serif text-2xl sm:text-3xl font-medium text-neutral-900">
              {activeDiscountsCount} Kupon
            </p>
            <span className="text-[11px] text-neutral-500 font-medium">Siap digunakan pembeli</span>
          </div>
        </div>

        {/* Modern Tabs Navigation */}
        <div className="flex border-b border-neutral-200 space-x-8 text-xs font-semibold tracking-wider uppercase">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'products' ? 'text-black font-bold' : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Katalog Produk ({products.length})
            {activeTab === 'products' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'orders' ? 'text-black font-bold' : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Pesanan Masuk ({orders.length})
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('discounts')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'discounts' ? 'text-black font-bold' : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Kelola Kupon Diskon ({discounts.length})
            {activeTab === 'discounts' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
            )}
          </button>
        </div>

        {/* TAB 1: KELOLA PRODUK IT */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-4xl p-6 sm:p-9 border border-neutral-100 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
              <div>
                <h3 className="font-serif text-xl font-medium text-neutral-900">
                  Inventaris Perangkat IT TECHCARE
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Admin dapat menambah perangkat baru, mengubah stok & harga, serta menghapus produk.
                </p>
              </div>

              <button
                onClick={() => setShowAddProductModal(true)}
                className="inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                <Plus size={14} />
                <span>Tambah Produk IT</span>
              </button>
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 text-neutral-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Produk</th>
                    <th className="pb-3 font-semibold">Brand / Tagline</th>
                    <th className="pb-3 font-semibold">Kategori</th>
                    <th className="pb-3 font-semibold">Harga Jual</th>
                    <th className="pb-3 font-semibold">Stok</th>
                    <th className="pb-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-[#fafafa] rounded-2xl border border-neutral-100 flex items-center justify-center p-1 shrink-0">
                            <img
                              src={p.gambar && p.gambar[0] ? p.gambar[0] : '/images/products/laptop.svg'}
                              alt={p.nama}
                              className="max-h-full object-contain"
                            />
                          </div>
                          <div>
                            <span className="font-serif text-sm font-semibold text-neutral-900 block">
                              {p.nama}
                            </span>
                            <span className="text-[10px] text-neutral-400">ID: {p.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-neutral-100 text-[10px] font-bold uppercase tracking-wider text-neutral-800 mb-0.5">
                          {p.brand || 'TECHCARE'}
                        </span>
                        <span className="block text-[10px] text-neutral-500 truncate max-w-[180px]">
                          {p.tagline}
                        </span>
                      </td>

                      <td className="py-4 text-neutral-700">
                        {p.koleksi}
                      </td>

                      <td className="py-4 font-bold text-neutral-900">
                        {formatIDR(p.harga)}
                        {p.hargaCoret && (
                          <span className="block text-[10px] text-neutral-400 line-through font-normal">
                            {formatIDR(p.hargaCoret)}
                          </span>
                        )}
                      </td>

                      <td className="py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.stok > 0 ? 'bg-neutral-100 text-neutral-800' : 'bg-red-50 text-red-600'
                        }`}>
                          {p.stok} unit
                        </span>
                      </td>

                      <td className="py-4 text-right">
                        <div className="inline-flex items-center space-x-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-black transition-colors"
                            title="Edit Harga & Stok"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.nama)}
                            className="p-1.5 rounded-full hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors"
                            title="Hapus Produk"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PESANAN MASUK */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-4xl p-6 sm:p-9 border border-neutral-100 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h3 className="font-serif text-xl font-medium text-neutral-900">
                Riwayat Pesanan Pelanggan
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Kelola status pemrosesan barang dan update nomor resi pengiriman.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 text-neutral-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">No. Pesanan</th>
                    <th className="pb-3 font-semibold">Pembeli</th>
                    <th className="pb-3 font-semibold">Produk</th>
                    <th className="pb-3 font-semibold">Total</th>
                    <th className="pb-3 font-semibold">Status Pengiriman</th>
                    <th className="pb-3 font-semibold">No. Resi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-4 font-mono font-bold text-neutral-900">
                        #{ord.nomorPesanan}
                        <span className="block text-[10px] text-neutral-400 font-normal">
                          {formatDate(ord.tanggal)}
                        </span>
                      </td>

                      <td className="py-4">
                        <span className="font-semibold text-neutral-900 block">{ord.customer?.nama}</span>
                        <span className="text-[10px] text-neutral-500">{ord.customer?.kota}</span>
                      </td>

                      <td className="py-4">
                        <span className="text-neutral-800">
                          {ord.items.map((i) => `${i.nama} (${i.jumlah}x)`).join(', ')}
                        </span>
                        {ord.kodeDiskon && (
                          <span className="block text-[10px] text-neutral-500">
                            Kupon: {ord.kodeDiskon} (-{formatIDR(ord.diskon)})
                          </span>
                        )}
                      </td>

                      <td className="py-4 font-bold text-neutral-900">
                        {formatIDR(ord.total)}
                      </td>

                      <td className="py-4">
                        <select
                          value={ord.statusKey || 'processing'}
                          onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                          className="bg-neutral-100 text-neutral-900 text-xs font-semibold py-1 px-3 rounded-full outline-none border border-neutral-200 cursor-pointer"
                        >
                          <option value="pending">Menunggu Bayar</option>
                          <option value="processing">Diproses</option>
                          <option value="shipped">Sedang Dikirim</option>
                          <option value="completed">Selesai</option>
                          <option value="cancelled">Dibatalkan</option>
                        </select>
                      </td>

                      <td className="py-4 font-mono text-[11px] text-neutral-600">
                        {ord.resi || (
                          <button
                            onClick={() => {
                              const r = prompt('Masukkan Nomor Resi Kurir (JNE / SiCepat):');
                              if (r) updateOrderStatus(ord.id, 'shipped', r).then(loadData);
                            }}
                            className="text-neutral-500 hover:text-black underline"
                          >
                            + Input Resi
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: KELOLA DISKON & KUPON */}
        {activeTab === 'discounts' && (
          <div className="bg-white rounded-4xl p-6 sm:p-9 border border-neutral-100 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
              <div>
                <h3 className="font-serif text-xl font-medium text-neutral-900">
                  Daftar Kupon & Diskon Aktif
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Buat kode promo baru untuk pembeli saat checkout.
                </p>
              </div>

              <button
                onClick={() => setShowAddDiscountModal(true)}
                className="inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                <Plus size={14} />
                <span>Buat Diskon Baru</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 text-neutral-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Kode Voucher</th>
                    <th className="pb-3 font-semibold">Nama Promo</th>
                    <th className="pb-3 font-semibold">Potongan</th>
                    <th className="pb-3 font-semibold">Min. Belanja</th>
                    <th className="pb-3 font-semibold">Pemakaian</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {discounts.map((disc) => (
                    <tr key={disc.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-4 font-mono font-bold text-neutral-900">
                        {disc.kode}
                      </td>
                      <td className="py-4 font-medium text-neutral-900">
                        {disc.nama}
                      </td>
                      <td className="py-4 font-bold text-neutral-900">
                        {disc.tipe === 'persen' ? `${disc.nilai}%` : formatIDR(disc.nilai)}
                        {disc.maksDiskon && (
                          <span className="block text-[10px] text-neutral-400 font-normal">
                            Maks {formatIDR(disc.maksDiskon)}
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-neutral-600">
                        {formatIDR(disc.minBelanja)}
                      </td>
                      <td className="py-4 text-neutral-600">
                        {disc.terpakai} / {disc.kuota}
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            disc.aktif
                              ? 'bg-neutral-900 text-white'
                              : 'bg-neutral-100 text-neutral-400'
                          }`}
                        >
                          {disc.aktif ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleToggleDiscount(disc.id)}
                          className="text-[11px] font-semibold text-neutral-600 hover:text-black underline"
                        >
                          {disc.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL: FORM BUAT DISKON BARU */}
        <AnimatePresence>
          {showAddDiscountModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowAddDiscountModal(false)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-white rounded-4xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-neutral-100 z-10 space-y-5"
              >
                <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Tag size={16} />
                    <h3 className="font-serif text-lg font-medium text-neutral-900">
                      Buat Kupon Diskon Baru
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowAddDiscountModal(false)}
                    className="p-1 rounded-full text-neutral-400 hover:text-black"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleCreateDiscount} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Kode Kupon Promo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: TECHCARE15"
                      value={kodeDiskon}
                      onChange={(e) => setKodeDiskon(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#f9f9fb] border border-neutral-200 rounded-2xl font-mono uppercase text-xs outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Nama / Keterangan Promo
                    </label>
                    <input
                      type="text"
                      placeholder="Promo Akhir Pekan IT Hardware"
                      value={namaDiskon}
                      onChange={(e) => setNamaDiskon(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#f9f9fb] border border-neutral-200 rounded-2xl text-xs outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Tipe Diskon
                      </label>
                      <select
                        value={tipeDiskon}
                        onChange={(e) => setTipeDiskon(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#f9f9fb] border border-neutral-200 rounded-2xl text-xs outline-none"
                      >
                        <option value="persen">Persentase (%)</option>
                        <option value="nominal">Nominal Rupiah (Rp)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Nilai Diskon *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder={tipeDiskon === 'persen' ? 'Contoh: 15' : 'Contoh: 250000'}
                        value={nilaiDiskon}
                        onChange={(e) => setNilaiDiskon(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#f9f9fb] border border-neutral-200 rounded-2xl text-xs outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Min. Belanja (Rp)
                      </label>
                      <input
                        type="number"
                        value={minBelanja}
                        onChange={(e) => setMinBelanja(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#f9f9fb] border border-neutral-200 rounded-2xl text-xs outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Kuota Kupon
                      </label>
                      <input
                        type="number"
                        value={kuotaDiskon}
                        onChange={(e) => setKuotaDiskon(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#f9f9fb] border border-neutral-200 rounded-2xl text-xs outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingDiscount}
                    className="w-full mt-2 bg-black text-white py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-all disabled:opacity-50"
                  >
                    {submittingDiscount ? 'Menyimpan...' : 'Terbitkan Kupon Diskon'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: TAMBAH PRODUK IT BARU */}
        <AnimatePresence>
          {showAddProductModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowAddProductModal(false)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-4xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                  <h3 className="font-serif text-lg font-medium text-neutral-900">
                    Tambah Perangkat IT ke Katalog
                  </h3>
                  <button onClick={() => setShowAddProductModal(false)} className="p-1 text-neutral-400 hover:text-black">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Nama Perangkat IT *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: ASUS TUF Gaming A15 FA507"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#f9f9fb] border border-neutral-200 rounded-2xl outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Brand Manufaktur *
                      </label>
                      <select
                        value={newProdBrand}
                        onChange={(e) => setNewProdBrand(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#f9f9fb] border border-neutral-200 rounded-2xl outline-none"
                      >
                        <option value="ASUS">ASUS</option>
                        <option value="Logitech">Logitech</option>
                        <option value="Lenovo">Lenovo</option>
                        <option value="Fantech">Fantech</option>
                        <option value="MSI">MSI</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Kategori *
                      </label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => {
                          setNewProdCategory(e.target.value);
                          if (e.target.value === 'Laptop & PC') setNewProdImagePreset('/images/products/laptop.svg');
                          else if (e.target.value === 'Monitor & Display') setNewProdImagePreset('/images/products/monitor.svg');
                          else if (e.target.value === 'Komponen & Storage') setNewProdImagePreset('/images/products/keyboard.svg');
                          else setNewProdImagePreset('/images/products/mouse.svg');
                        }}
                        className="w-full px-3 py-2.5 bg-[#f9f9fb] border border-neutral-200 rounded-2xl outline-none"
                      >
                        <option value="Laptop & PC">Laptop & PC</option>
                        <option value="Peripherals & Aksesoris">Peripherals & Aksesoris</option>
                        <option value="Monitor & Display">Monitor & Display</option>
                        <option value="Komponen & Storage">Komponen & Storage</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Tagline / Spesifikasi Utama
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: AMD Ryzen 7 7735HS • RTX 4060 8GB"
                      value={newProdTagline}
                      onChange={(e) => setNewProdTagline(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#f9f9fb] border border-neutral-200 rounded-2xl outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Harga Jual (Rp) *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="18499000"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#f9f9fb] border border-neutral-200 rounded-2xl outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Stok Unit *
                      </label>
                      <input
                        type="number"
                        required
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#f9f9fb] border border-neutral-200 rounded-2xl outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Deskripsi Produk Singkat
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Perangkat IT dengan performa handal dan garansi resmi unit baru."
                      value={newProdDeskripsi}
                      onChange={(e) => setNewProdDeskripsi(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#f9f9fb] border border-neutral-200 rounded-2xl outline-none focus:border-black text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingProduct}
                    className="w-full mt-2 bg-black text-white py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50"
                  >
                    {submittingProduct ? 'Menyimpan...' : 'Simpan Produk IT ke Katalog'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: EDIT HARGA & STOK PRODUK */}
        <AnimatePresence>
          {editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setEditingProduct(null)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-4xl max-w-sm w-full p-6 sm:p-8 shadow-2xl z-10 space-y-4"
              >
                <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                  <div>
                    <h3 className="font-serif text-base font-semibold text-neutral-900">
                      Ubah Harga & Stok
                    </h3>
                    <p className="text-[11px] text-neutral-500 truncate max-w-[220px]">
                      {editingProduct.nama}
                    </p>
                  </div>
                  <button onClick={() => setEditingProduct(null)} className="p-1 text-neutral-400 hover:text-black">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Harga Jual (Rp)
                    </label>
                    <input
                      type="number"
                      required
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#f9f9fb] border border-neutral-200 rounded-2xl outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Jumlah Stok Unit
                    </label>
                    <input
                      type="number"
                      required
                      value={editStock}
                      onChange={(e) => setEditStock(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#f9f9fb] border border-neutral-200 rounded-2xl outline-none focus:border-black"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingEdit}
                    className="w-full bg-black text-white py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50"
                  >
                    {submittingEdit ? 'Menyimpan...' : 'Perbarui Produk'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
