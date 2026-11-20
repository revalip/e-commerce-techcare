import React, { useState, useEffect, useMemo } from 'react';
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
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Truck,
  MapPin,
  AlertTriangle,
  Users,
  FolderKanban,
  Search,
  Eye,
  UserPlus
} from 'lucide-react';
import {
  getProducts,
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
  getOrders,
  getDiscounts,
  createDiscount,
  toggleDiscountStatus,
  updateOrderStatus,
  verifyOrderPayment,
  createProduct,
  updateProduct,
  deleteProduct
} from '../../services/api';
import { formatIDR, formatDate, formatWeight, getStatusBadge } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';
import Reveal from '../../components/Reveal';

const IMAGE_PRESETS = [
  { label: 'Laptop ThinkPad X1 Carbon', value: '/images/products/thinkpad-x1-carbon-front.jpg' },
  { label: 'Laptop MacBook Air M1', value: '/images/products/macbook-air-m1.jpg' },
  { label: 'Laptop ASUS ZenBook 14', value: '/images/products/asus-zenbook-14-oled.jpg' },
  { label: 'Laptop Dell Latitude 7420', value: '/images/products/dell-latitude-7420.jpg' },
  { label: 'RAM Desktop Corsair Vengeance', value: '/images/products/corsair-vengeance-ram.jpg' },
  { label: 'RAM Laptop Kingston FURY SODIMM', value: '/images/products/kingston-fury-sodimm-ram.jpg' },
  { label: 'SSD Samsung 990 PRO NVMe', value: '/images/products/samsung-990-pro-heatsink.png' },
  { label: 'Monitor LG UltraGear 27" IPS', value: '/images/products/lg-ultragear-27-ips.jpg' },
  { label: 'Monitor MSI MAG 34" Curved', value: '/images/products/msi-mag-341cqp-qd-oled.webp' },
  { label: 'Mouse Logitech MX Master 3S', value: '/images/products/logitech-mx-master-3s-graphite.png' },
  { label: 'Keyboard Fantech MAXFIT81', value: '/images/products/fantech-maxfit81-frost.webp' },
  { label: 'Keyboard ASUS ROG Azoth', value: '/images/products/asus-rog-azoth-2.png' }
];

export default function AdminDashboard({ onBackToShop }) {
  const { user, logout, getUsers, updateUserRole, toggleUserActive, createUserByAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'categories' | 'discounts' | 'users'

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  // Orders Filter & Proof Lightbox
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [previewProofModal, setPreviewProofModal] = useState(null);

  // Discount Modal State
  const [showAddDiscountModal, setShowAddDiscountModal] = useState(false);
  const [kodeDiskon, setKodeDiskon] = useState('');
  const [namaDiskon, setNamaDiskon] = useState('');
  const [tipeDiskon, setTipeDiskon] = useState('persen');
  const [nilaiDiskon, setNilaiDiskon] = useState('');
  const [minBelanja, setMinBelanja] = useState('300000');
  const [kuotaDiskon, setKuotaDiskon] = useState('50');
  const [submittingDiscount, setSubmittingDiscount] = useState(false);

  // Add Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('LENOVO');
  const [newProdKondisi, setNewProdKondisi] = useState('Grade A+ • Mulus 96%');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Laptop Second');
  const [newProdStock, setNewProdStock] = useState('5');
  const [newProdWeight, setNewProdWeight] = useState('1800');
  const [newProdImagePreset, setNewProdImagePreset] = useState(IMAGE_PRESETS[0].value);
  const [newProdDeskripsi, setNewProdDeskripsi] = useState('');
  const [submittingProduct, setSubmittingProduct] = useState(false);

  // Edit Product Modal State (Lengkap)
  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState('');
  const [editBrand, setEditBrand] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editKondisi, setEditKondisi] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [editDeskripsi, setEditDeskripsi] = useState('');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catName, setCatName] = useState('');
  const [catTagline, setCatTagline] = useState('');
  const [catImage, setCatImage] = useState(IMAGE_PRESETS[0].value);
  const [submittingCat, setSubmittingCat] = useState(false);

  // Add User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState('buyer');
  const [userFormError, setUserFormError] = useState('');

  // Tracking Update Modal State
  const [trackingModalOrder, setTrackingModalOrder] = useState(null);
  const [trackStatusKey, setTrackStatusKey] = useState('processing');
  const [trackResi, setTrackResi] = useState('');
  const [trackLocation, setTrackLocation] = useState('');
  const [trackNote, setTrackNote] = useState('');
  const [submittingTrack, setSubmittingTrack] = useState(false);

  const showToast = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3800);
  };

  const loadData = async () => {
    setLoading(true);
    const [ordRes, prodRes, colRes, discRes, usrRes] = await Promise.all([
      getOrders(),
      getProducts(),
      getCollections(),
      getDiscounts(),
      getUsers()
    ]);
    if (ordRes.success) setOrders(ordRes.data);
    if (prodRes.success) setProducts(prodRes.data);
    if (colRes.success) setCollections(colRes.data);
    if (discRes.success) setDiscounts(discRes.data);
    if (usrRes.success) setUsersList(usrRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Metrics
  const totalOmzet = useMemo(
    () =>
      orders
        .filter((o) => o.statusKey !== 'cancelled')
        .reduce((acc, o) => acc + (Number(o.total) || 0), 0),
    [orders]
  );
  const awaitingCount = useMemo(
    () => orders.filter((o) => o.paymentStatus === 'awaiting_verification').length,
    [orders]
  );
  const lowStockProducts = useMemo(
    () => products.filter((p) => Number(p.stok) <= 5).sort((a, b) => Number(a.stok) - Number(b.stok)),
    [products]
  );
  const activeDiscountsCount = useMemo(() => discounts.filter((d) => d.aktif).length, [discounts]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus =
        orderStatusFilter === 'all'
          ? true
          : orderStatusFilter === 'awaiting_verification'
          ? o.paymentStatus === 'awaiting_verification'
          : o.statusKey === orderStatusFilter;
      if (!matchStatus) return false;

      const q = orderSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        o.nomorPesanan.toLowerCase().includes(q) ||
        (o.customer?.nama || '').toLowerCase().includes(q) ||
        (o.customer?.email || '').toLowerCase().includes(q) ||
        (o.resi && o.resi.toLowerCase().includes(q))
      );
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // === Handlers ===
  const handleCreateDiscount = async (e) => {
    e.preventDefault();
    if (!kodeDiskon.trim() || !nilaiDiskon) return;
    setSubmittingDiscount(true);
    const res = await createDiscount({
      kode: kodeDiskon,
      nama: namaDiskon || `Diskon ${kodeDiskon.toUpperCase()}`,
      tipe: tipeDiskon,
      nilai: nilaiDiskon,
      minBelanja,
      kuota: kuotaDiskon
    });
    setSubmittingDiscount(false);
    if (res.success) {
      setShowAddDiscountModal(false);
      setKodeDiskon('');
      setNamaDiskon('');
      setNilaiDiskon('');
      showToast(`Kupon "${res.data.kode}" berhasil dibuat!`);
      loadData();
    } else {
      alert(res.error);
    }
  };

  const handleToggleDiscount = async (id) => {
    await toggleDiscountStatus(id);
    loadData();
  };

  const handleVerifyPayment = async (orderId, action) => {
    await verifyOrderPayment(orderId, action);
    showToast(
      action === 'approve'
        ? 'Pembayaran disetujui! Status pesanan kini DIBAYAR.'
        : 'Bukti pembayaran ditolak, pembeli diminta unggah ulang.'
    );
    loadData();
  };

  const handleOpenTrackingModal = (ord) => {
    setTrackingModalOrder(ord);
    const nextSuggested =
      ord.statusKey === 'pending' || ord.statusKey === 'awaiting_verification'
        ? 'paid'
        : ord.statusKey === 'paid'
        ? 'processing'
        : ord.statusKey === 'processing'
        ? 'shipped'
        : ord.statusKey || 'shipped';
    setTrackStatusKey(nextSuggested);
    setTrackResi(ord.resi || '');
    setTrackLocation('Workshop TECHCARE Jakarta');
    setTrackNote('');
  };

  const handleSaveTracking = async (e) => {
    e.preventDefault();
    if (!trackingModalOrder) return;
    setSubmittingTrack(true);
    await updateOrderStatus(
      trackingModalOrder.id,
      trackStatusKey,
      trackResi.trim() || null,
      trackNote.trim() || null,
      trackLocation.trim() || null
    );
    setSubmittingTrack(false);
    setTrackingModalOrder(null);
    showToast(`Status & tracking #${trackingModalOrder.nomorPesanan} diperbarui!`);
    loadData();
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;
    if (Number(newProdPrice) >= 10000000) {
      alert('Sesuai kebijakan TECHCARE, harga produk second harus di bawah Rp 10.000.000.');
      return;
    }
    setSubmittingProduct(true);
    const res = await createProduct({
      nama: newProdName.trim(),
      brand: newProdBrand,
      kondisi: newProdKondisi,
      tagline: `${newProdBrand} SECOND • ${newProdKondisi.toUpperCase()}`,
      harga: newProdPrice,
      hargaCoret: newProdOriginalPrice ? Number(newProdOriginalPrice) : null,
      koleksi: newProdCategory,
      stok: newProdStock,
      beratGram: newProdWeight,
      gambar: newProdImagePreset,
      deskripsi: newProdDeskripsi.trim()
    });
    setSubmittingProduct(false);
    if (res.success) {
      setShowAddProductModal(false);
      setNewProdName('');
      setNewProdPrice('');
      setNewProdOriginalPrice('');
      setNewProdDeskripsi('');
      showToast(`Produk "${res.data.nama}" berhasil ditambahkan!`);
      loadData();
    } else {
      alert(res.error);
    }
  };

  const openEditProduct = (p) => {
    setEditingProduct(p);
    setEditName(p.nama || '');
    setEditBrand(p.brand || '');
    setEditCategory(p.koleksi || collections[0]?.nama || 'Laptop Second');
    setEditKondisi(p.kondisi || 'Grade A • Mulus 95%');
    setEditPrice(String(p.harga || ''));
    setEditStock(String(p.stok ?? 0));
    setEditWeight(String(p.beratGram || 1000));
    setEditDeskripsi(p.deskripsi || '');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (Number(editPrice) >= 10000000) {
      alert('Harga produk second harus di bawah Rp 10.000.000.');
      return;
    }
    setSubmittingEdit(true);
    await updateProduct(editingProduct.id, {
      nama: editName,
      brand: editBrand,
      koleksi: editCategory,
      kondisi: editKondisi,
      harga: editPrice,
      stok: editStock,
      beratGram: editWeight,
      deskripsi: editDeskripsi
    });
    setSubmittingEdit(false);
    setEditingProduct(null);
    showToast(`Produk "${editName}" berhasil diperbarui!`);
    loadData();
  };

  const handleDeleteProduct = async (id, nama) => {
    if (window.confirm(`Hapus produk "${nama}" dari katalog?`)) {
      await deleteProduct(id);
      showToast(`Produk "${nama}" dihapus.`);
      loadData();
    }
  };

  // === Category CRUD Handlers ===
  const openAddCategory = () => {
    setEditingCategory(null);
    setCatName('');
    setCatTagline('');
    setCatImage(IMAGE_PRESETS[0].value);
    setShowCategoryModal(true);
  };

  const openEditCategory = (col) => {
    setEditingCategory(col);
    setCatName(col.nama || '');
    setCatTagline(col.tagline || '');
    setCatImage(col.gambar || IMAGE_PRESETS[0].value);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;
    setSubmittingCat(true);
    const res = editingCategory
      ? await updateCollection(editingCategory.id, { nama: catName, tagline: catTagline, gambar: catImage })
      : await createCollection({ nama: catName, tagline: catTagline, gambar: catImage });
    setSubmittingCat(false);
    if (res.success) {
      setShowCategoryModal(false);
      showToast(editingCategory ? 'Kategori diperbarui!' : 'Kategori baru ditambahkan!');
      loadData();
    } else {
      alert(res.error);
    }
  };

  const handleDeleteCategory = async (col) => {
    if (window.confirm(`Hapus kategori "${col.nama}"?`)) {
      await deleteCollection(col.id);
      showToast(`Kategori "${col.nama}" dihapus.`);
      loadData();
    }
  };

  // === Users CRUD Handlers ===
  const handleChangeUserRole = async (usr) => {
    const targetRole = usr.role === 'admin' ? 'buyer' : 'admin';
    if (!window.confirm(`Ubah role "${usr.name}" menjadi ${targetRole.toUpperCase()}?`)) return;
    const res = await updateUserRole(usr.id, targetRole);
    if (res.success) {
      showToast(`Role ${usr.name} diubah menjadi ${targetRole.toUpperCase()}.`);
      loadData();
    } else {
      alert(res.error);
    }
  };

  const handleToggleUserActive = async (usr) => {
    const res = await toggleUserActive(usr.id);
    if (res.success) {
      showToast(`Status akun ${usr.name} diperbarui.`);
      loadData();
    } else {
      alert(res.error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserFormError('');
    const res = await createUserByAdmin({
      name: newUserName,
      email: newUserEmail,
      password: newUserPass,
      phone: newUserPhone,
      role: newUserRole
    });
    if (res.success) {
      setShowAddUserModal(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPass('');
      setNewUserPhone('');
      setNewUserRole('buyer');
      showToast(`Pengguna "${res.data.name}" berhasil ditambahkan!`);
      loadData();
    } else {
      setUserFormError(res.error);
    }
  };

  return (
    <div className="bg-[#f9f9f8] min-h-screen py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-200">
            <div>
              <div className="flex items-center space-x-2 mb-1 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-[0.22em] text-neutral-400">
                  ADMIN PORTAL • TECHCARE
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 text-white text-[9px] font-bold uppercase">
                  {user?.name || 'Admin'}
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl text-neutral-900 tracking-tight">
                Dashboard Pengelolaan Toko
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                className="p-2.5 rounded-full bg-white border border-neutral-200 hover:border-black text-neutral-700"
                title="Refresh Data"
                aria-label="Refresh Data"
              >
                <RefreshCw size={15} />
              </button>
              <button
                onClick={onBackToShop}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full bg-white border border-neutral-300 hover:border-black text-neutral-900 text-xs font-bold uppercase tracking-wider"
              >
                <ArrowLeft size={14} />
                <span>Toko</span>
              </button>
              <button
                onClick={logout}
                className="p-2.5 rounded-full bg-white border border-neutral-200 hover:border-red-500 hover:text-red-600 text-neutral-500"
                title="Keluar"
                aria-label="Keluar Admin"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Feedback Banner */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-neutral-900 text-white px-5 py-3.5 rounded-2xl text-xs font-medium flex items-center gap-2 shadow-md"
            >
              <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
              <span>{feedback}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
              Total Omzet
            </span>
            <p className="font-serif text-lg sm:text-2xl font-bold text-neutral-900 mt-1 truncate">
              {formatIDR(totalOmzet)}
            </p>
            <span className="text-[11px] text-neutral-500">{orders.length} pesanan masuk</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveTab('orders');
              setOrderStatusFilter('awaiting_verification');
            }}
            className="text-left bg-white hover:border-amber-400 rounded-3xl p-4 sm:p-5 border border-neutral-200/70 transition-colors"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
              Verifikasi Bayar
            </span>
            <p className="font-serif text-lg sm:text-2xl font-bold text-amber-600 mt-1">
              {awaitingCount} Pesanan
            </p>
            <span className="text-[11px] text-neutral-500">Klik untuk cek bukti →</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className="text-left bg-white hover:border-rose-400 rounded-3xl p-4 sm:p-5 border border-neutral-200/70 transition-colors"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
              <AlertTriangle size={11} className={lowStockProducts.length > 0 ? 'text-rose-500' : 'text-neutral-400'} />
              Stok Menipis (≤ 5)
            </span>
            <p
              className={`font-serif text-lg sm:text-2xl font-bold mt-1 ${
                lowStockProducts.length > 0 ? 'text-rose-600' : 'text-emerald-700'
              }`}
            >
              {lowStockProducts.length} Produk
            </p>
            <span className="text-[11px] text-neutral-500">dari {products.length} unit katalog</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className="text-left bg-white hover:border-neutral-900 rounded-3xl p-4 sm:p-5 border border-neutral-200/70 transition-colors"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
              Pengguna &amp; Promo
            </span>
            <p className="font-serif text-lg sm:text-2xl font-bold text-neutral-900 mt-1">
              {usersList.length} Akun
            </p>
            <span className="text-[11px] text-neutral-500">{activeDiscountsCount} kupon promo aktif</span>
          </button>
        </div>

        {/* Low Stock Alert Strip */}
        {lowStockProducts.length > 0 && (
          <div className="bg-amber-50/90 border border-amber-200 rounded-3xl p-4 sm:p-5 space-y-2.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <AlertTriangle size={15} className="text-amber-700" />
                <span>Peringatan Stok Menipis ({lowStockProducts.length} produk)</span>
              </div>
              <span className="text-[11px] text-amber-800">Klik produk untuk langsung restok</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {lowStockProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => openEditProduct(p)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-amber-200 hover:border-black text-xs text-neutral-900 transition-colors"
                >
                  <span className="font-semibold truncate max-w-[180px]">{p.nama}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      Number(p.stok) === 0 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Sisa {p.stok}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { key: 'orders', label: `Pesanan (${orders.length})`, icon: Package },
            { key: 'products', label: `Produk (${products.length})`, icon: ShoppingBag },
            { key: 'categories', label: `Kategori (${collections.length})`, icon: FolderKanban },
            { key: 'discounts', label: `Kupon (${discounts.length})`, icon: Tag },
            { key: 'users', label: `Pengguna (${usersList.length})`, icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 min-h-[40px] rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:border-black hover:text-black'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ORDERS, PAYMENT VERIFICATION & RESI */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-4 sm:p-8 border border-neutral-200/70 shadow-xs space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
              <div>
                <h3 className="font-serif text-xl text-neutral-900">
                  Manajemen Pesanan, Pembayaran &amp; Resi
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Periksa bukti transfer/QRIS, verifikasi pembayaran, dan input resi pengiriman kurir.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3.5 top-3 text-neutral-400" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Cari invoice, pembeli, resi..."
                    className="w-full sm:w-56 pl-9 pr-3 py-2 bg-[#f5f5f4] rounded-full text-xs outline-none border border-transparent focus:border-black focus:bg-white"
                  />
                </div>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3.5 py-2 bg-[#f5f5f4] rounded-full text-xs font-semibold outline-none border border-neutral-200 cursor-pointer"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu Bayar</option>
                  <option value="awaiting_verification">Perlu Verifikasi Bukti</option>
                  <option value="paid">Dibayar</option>
                  <option value="processing">Dikemas &amp; QC</option>
                  <option value="shipped">Dikirim</option>
                  <option value="completed">Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>
            </div>

            {loading ? (
              <p className="text-xs text-neutral-400 py-10 text-center">Memuat data pesanan...</p>
            ) : filteredOrders.length === 0 ? (
              <p className="text-xs text-neutral-500 py-10 text-center">
                Tidak ada pesanan yang cocok dengan filter saat ini.
              </p>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord) => {
                  const badge = getStatusBadge(ord.statusKey || ord.paymentStatus);
                  return (
                    <div
                      key={ord.id}
                      className="p-4 sm:p-5 rounded-2xl border border-neutral-200/80 hover:border-neutral-400 transition-colors space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm font-bold text-neutral-900">
                            #{ord.nomorPesanan}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${badge.bg}`}
                          >
                            {ord.status || badge.label}
                          </span>
                          <span className="text-[11px] text-neutral-400">
                            {formatDate(ord.tanggal)}
                          </span>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-sm font-bold text-neutral-900">
                            {formatIDR(ord.total)}
                          </span>
                          {ord.uniqueCode > 0 && (
                            <span className="block text-[10px] font-mono text-neutral-500">
                              Kode unik +{ord.uniqueCode} • {ord.metodeBayar}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-neutral-400">Pembeli</p>
                          <p className="font-semibold text-neutral-900">{ord.customer?.nama}</p>
                          <p className="text-[11px] text-neutral-500">
                            {ord.customer?.kota} • {ord.customer?.telepon}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase font-bold text-neutral-400">Unit &amp; Spec</p>
                          {(ord.items || []).map((it, idx) => (
                            <p key={idx} className="text-neutral-800">
                              <strong>{it.nama}</strong> ({it.jumlah}x)
                              {it.specLabel && (
                                <span className="block text-[10px] text-neutral-500">{it.specLabel}</span>
                              )}
                            </p>
                          ))}
                        </div>

                        <div>
                          <p className="text-[10px] uppercase font-bold text-neutral-400">Ekspedisi &amp; Resi</p>
                          <p className="text-neutral-800">{ord.kurir || 'JNE Reguler'}</p>
                          <p className="font-mono text-[11px] text-neutral-600">
                            Resi: {ord.resi || <span className="italic text-neutral-400">Belum diinput</span>}
                          </p>
                        </div>
                      </div>

                      {/* Preview Bukti Pembayaran (bila pembeli sudah upload) */}
                      {ord.paymentProofUrl && (
                        <div className="p-3 rounded-2xl bg-[#f8f8f7] border border-neutral-200 flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={ord.paymentProofUrl}
                              alt="Bukti bayar"
                              className="w-12 h-12 rounded-xl object-cover bg-white border border-neutral-200 shrink-0"
                            />
                            <div className="min-w-0 text-xs">
                              <p className="font-bold text-neutral-900">Bukti Pembayaran Terlampir</p>
                              <p className="text-[11px] text-neutral-500 truncate">
                                {ord.paymentNotes || 'Siap diperiksa oleh admin.'}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPreviewProofModal(ord)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-neutral-300 hover:border-black text-[11px] font-bold text-neutral-800"
                          >
                            <Eye size={13} />
                            <span>Lihat Bukti</span>
                          </button>
                        </div>
                      )}

                      {/* Admin Action Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-neutral-100">
                        <div className="flex flex-wrap items-center gap-2">
                          {ord.paymentStatus === 'awaiting_verification' && (
                            <>
                              <button
                                onClick={() => handleVerifyPayment(ord.id, 'approve')}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold uppercase"
                              >
                                <CheckCircle2 size={13} />
                                <span>Setujui Bayar</span>
                              </button>
                              <button
                                onClick={() => handleVerifyPayment(ord.id, 'reject')}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold uppercase"
                              >
                                <XCircle size={13} />
                                <span>Tolak Bukti</span>
                              </button>
                            </>
                          )}
                        </div>

                        <button
                          onClick={() => handleOpenTrackingModal(ord)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black text-white hover:bg-neutral-800 text-[11px] font-bold uppercase tracking-wider"
                        >
                          <Truck size={13} />
                          <span>Update Status &amp; Resi</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS CRUD */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-4 sm:p-8 border border-neutral-200/70 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
              <div>
                <h3 className="font-serif text-xl text-neutral-900">Inventaris Perangkat IT</h3>
                <p className="text-xs text-neutral-500">
                  Tambah, ubah detail lengkap (harga, stok, berat, kategori), atau hapus produk katalog.
                </p>
              </div>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider"
              >
                <Plus size={14} />
                <span>Tambah Produk</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[640px]">
                <thead>
                  <tr className="border-b border-neutral-100 text-neutral-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Produk</th>
                    <th className="pb-3">Kategori</th>
                    <th className="pb-3">Berat</th>
                    <th className="pb-3">Harga</th>
                    <th className="pb-3">Stok</th>
                    <th className="pb-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50/70">
                      <td className="py-3.5 pr-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.gambar?.[0]}
                            alt={p.nama}
                            className="w-11 h-11 rounded-xl bg-[#f4f4f5] object-contain p-1 border border-neutral-200/70 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-neutral-900">{p.nama}</p>
                            <p className="text-[10px] text-neutral-400">
                              {p.brand} • {p.kondisi || 'Grade A'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-neutral-600">{p.koleksi}</td>
                      <td className="py-3.5 text-neutral-600">{formatWeight(p.beratGram || 1000)}</td>
                      <td className="py-3.5 font-bold text-neutral-900">{formatIDR(p.harga)}</td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            Number(p.stok) === 0
                              ? 'bg-rose-100 text-rose-700'
                              : Number(p.stok) <= 5
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {p.stok} unit
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditProduct(p)}
                            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-black"
                            title="Edit Produk"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.nama)}
                            className="p-2 rounded-full hover:bg-rose-50 text-neutral-400 hover:text-rose-600"
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

        {/* TAB 3: CATEGORIES CRUD */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-3xl p-4 sm:p-8 border border-neutral-200/70 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
              <div>
                <h3 className="font-serif text-xl text-neutral-900">Manajemen Kategori Produk</h3>
                <p className="text-xs text-neutral-500">
                  Kelola kategori katalog yang tampil di halaman utama dan filter pencarian.
                </p>
              </div>
              <button
                onClick={openAddCategory}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider"
              >
                <Plus size={14} />
                <span>Tambah Kategori</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map((col) => {
                const count = products.filter((p) => p.koleksiSlug === col.slug).length;
                return (
                  <div
                    key={col.id}
                    className="p-4 rounded-2xl border border-neutral-200 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <img
                        src={col.gambar}
                        alt={col.nama}
                        className="w-12 h-12 rounded-xl bg-[#f4f4f5] p-1.5 object-contain border border-neutral-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-neutral-900 truncate">{col.nama}</p>
                        <p className="text-[10px] font-mono text-neutral-400">/{col.slug}</p>
                        <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1">{col.tagline}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-700">
                          {count} produk
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => openEditCategory(col)}
                        className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-black"
                        title="Edit Kategori"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(col)}
                        className="p-1.5 rounded-full hover:bg-rose-50 text-neutral-400 hover:text-rose-600"
                        title="Hapus Kategori"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: DISCOUNTS */}
        {activeTab === 'discounts' && (
          <div className="bg-white rounded-3xl p-4 sm:p-8 border border-neutral-200/70 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
              <div>
                <h3 className="font-serif text-xl text-neutral-900">Kupon &amp; Voucher Promo</h3>
                <p className="text-xs text-neutral-500">Buat kode potongan untuk laptop second, RAM, dan SSD.</p>
              </div>
              <button
                onClick={() => setShowAddDiscountModal(true)}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider"
              >
                <Plus size={14} />
                <span>Buat Kupon</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[580px]">
                <thead>
                  <tr className="border-b border-neutral-100 text-neutral-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Kode</th>
                    <th className="pb-3">Promo</th>
                    <th className="pb-3">Potongan</th>
                    <th className="pb-3">Min. Belanja</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {discounts.map((d) => (
                    <tr key={d.id}>
                      <td className="py-3.5 font-mono font-bold text-neutral-900">{d.kode}</td>
                      <td className="py-3.5 text-neutral-700">{d.nama}</td>
                      <td className="py-3.5 font-bold text-neutral-900">
                        {d.tipe === 'persen' ? `${d.nilai}%` : formatIDR(d.nilai)}
                      </td>
                      <td className="py-3.5 text-neutral-600">{formatIDR(d.minBelanja)}</td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            d.aktif ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-400'
                          }`}
                        >
                          {d.aktif ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleToggleDiscount(d.id)}
                          className="text-[11px] font-semibold text-neutral-600 hover:text-black underline"
                        >
                          {d.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: USERS & ROLE MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl p-4 sm:p-8 border border-neutral-200/70 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
              <div>
                <h3 className="font-serif text-xl text-neutral-900">Manajemen Pengguna &amp; Role</h3>
                <p className="text-xs text-neutral-500">
                  Kelola hak akses Admin &amp; Buyer, status aktif akun, atau tambah akun tim baru.
                </p>
              </div>
              <button
                onClick={() => {
                  setUserFormError('');
                  setShowAddUserModal(true);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider"
              >
                <UserPlus size={14} />
                <span>Tambah Pengguna</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[600px]">
                <thead>
                  <tr className="border-b border-neutral-100 text-neutral-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Nama &amp; Email</th>
                    <th className="pb-3">WhatsApp</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {usersList.map((u) => {
                    const isSelf = user && String(user.id) === String(u.id);
                    return (
                      <tr key={u.id} className="hover:bg-neutral-50/70">
                        <td className="py-3.5 pr-3">
                          <p className="font-bold text-neutral-900">
                            {u.name} {isSelf && <span className="text-[10px] text-neutral-400">(Anda)</span>}
                          </p>
                          <p className="text-[11px] text-neutral-500">{u.email}</p>
                        </td>
                        <td className="py-3.5 text-neutral-600">{u.phone || '-'}</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              u.role === 'admin'
                                ? 'bg-neutral-900 text-white'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              u.isActive !== false
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {u.isActive !== false ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          {isSelf ? (
                            <span className="text-[11px] text-neutral-400 italic">Sesi aktif</span>
                          ) : (
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => handleChangeUserRole(u)}
                                className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-black hover:text-white text-[11px] font-semibold transition-colors"
                              >
                                Jadikan {u.role === 'admin' ? 'Buyer' : 'Admin'}
                              </button>
                              <button
                                onClick={() => handleToggleUserActive(u)}
                                className="text-[11px] font-semibold text-neutral-500 hover:text-rose-600 underline"
                              >
                                {u.isActive !== false ? 'Nonaktifkan' : 'Aktifkan'}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL: PREVIEW BUKTI BAYAR */}
        <AnimatePresence>
          {previewProofModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setPreviewProofModal(null)}
                className="absolute inset-0 bg-black/70 backdrop-blur-xs"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="font-serif text-lg text-neutral-900">
                    Bukti Bayar #{previewProofModal.nomorPesanan}
                  </h3>
                  <button
                    onClick={() => setPreviewProofModal(null)}
                    aria-label="Tutup preview bukti pembayaran"
                    className="p-1.5 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="bg-[#f8f8f7] rounded-2xl p-3 border border-neutral-200 text-center">
                  <img
                    src={previewProofModal.paymentProofUrl}
                    alt="Bukti Pembayaran"
                    className="max-h-72 mx-auto rounded-xl object-contain"
                  />
                </div>
                <div className="text-xs text-neutral-600 space-y-1">
                  <p>
                    <strong>Total Tagihan:</strong> {formatIDR(previewProofModal.total)}
                  </p>
                  <p>
                    <strong>Metode:</strong> {previewProofModal.metodeBayar}
                  </p>
                  {previewProofModal.paymentNotes && (
                    <p>
                      <strong>Catatan Pembeli:</strong> {previewProofModal.paymentNotes}
                    </p>
                  )}
                </div>
                {previewProofModal.paymentStatus === 'awaiting_verification' && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        handleVerifyPayment(previewProofModal.id, 'approve');
                        setPreviewProofModal(null);
                      }}
                      className="flex-1 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase"
                    >
                      Setujui Bayar
                    </button>
                    <button
                      onClick={() => {
                        handleVerifyPayment(previewProofModal.id, 'reject');
                        setPreviewProofModal(null);
                      }}
                      className="flex-1 py-3 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold uppercase"
                    >
                      Tolak Bukti
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: UPDATE STATUS, RESI & TRACKING LOG */}
        <AnimatePresence>
          {trackingModalOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setTrackingModalOrder(null)}
                className="fixed inset-0 bg-black/45 backdrop-blur-xs"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4 my-8"
              >
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <h3 className="font-serif text-lg text-neutral-900">
                      Update Status #{trackingModalOrder.nomorPesanan}
                    </h3>
                  </div>
                  <button
                    onClick={() => setTrackingModalOrder(null)}
                    className="p-1 text-neutral-400 hover:text-black"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveTracking} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Tahap Status Pesanan
                    </label>
                    <select
                      value={trackStatusKey}
                      onChange={(e) => setTrackStatusKey(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                    >
                      <option value="pending">Menunggu Bayar</option>
                      <option value="awaiting_verification">Menunggu Verifikasi Admin</option>
                      <option value="paid">Dibayar (Lunas)</option>
                      <option value="processing">Dikemas &amp; QC Teknisi (32 Titik)</option>
                      <option value="shipped">Dikirim Kurir</option>
                      <option value="completed">Selesai</option>
                      <option value="cancelled">Dibatalkan (Kembalikan Stok)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Nomor Resi Ekspedisi (JNE / J&amp;T / SiCepat)
                    </label>
                    <input
                      type="text"
                      value={trackResi}
                      onChange={(e) => setTrackResi(e.target.value)}
                      placeholder="Contoh: JNE8827162519ID / JP1234567890"
                      className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl font-mono outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Lokasi Checkpoint
                    </label>
                    <input
                      type="text"
                      value={trackLocation}
                      onChange={(e) => setTrackLocation(e.target.value)}
                      placeholder="Contoh: Jakarta Barat (Workshop TECHCARE)"
                      className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Catatan Aktivitas / Kurir (Opsional)
                    </label>
                    <textarea
                      rows={2}
                      value={trackNote}
                      onChange={(e) => setTrackNote(e.target.value)}
                      placeholder="Misal: QC selesai & paket di-pickup J&T Express."
                      className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingTrack}
                    className="w-full py-3 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider"
                  >
                    {submittingTrack ? 'Menyimpan...' : 'Simpan & Perbarui Tracking'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: ADD PRODUCT */}
        <AnimatePresence>
          {showAddProductModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddProductModal(false)}
                className="fixed inset-0 bg-black/45 backdrop-blur-xs"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl z-10 space-y-4 my-8"
              >
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="font-serif text-lg text-neutral-900">Tambah Produk IT (&lt; 10 Juta)</h3>
                  <button
                    onClick={() => setShowAddProductModal(false)}
                    className="p-1 text-neutral-400 hover:text-black"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                        Nama Produk *
                      </label>
                      <input
                        type="text"
                        required
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        placeholder="ThinkPad T14 / RAM 16GB"
                        className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                        Brand
                      </label>
                      <input
                        type="text"
                        value={newProdBrand}
                        onChange={(e) => setNewProdBrand(e.target.value)}
                        placeholder="ASUS / LENOVO / MSI / LOGITECH"
                        className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                        Kategori
                      </label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none"
                      >
                        {collections.map((c) => (
                          <option key={c.id} value={c.nama}>
                            {c.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                        Kondisi / Grade
                      </label>
                      <input
                        type="text"
                        value={newProdKondisi}
                        onChange={(e) => setNewProdKondisi(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                        Harga (Rp) *
                      </label>
                      <input
                        type="number"
                        required
                        min={1000}
                        max={9999999}
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        placeholder="4500000"
                        className="w-full px-3 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                        Harga Coret
                      </label>
                      <input
                        type="number"
                        value={newProdOriginalPrice}
                        onChange={(e) => setNewProdOriginalPrice(e.target.value)}
                        placeholder="5800000"
                        className="w-full px-3 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                        Stok
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                        Berat (g)
                      </label>
                      <input
                        type="number"
                        min={50}
                        value={newProdWeight}
                        onChange={(e) => setNewProdWeight(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                      Pilih Foto Produk
                    </label>
                    <select
                      value={newProdImagePreset}
                      onChange={(e) => setNewProdImagePreset(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none"
                    >
                      {IMAGE_PRESETS.map((img) => (
                        <option key={img.value} value={img.value}>
                          {img.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                      Deskripsi &amp; Catatan QC
                    </label>
                    <textarea
                      rows={2}
                      value={newProdDeskripsi}
                      onChange={(e) => setNewProdDeskripsi(e.target.value)}
                      placeholder="Kondisi mulus, baterai sehat, sudah repasta..."
                      className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingProduct}
                    className="w-full py-3 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider"
                  >
                    {submittingProduct ? 'Menyimpan...' : 'Simpan ke Katalog'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: EDIT PRODUCT (LENGKAP) */}
        <AnimatePresence>
          {editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setEditingProduct(null)}
                className="fixed inset-0 bg-black/45 backdrop-blur-xs"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl z-10 space-y-4 my-8"
              >
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="font-serif text-lg text-neutral-900">Edit Produk Lengkap</h3>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="p-1 text-neutral-400 hover:text-black"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                        Nama Produk
                      </label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                        Brand
                      </label>
                      <input
                        type="text"
                        value={editBrand}
                        onChange={(e) => setEditBrand(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                        Kategori
                      </label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none"
                      >
                        {collections.map((c) => (
                          <option key={c.id} value={c.nama}>
                            {c.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                        Kondisi
                      </label>
                      <input
                        type="text"
                        value={editKondisi}
                        onChange={(e) => setEditKondisi(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                        Harga (Rp)
                      </label>
                      <input
                        type="number"
                        min={1000}
                        max={9999999}
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                        Stok Unit
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                        Berat (g)
                      </label>
                      <input
                        type="number"
                        min={50}
                        value={editWeight}
                        onChange={(e) => setEditWeight(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                      Deskripsi
                    </label>
                    <textarea
                      rows={2}
                      value={editDeskripsi}
                      onChange={(e) => setEditDeskripsi(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingEdit}
                    className="w-full py-3 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <Check size={14} />
                    <span>{submittingEdit ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: ADD / EDIT CATEGORY */}
        <AnimatePresence>
          {showCategoryModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCategoryModal(false)}
                className="absolute inset-0 bg-black/45 backdrop-blur-xs"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="font-serif text-lg text-neutral-900">
                    {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                  </h3>
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    className="p-1 text-neutral-400 hover:text-black"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                      Nama Kategori *
                    </label>
                    <input
                      type="text"
                      required
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      placeholder="Mis. Networking & Router"
                      className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                      Tagline Singkat
                    </label>
                    <input
                      type="text"
                      value={catTagline}
                      onChange={(e) => setCatTagline(e.target.value)}
                      placeholder="Perangkat jaringan dan router kantor"
                      className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                      Ikon / Foto Kategori
                    </label>
                    <select
                      value={catImage}
                      onChange={(e) => setCatImage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none"
                    >
                      {IMAGE_PRESETS.map((img) => (
                        <option key={img.value} value={img.value}>
                          {img.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={submittingCat}
                    className="w-full py-3 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider"
                  >
                    {submittingCat ? 'Menyimpan...' : 'Simpan Kategori'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: ADD DISCOUNT */}
        <AnimatePresence>
          {showAddDiscountModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddDiscountModal(false)}
                className="absolute inset-0 bg-black/45 backdrop-blur-xs"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="font-serif text-lg text-neutral-900">Buat Kupon Promo</h3>
                  <button
                    onClick={() => setShowAddDiscountModal(false)}
                    className="p-1 text-neutral-400 hover:text-black"
                  >
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleCreateDiscount} className="space-y-3 text-xs">
                  <input
                    type="text"
                    required
                    placeholder="Kode Kupon (mis. SECOND100K)"
                    value={kodeDiskon}
                    onChange={(e) => setKodeDiskon(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl font-mono uppercase outline-none focus:border-black"
                  />
                  <input
                    type="text"
                    placeholder="Nama Promo"
                    value={namaDiskon}
                    onChange={(e) => setNamaDiskon(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={tipeDiskon}
                      onChange={(e) => setTipeDiskon(e.target.value)}
                      className="px-3 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none"
                    >
                      <option value="persen">Persen (%)</option>
                      <option value="nominal">Nominal (Rp)</option>
                    </select>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="Nilai (10 / 50000)"
                      value={nilaiDiskon}
                      onChange={(e) => setNilaiDiskon(e.target.value)}
                      className="px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      min={0}
                      placeholder="Min. Belanja"
                      value={minBelanja}
                      onChange={(e) => setMinBelanja(e.target.value)}
                      className="px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                    />
                    <input
                      type="number"
                      min={1}
                      placeholder="Kuota"
                      value={kuotaDiskon}
                      onChange={(e) => setKuotaDiskon(e.target.value)}
                      className="px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingDiscount}
                    className="w-full py-3 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider"
                  >
                    {submittingDiscount ? 'Menyimpan...' : 'Aktifkan Kupon'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: ADD USER BY ADMIN */}
        <AnimatePresence>
          {showAddUserModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddUserModal(false)}
                className="absolute inset-0 bg-black/45 backdrop-blur-xs"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="font-serif text-lg text-neutral-900">Tambah Pengguna Baru</h3>
                  <button
                    onClick={() => setShowAddUserModal(false)}
                    className="p-1 text-neutral-400 hover:text-black"
                  >
                    <X size={18} />
                  </button>
                </div>

                {userFormError && (
                  <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs">{userFormError}</div>
                )}

                <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap *"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email *"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                  />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Password (min. 6 karakter) *"
                    value={newUserPass}
                    onChange={(e) => setNewUserPass(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="tel"
                      placeholder="No. WhatsApp"
                      value={newUserPhone}
                      onChange={(e) => setNewUserPhone(e.target.value)}
                      className="px-3.5 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none focus:border-black"
                    />
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="px-3 py-2.5 bg-[#f8f8f7] border border-neutral-200 rounded-xl outline-none"
                    >
                      <option value="buyer">Role: Buyer</option>
                      <option value="admin">Role: Admin</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider"
                  >
                    Simpan Pengguna
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
