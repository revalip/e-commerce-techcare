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
  UserPlus,
  BarChart3,
  TrendingUp,
  Clock
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
  const [activeTab, setActiveTab] = useState('orders');

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [previewProofModal, setPreviewProofModal] = useState(null);

  const [showAddDiscountModal, setShowAddDiscountModal] = useState(false);
  const [kodeDiskon, setKodeDiskon] = useState('');
  const [namaDiskon, setNamaDiskon] = useState('');
  const [tipeDiskon, setTipeDiskon] = useState('persen');
  const [nilaiDiskon, setNilaiDiskon] = useState('');
  const [minBelanja, setMinBelanja] = useState('300000');
  const [kuotaDiskon, setKuotaDiskon] = useState('50');
  const [submittingDiscount, setSubmittingDiscount] = useState(false);

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

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catName, setCatName] = useState('');
  const [catTagline, setCatTagline] = useState('');
  const [catImage, setCatImage] = useState(IMAGE_PRESETS[0].value);
  const [submittingCat, setSubmittingCat] = useState(false);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState('buyer');
  const [userFormError, setUserFormError] = useState('');

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

  // Escape key closes open modals cleanly
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key !== 'Escape') return;
      setPreviewProofModal(null);
      setTrackingModalOrder(null);
      setShowAddProductModal(false);
      setEditingProduct(null);
      setShowCategoryModal(false);
      setShowAddDiscountModal(false);
      setShowAddUserModal(false);
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  // === Metrics & Chart Data (Omzet hanya menghitung pesanan lunas & tidak dibatalkan) ===
  const totalOmzet = useMemo(
    () =>
      orders
        .filter((o) => o.statusKey !== 'cancelled' && o.paymentStatus === 'paid')
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

  // Grafik 1: Distribusi Status Pesanan (Apple palette)
  const orderStatusChart = useMemo(() => {
    const buckets = [
      { key: 'pending', label: 'Menunggu Bayar', color: 'bg-[#B64400]', count: 0 },
      { key: 'awaiting_verification', label: 'Verifikasi', color: 'bg-[#0071E3]', count: 0 },
      { key: 'paid', label: 'Dibayar', color: 'bg-[#0071E3]', count: 0 },
      { key: 'processing', label: 'Dikemas & QC', color: 'bg-[#424245]', count: 0 },
      { key: 'shipped', label: 'Dikirim', color: 'bg-[#1D1D1F]', count: 0 },
      { key: 'completed', label: 'Selesai', color: 'bg-[#1D7F3E]', count: 0 },
      { key: 'cancelled', label: 'Dibatalkan', color: 'bg-[#D70015]', count: 0 }
    ];
    orders.forEach((o) => {
      const target = buckets.find((b) => b.key === (o.statusKey || 'pending'));
      if (target) target.count += 1;
    });
    const maxCount = Math.max(1, ...buckets.map((b) => b.count));
    return buckets.map((b) => ({ ...b, pct: Math.round((b.count / maxCount) * 100) }));
  }, [orders]);

  // Grafik 2: Stok & Produk per Kategori
  const categoryStockChart = useMemo(() => {
    const rows = collections.map((c) => {
      const matching = products.filter((p) => p.koleksiSlug === c.slug);
      const totalStock = matching.reduce((sum, p) => sum + (Number(p.stok) || 0), 0);
      return { name: c.nama, count: matching.length, stock: totalStock };
    });
    const maxStock = Math.max(1, ...rows.map((r) => r.stock));
    return rows.map((r) => ({ ...r, pct: Math.round((r.stock / maxStock) * 100) }));
  }, [collections, products]);

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

  // === Action Handlers ===
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
    const priceNum = Number(newProdPrice);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      alert('Harga produk harus lebih dari Rp 0.');
      return;
    }
    if (priceNum >= 10000000) {
      alert('Sesuai kebijakan TECHCARE, harga produk second harus di bawah Rp 10.000.000.');
      return;
    }
    if (newProdOriginalPrice && Number(newProdOriginalPrice) <= priceNum) {
      alert('Harga coret harus lebih besar dari harga jual.');
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
    const priceNum = Number(editPrice);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      alert('Harga produk harus lebih dari Rp 0.');
      return;
    }
    if (priceNum >= 10000000) {
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

  const getAppleStatusDot = (statusKey) => {
    switch (statusKey) {
      case 'completed':
        return { dot: 'bg-[#1D7F3E]', text: 'text-[#1D7F3E]' };
      case 'shipped':
      case 'processing':
      case 'paid':
        return { dot: 'bg-[#0071E3]', text: 'text-[#0071E3]' };
      case 'cancelled':
        return { dot: 'bg-[#D70015]', text: 'text-[#D70015]' };
      default:
        return { dot: 'bg-[#B64400]', text: 'text-[#B64400]' };
    }
  };

  const totalInventoryUnits = products.reduce((s, p) => s + (Number(p.stok) || 0), 0);
  const activeStatusSegments = orderStatusChart.filter((r) => r.count > 0);
  const totalStatusCount = Math.max(1, orders.length);

  return (
    <div className="bg-[#F5F5F7] text-[#1D1D1F] py-7 sm:py-10 pb-16">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 space-y-6">
        {/* 1. Compact App Store Connect Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[34px] font-semibold tracking-[-0.03em] leading-tight text-[#1D1D1F]">
              Admin
            </h1>
            <p className="text-[13px] text-[#6E6E73] mt-0.5">
              TechCare · {user?.name || 'Administrator'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={loadData}
              className="h-[38px] w-[38px] rounded-[980px] bg-white hover:bg-[#EFEFF2] text-[#1D1D1F] shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.06] inline-flex items-center justify-center transition-colors cursor-pointer"
              title="Muat ulang data"
              aria-label="Refresh Data"
            >
              <RefreshCw size={15} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={onBackToShop}
              className="h-[38px] px-4 rounded-[980px] bg-white hover:bg-[#EFEFF2] text-[#1D1D1F] shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.06] text-[13px] font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} strokeWidth={1.8} />
              <span>Lihat Toko</span>
            </button>
            <button
              type="button"
              onClick={logout}
              className="h-[38px] px-4 rounded-[980px] bg-white hover:bg-[#D70015] text-[#D70015] hover:text-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.06] text-[13px] font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Keluar"
              aria-label="Keluar Admin"
            >
              <LogOut size={14} strokeWidth={1.8} />
              <span>Keluar</span>
            </button>
          </div>
        </header>

        {/* Feedback Toast */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-[#1D1D1F] text-white px-5 py-3.5 rounded-[16px] text-[13px] flex items-center gap-2.5"
            >
              <ShieldCheck size={16} className="text-[#30D158] shrink-0" />
              <span>{feedback}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. Single Unified 4-Metric Hairline Strip (App Store Connect style — zero scattered AI icon boxes) */}
        <section className="bg-white rounded-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.05] grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#E5E5EA] overflow-hidden">
          <div className="p-5 sm:p-6 space-y-1">
            <span className="text-[12px] font-medium text-[#6E6E73] block">Omzet Lunas</span>
            <p className="text-[20px] sm:text-[24px] font-semibold tracking-[-0.02em] text-[#1D1D1F] truncate tabular-nums">
              {formatIDR(totalOmzet)}
            </p>
            <span className="text-[12px] text-[#86868B] block">{orders.length} pesanan masuk</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveTab('orders');
              setOrderStatusFilter('awaiting_verification');
            }}
            className="text-left p-5 sm:p-6 space-y-1 hover:bg-[#FAFAFC] transition-colors cursor-pointer border-l border-[#E5E5EA] lg:border-l-0"
          >
            <span className="text-[12px] font-medium text-[#6E6E73] block">Perlu Verifikasi</span>
            <p className="text-[20px] sm:text-[24px] font-semibold tracking-[-0.02em] text-[#0071E3] tabular-nums">
              {awaitingCount}
            </p>
            <span className="text-[12px] text-[#0071E3] block">Periksa bukti ›</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className="text-left p-5 sm:p-6 space-y-1 hover:bg-[#FAFAFC] transition-colors cursor-pointer"
          >
            <span className="text-[12px] font-medium text-[#6E6E73] block">Stok Menipis</span>
            <p
              className={`text-[20px] sm:text-[24px] font-semibold tracking-[-0.02em] tabular-nums ${
                lowStockProducts.length > 0 ? 'text-[#D70015]' : 'text-[#1D7F3E]'
              }`}
            >
              {lowStockProducts.length}
            </p>
            <span className="text-[12px] text-[#86868B] block">≤ 5 unit tersisa</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className="text-left p-5 sm:p-6 space-y-1 hover:bg-[#FAFAFC] transition-colors cursor-pointer border-l border-[#E5E5EA] lg:border-l-0"
          >
            <span className="text-[12px] font-medium text-[#6E6E73] block">Inventaris &amp; Akun</span>
            <p className="text-[20px] sm:text-[24px] font-semibold tracking-[-0.02em] text-[#1D1D1F] tabular-nums">
              {totalInventoryUnits} unit
            </p>
            <span className="text-[12px] text-[#86868B] block">
              {products.length} SKU · {usersList.length} akun · {activeDiscountsCount} promo
            </span>
          </button>
        </section>

        {/* 3. Compact Insights Row: macOS Storage-Style Order Bar + Compact Low-Stock Action List */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: macOS Storage-Style Single Stacked Distribution Bar */}
          <div className="lg:col-span-7 bg-white rounded-[20px] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.05] flex flex-col justify-between gap-4">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-[15px] font-semibold text-[#1D1D1F]">Status Pesanan &amp; Stok</h2>
              <span className="text-[12px] text-[#86868B] tabular-nums">{orders.length} transaksi</span>
            </div>

            <div className="space-y-2.5">
              <div className="h-[10px] w-full bg-[#F5F5F7] rounded-full overflow-hidden flex gap-[2px]">
                {activeStatusSegments.map((seg) => (
                  <div
                    key={seg.key}
                    className={`h-full first:rounded-l-full last:rounded-r-full ${seg.color}`}
                    style={{ width: `${Math.max(6, Math.round((seg.count / totalStatusCount) * 100))}%` }}
                    title={`${seg.label}: ${seg.count}`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#6E6E73]">
                {activeStatusSegments.map((seg) => (
                  <span key={seg.key} className="inline-flex items-center gap-1.5 tabular-nums">
                    <span className={`w-2 h-2 rounded-full ${seg.color}`} />
                    <span>{seg.label}</span>
                    <strong className="text-[#1D1D1F] font-semibold">{seg.count}</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* Compact Inventory Breakdown Row */}
            <div className="pt-3.5 border-t border-[#E5E5EA] flex flex-wrap gap-x-5 gap-y-1.5 text-[12px]">
              {categoryStockChart.map((cat) => (
                <span key={cat.name} className="text-[#6E6E73] tabular-nums">
                  {cat.name}: <strong className="text-[#1D1D1F] font-medium">{cat.stock}</strong>
                </span>
              ))}
            </div>
          </div>

          {/* Right: Compact Low-Stock Attention List */}
          <div className="lg:col-span-5 bg-white rounded-[20px] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.05] space-y-3">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-[15px] font-semibold text-[#1D1D1F]">Perlu Restok</h2>
              <span className="text-[12px] text-[#86868B]">{lowStockProducts.length} produk</span>
            </div>

            {lowStockProducts.length === 0 ? (
              <p className="text-[13px] text-[#6E6E73] py-4">Semua stok produk dalam kondisi aman.</p>
            ) : (
              <div className="divide-y divide-[#E5E5EA]">
                {lowStockProducts.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => openEditProduct(p)}
                    className="w-full py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-left group cursor-pointer"
                  >
                    <span className="text-[13px] text-[#1D1D1F] group-hover:text-[#0071E3] truncate transition-colors">
                      {p.nama}
                    </span>
                    <span
                      className={`text-[12px] font-semibold shrink-0 tabular-nums ${
                        Number(p.stok) === 0 ? 'text-[#D70015]' : 'text-[#B64400]'
                      }`}
                    >
                      Sisa {p.stok} ›
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 4. macOS Segmented Navigation Control */}
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="inline-flex items-center gap-1 p-1 rounded-[14px] bg-[#E8E8ED]/80">
            {[
              { key: 'orders', label: `Pesanan (${orders.length})` },
              { key: 'products', label: `Produk (${products.length})` },
              { key: 'categories', label: `Kategori (${collections.length})` },
              { key: 'discounts', label: `Kupon (${discounts.length})` },
              { key: 'users', label: `Pengguna (${usersList.length})` }
            ].map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`h-[36px] px-4 rounded-[10px] text-[13px] whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#1D1D1F] font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F] font-medium'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Unified White Workspace Card */}
        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <section className="bg-white rounded-[22px] p-5 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.05] space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 pb-4 border-b border-[#E5E5EA]">
              <div>
                <h2 className="text-[19px] font-semibold tracking-[-0.015em] text-[#1D1D1F]">
                  Pesanan &amp; Verifikasi
                </h2>
                <p className="text-[13px] text-[#6E6E73] mt-0.5">
                  Setujui bukti pembayaran dan perbarui status resi pengiriman.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868B]" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Cari invoice, nama, resi..."
                    className="h-[40px] w-full sm:w-56 pl-9 pr-4 rounded-[12px] bg-[#F5F5F7] text-[13px] text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                  />
                </div>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="h-[40px] px-3.5 rounded-[12px] bg-[#F5F5F7] text-[13px] font-medium text-[#1D1D1F] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
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
              <p className="text-[14px] text-[#6E6E73] py-10 text-center">Memuat pesanan...</p>
            ) : filteredOrders.length === 0 ? (
              <p className="text-[14px] text-[#6E6E73] py-10 text-center">
                Tidak ada pesanan yang cocok dengan filter saat ini.
              </p>
            ) : (
              <div className="divide-y divide-[#E5E5EA]">
                {filteredOrders.map((ord) => {
                  const badge = getStatusBadge(ord.statusKey || ord.paymentStatus);
                  const stStyle = getAppleStatusDot(ord.statusKey || ord.paymentStatus);
                  const isAwaiting = ord.paymentStatus === 'awaiting_verification';
                  return (
                    <div key={ord.id} className="py-5 first:pt-1 last:pb-1 space-y-3.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-[15px] font-semibold text-[#1D1D1F] tabular-nums">
                            #{ord.nomorPesanan}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${stStyle.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${stStyle.dot}`} />
                            <span>{ord.status || badge.label}</span>
                          </span>
                          <span className="text-[12px] text-[#86868B]">{formatDate(ord.tanggal)}</span>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[16px] font-semibold text-[#1D1D1F] tabular-nums">
                            {formatIDR(ord.total)}
                          </span>
                          {ord.uniqueCode > 0 && (
                            <span className="text-[12px] text-[#86868B] ml-2">
                              (+{ord.uniqueCode} · {ord.metodeBayar})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[13px]">
                        <div>
                          <span className="text-[12px] text-[#86868B] block">Pembeli</span>
                          <p className="font-medium text-[#1D1D1F]">
                            {ord.customer?.nama} · <span className="text-[#6E6E73] font-normal">{ord.customer?.kota}</span>
                          </p>
                        </div>
                        <div>
                          <span className="text-[12px] text-[#86868B] block">Perangkat</span>
                          {(ord.items || []).map((it, idx) => (
                            <p key={idx} className="text-[#1D1D1F] truncate">
                              {it.nama} ({it.jumlah}×)
                            </p>
                          ))}
                        </div>
                        <div>
                          <span className="text-[12px] text-[#86868B] block">Pengiriman</span>
                          <p className="text-[#1D1D1F] truncate">
                            {ord.kurir || 'JNE Reguler'} ·{' '}
                            <span className="text-[#6E6E73]">{ord.resi || 'Belum ada resi'}</span>
                          </p>
                        </div>
                      </div>

                      {ord.paymentProofUrl && (
                        <div className="p-3 rounded-[14px] bg-[#F5F5F7] flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={ord.paymentProofUrl}
                              alt="Bukti bayar"
                              className="w-10 h-10 rounded-lg object-cover bg-white shrink-0"
                            />
                            <div className="min-w-0 text-[13px]">
                              <p className="font-medium text-[#1D1D1F]">Bukti pembayaran terlampir</p>
                              <p className="text-[12px] text-[#6E6E73] truncate">
                                {ord.paymentNotes || 'Siap diperiksa oleh admin.'}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPreviewProofModal(ord)}
                            className="h-[34px] px-3.5 rounded-[980px] bg-white hover:bg-[#E8E8ED] text-[12px] font-medium text-[#1D1D1F] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Eye size={13} />
                            <span>Lihat Bukti</span>
                          </button>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {isAwaiting && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleVerifyPayment(ord.id, 'approve')}
                                className="h-[36px] px-4 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <CheckCircle2 size={14} />
                                <span>Setujui Bayar</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleVerifyPayment(ord.id, 'reject')}
                                className="h-[36px] px-4 rounded-[980px] bg-[#F5F5F7] hover:bg-[#D70015] text-[#D70015] hover:text-white text-[13px] font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <XCircle size={14} />
                                <span>Tolak</span>
                              </button>
                            </>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenTrackingModal(ord)}
                          className={`h-[36px] px-4 rounded-[980px] text-[13px] font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isAwaiting
                              ? 'bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F]'
                              : 'bg-[#0071E3] hover:bg-[#0077ED] text-white'
                          }`}
                        >
                          <Truck size={14} />
                          <span>Update Status &amp; Resi</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <section className="bg-white rounded-[22px] p-5 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.05] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E5EA]">
              <div>
                <h2 className="text-[19px] font-semibold tracking-[-0.015em] text-[#1D1D1F]">
                  Inventaris Perangkat
                </h2>
                <p className="text-[13px] text-[#6E6E73] mt-0.5">
                  Tambah, ubah harga dan stok, atau hapus produk katalog.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddProductModal(true)}
                className="h-[38px] px-4 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-medium inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
              >
                <Plus size={15} />
                <span>Tambah Produk</span>
              </button>
            </div>

            <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
              <table className="w-full text-left text-[13px] min-w-[660px]">
                <thead>
                  <tr className="border-b border-[#E5E5EA] text-[#86868B] text-[12px]">
                    <th className="py-2.5 font-medium">Produk</th>
                    <th className="py-2.5 font-medium">Kategori</th>
                    <th className="py-2.5 font-medium">Berat</th>
                    <th className="py-2.5 font-medium">Harga</th>
                    <th className="py-2.5 font-medium">Stok</th>
                    <th className="py-2.5 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5EA]">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAFAFC] transition-colors">
                      <td className="py-3.5 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-[12px] bg-[#F5F5F7] p-1.5 flex items-center justify-center shrink-0">
                            <img
                              src={p.gambar?.[0]}
                              alt={p.nama}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-[#1D1D1F]">{p.nama}</p>
                            <p className="text-[12px] text-[#6E6E73]">
                              {p.brand} · {p.kondisi || 'Grade A'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-[#424245]">{p.koleksi}</td>
                      <td className="py-3.5 text-[#6E6E73] tabular-nums">{formatWeight(p.beratGram || 1000)}</td>
                      <td className="py-3.5 font-semibold text-[#1D1D1F] tabular-nums">
                        {formatIDR(p.harga)}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`text-[13px] font-medium tabular-nums ${
                            Number(p.stok) === 0
                              ? 'text-[#D70015]'
                              : Number(p.stok) <= 5
                              ? 'text-[#B64400]'
                              : 'text-[#1D7F3E]'
                          }`}
                        >
                          {p.stok} unit
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditProduct(p)}
                            className="w-9 h-9 rounded-full hover:bg-[#F5F5F7] text-[#424245] hover:text-[#1D1D1F] inline-flex items-center justify-center transition-colors cursor-pointer"
                            title="Edit Produk"
                            aria-label={`Edit ${p.nama}`}
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id, p.nama)}
                            className="w-9 h-9 rounded-full hover:bg-[#F5F5F7] text-[#86868B] hover:text-[#D70015] inline-flex items-center justify-center transition-colors cursor-pointer"
                            title="Hapus Produk"
                            aria-label={`Hapus ${p.nama}`}
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
          </section>
        )}

        {/* TAB 3: CATEGORIES */}
        {activeTab === 'categories' && (
          <section className="bg-white rounded-[22px] p-5 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.05] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E5EA]">
              <div>
                <h2 className="text-[19px] font-semibold tracking-[-0.015em] text-[#1D1D1F]">
                  Kategori Produk
                </h2>
                <p className="text-[13px] text-[#6E6E73] mt-0.5">
                  Kelola kategori yang tampil di beranda dan filter katalog.
                </p>
              </div>
              <button
                type="button"
                onClick={openAddCategory}
                className="h-[38px] px-4 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-medium inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
              >
                <Plus size={15} />
                <span>Tambah Kategori</span>
              </button>
            </div>

            <div className="divide-y divide-[#E5E5EA]">
              {collections.map((col) => {
                const count = products.filter((p) => p.koleksiSlug === col.slug).length;
                return (
                  <div key={col.id} className="py-4 first:pt-1 last:pb-1 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-[14px] bg-[#F5F5F7] p-2 flex items-center justify-center shrink-0">
                        <img
                          src={col.gambar}
                          alt={col.nama}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold text-[#1D1D1F] truncate">{col.nama}</p>
                        <p className="text-[12px] text-[#6E6E73] truncate">
                          /{col.slug} · {count} produk
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditCategory(col)}
                        className="w-9 h-9 rounded-full hover:bg-[#F5F5F7] text-[#424245] hover:text-[#1D1D1F] flex items-center justify-center transition-colors cursor-pointer"
                        title="Edit Kategori"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(col)}
                        className="w-9 h-9 rounded-full hover:bg-[#F5F5F7] text-[#86868B] hover:text-[#D70015] flex items-center justify-center transition-colors cursor-pointer"
                        title="Hapus Kategori"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* TAB 4: DISCOUNTS */}
        {activeTab === 'discounts' && (
          <section className="bg-white rounded-[22px] p-5 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.05] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E5EA]">
              <div>
                <h2 className="text-[19px] font-semibold tracking-[-0.015em] text-[#1D1D1F]">
                  Kupon &amp; Voucher Promo
                </h2>
                <p className="text-[13px] text-[#6E6E73] mt-0.5">
                  Atur kode potongan harga untuk seluruh kategori toko.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDiscountModal(true)}
                className="h-[38px] px-4 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-medium inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
              >
                <Plus size={15} />
                <span>Buat Kupon</span>
              </button>
            </div>

            <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
              <table className="w-full text-left text-[13px] min-w-[580px]">
                <thead>
                  <tr className="border-b border-[#E5E5EA] text-[#86868B] text-[12px]">
                    <th className="py-2.5 font-medium">Kode</th>
                    <th className="py-2.5 font-medium">Promo</th>
                    <th className="py-2.5 font-medium">Potongan</th>
                    <th className="py-2.5 font-medium">Min. Belanja</th>
                    <th className="py-2.5 font-medium">Status</th>
                    <th className="py-2.5 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5EA]">
                  {discounts.map((d) => (
                    <tr key={d.id} className="hover:bg-[#FAFAFC] transition-colors">
                      <td className="py-3.5 font-semibold text-[#1D1D1F]">{d.kode}</td>
                      <td className="py-3.5 text-[#424245]">{d.nama}</td>
                      <td className="py-3.5 font-semibold text-[#1D1D1F] tabular-nums">
                        {d.tipe === 'persen' ? `${d.nilai}%` : formatIDR(d.nilai)}
                      </td>
                      <td className="py-3.5 text-[#6E6E73] tabular-nums">{formatIDR(d.minBelanja)}</td>
                      <td className="py-3.5">
                        <span className={`font-medium ${d.aktif ? 'text-[#1D7F3E]' : 'text-[#86868B]'}`}>
                          {d.aktif ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleDiscount(d.id)}
                          className="text-[13px] font-medium text-[#0071E3] hover:underline cursor-pointer"
                        >
                          {d.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 5: USERS & ROLES */}
        {activeTab === 'users' && (
          <section className="bg-white rounded-[22px] p-5 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.05] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E5EA]">
              <div>
                <h2 className="text-[19px] font-semibold tracking-[-0.015em] text-[#1D1D1F]">
                  Pengguna &amp; Hak Akses
                </h2>
                <p className="text-[13px] text-[#6E6E73] mt-0.5">
                  Kelola role Admin dan Buyer atau tambah akun tim baru.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUserFormError('');
                  setShowAddUserModal(true);
                }}
                className="h-[38px] px-4 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-medium inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
              >
                <UserPlus size={15} />
                <span>Tambah Pengguna</span>
              </button>
            </div>

            <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
              <table className="w-full text-left text-[13px] min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#E5E5EA] text-[#86868B] text-[12px]">
                    <th className="py-2.5 font-medium">Nama &amp; Email</th>
                    <th className="py-2.5 font-medium">WhatsApp</th>
                    <th className="py-2.5 font-medium">Role</th>
                    <th className="py-2.5 font-medium">Status</th>
                    <th className="py-2.5 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5EA]">
                  {usersList.map((u) => {
                    const isSelf = user && String(user.id) === String(u.id);
                    return (
                      <tr key={u.id} className="hover:bg-[#FAFAFC] transition-colors">
                        <td className="py-3.5 pr-3">
                          <p className="font-semibold text-[#1D1D1F]">
                            {u.name}{' '}
                            {isSelf && <span className="text-[12px] font-normal text-[#86868B]">(Anda)</span>}
                          </p>
                          <p className="text-[12px] text-[#6E6E73]">{u.email}</p>
                        </td>
                        <td className="py-3.5 text-[#424245]">{u.phone || '—'}</td>
                        <td className="py-3.5 font-medium text-[#1D1D1F] capitalize">{u.role}</td>
                        <td className="py-3.5">
                          <span
                            className={`font-medium ${
                              u.isActive !== false ? 'text-[#1D7F3E]' : 'text-[#D70015]'
                            }`}
                          >
                            {u.isActive !== false ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          {isSelf ? (
                            <span className="text-[12px] text-[#86868B]">Sesi aktif</span>
                          ) : (
                            <div className="inline-flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => handleChangeUserRole(u)}
                                className="h-[32px] px-3.5 rounded-[980px] bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] text-[12px] font-medium transition-colors cursor-pointer"
                              >
                                Jadikan {u.role === 'admin' ? 'Buyer' : 'Admin'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleUserActive(u)}
                                className="text-[12px] font-medium text-[#D70015] hover:underline cursor-pointer"
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
          </section>
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
                className="absolute inset-0 bg-[#1D2129]/70 backdrop-blur-xs"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-[24px] max-w-md w-full p-6 shadow-tc-lift border border-[#E2E7EE] z-10 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#ECEFF4] pb-3">
                  <h3 className="font-display text-lg font-bold text-[#1D2129]">
                    Bukti Bayar #{previewProofModal.nomorPesanan}
                  </h3>
                  <button
                    onClick={() => setPreviewProofModal(null)}
                    aria-label="Tutup preview bukti pembayaran"
                    className="w-9 h-9 rounded-xl text-[#8692A3] hover:text-[#1D2129] hover:bg-[#ECEFF4] flex items-center justify-center"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="bg-[#F7F8FA] rounded-[20px] p-3 border border-[#E2E7EE] text-center">
                  <img
                    src={previewProofModal.paymentProofUrl}
                    alt="Bukti Pembayaran"
                    className="max-h-72 mx-auto rounded-xl object-contain"
                  />
                </div>
                <div className="text-xs text-[#4F627A] space-y-1">
                  <p>
                    <strong className="text-[#1D2129]">Total Tagihan:</strong>{' '}
                    {formatIDR(previewProofModal.total)}
                  </p>
                  <p>
                    <strong className="text-[#1D2129]">Metode:</strong> {previewProofModal.metodeBayar}
                  </p>
                  {previewProofModal.paymentNotes && (
                    <p>
                      <strong className="text-[#1D2129]">Catatan Pembeli:</strong>{' '}
                      {previewProofModal.paymentNotes}
                    </p>
                  )}
                </div>
                {previewProofModal.paymentStatus === 'awaiting_verification' && (
                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleVerifyPayment(previewProofModal.id, 'approve');
                        setPreviewProofModal(null);
                      }}
                      className="flex-1 h-[42px] rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-normal transition-colors cursor-pointer"
                    >
                      Setujui Bayar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleVerifyPayment(previewProofModal.id, 'reject');
                        setPreviewProofModal(null);
                      }}
                      className="flex-1 h-[42px] rounded-[980px] border border-[#D70015] text-[#D70015] hover:bg-[#D70015] hover:text-white text-[13px] font-normal transition-colors cursor-pointer"
                    >
                      Tolak Bukti
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: UPDATE STATUS & RESI */}
        <AnimatePresence>
          {trackingModalOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setTrackingModalOrder(null)}
                className="fixed inset-0 bg-[#1D2129]/60 backdrop-blur-xs"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-[24px] max-w-md w-full p-6 shadow-tc-lift z-10 space-y-4 my-8 border border-[#E2E7EE]"
              >
                <div className="flex items-center justify-between border-b border-[#ECEFF4] pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={17} className="text-[#1D2129]" />
                    <h3 className="font-display text-lg font-bold text-[#1D2129]">
                      Update Status #{trackingModalOrder.nomorPesanan}
                    </h3>
                  </div>
                  <button
                    onClick={() => setTrackingModalOrder(null)}
                    aria-label="Tutup modal status"
                    className="w-9 h-9 rounded-xl text-[#8692A3] hover:text-[#1D2129] hover:bg-[#ECEFF4] flex items-center justify-center"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveTracking} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-[#323846] mb-1">Tahap Status Pesanan</label>
                    <select
                      value={trackStatusKey}
                      onChange={(e) => setTrackStatusKey(e.target.value)}
                      className="tc-input"
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
                    <label className="block font-semibold text-[#323846] mb-1">
                      Nomor Resi Ekspedisi (JNE / J&amp;T / SiCepat)
                    </label>
                    <input
                      type="text"
                      value={trackResi}
                      onChange={(e) => setTrackResi(e.target.value)}
                      placeholder="Contoh: JNE8827162519ID / JP1234567890"
                      className="tc-input "
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#323846] mb-1">Lokasi Checkpoint</label>
                    <input
                      type="text"
                      value={trackLocation}
                      onChange={(e) => setTrackLocation(e.target.value)}
                      placeholder="Depok (Workshop TECHCARE)"
                      className="tc-input"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#323846] mb-1">Catatan (Opsional)</label>
                    <textarea
                      rows={2}
                      value={trackNote}
                      onChange={(e) => setTrackNote(e.target.value)}
                      placeholder="Misal: QC selesai & paket di-pickup J&T Express."
                      className="tc-input min-h-[70px] resize-none"
                    />
                  </div>

                  <button type="submit" disabled={submittingTrack} className="tc-btn-primary w-full">
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
                className="fixed inset-0 bg-[#1D2129]/60 backdrop-blur-xs"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-[24px] max-w-lg w-full p-6 shadow-tc-lift z-10 space-y-4 my-8 border border-[#E2E7EE]"
              >
                <div className="flex items-center justify-between border-b border-[#ECEFF4] pb-3">
                  <h3 className="font-display text-lg font-bold text-[#1D2129]">
                    Tambah Produk IT (&lt; 10 Juta)
                  </h3>
                  <button
                    onClick={() => setShowAddProductModal(false)}
                    aria-label="Tutup modal tambah produk"
                    className="w-9 h-9 rounded-xl text-[#8692A3] hover:text-[#1D2129] hover:bg-[#ECEFF4] flex items-center justify-center"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#323846] mb-1">Nama Produk *</label>
                      <input
                        type="text"
                        required
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        placeholder="ThinkPad T14 / RAM 16GB"
                        className="tc-input"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#323846] mb-1">Brand</label>
                      <input
                        type="text"
                        value={newProdBrand}
                        onChange={(e) => setNewProdBrand(e.target.value)}
                        placeholder="ASUS / LENOVO / MSI / LOGITECH"
                        className="tc-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#323846] mb-1">Kategori</label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="tc-input"
                      >
                        {collections.map((c) => (
                          <option key={c.id} value={c.nama}>
                            {c.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-[#323846] mb-1">Kondisi / Grade</label>
                      <input
                        type="text"
                        value={newProdKondisi}
                        onChange={(e) => setNewProdKondisi(e.target.value)}
                        className="tc-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block font-semibold text-[#323846] mb-1">Harga (Rp) *</label>
                      <input
                        type="number"
                        required
                        min={1000}
                        max={9999999}
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        placeholder="4500000"
                        className="tc-input"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#323846] mb-1">Harga Coret</label>
                      <input
                        type="number"
                        value={newProdOriginalPrice}
                        onChange={(e) => setNewProdOriginalPrice(e.target.value)}
                        placeholder="5800000"
                        className="tc-input"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#323846] mb-1">Stok</label>
                      <input
                        type="number"
                        min={0}
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(e.target.value)}
                        className="tc-input"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#323846] mb-1">Berat (g)</label>
                      <input
                        type="number"
                        min={50}
                        value={newProdWeight}
                        onChange={(e) => setNewProdWeight(e.target.value)}
                        className="tc-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#323846] mb-1">Pilih Foto Produk</label>
                    <select
                      value={newProdImagePreset}
                      onChange={(e) => setNewProdImagePreset(e.target.value)}
                      className="tc-input"
                    >
                      {IMAGE_PRESETS.map((img) => (
                        <option key={img.value} value={img.value}>
                          {img.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#323846] mb-1">Deskripsi &amp; QC</label>
                    <textarea
                      rows={2}
                      value={newProdDeskripsi}
                      onChange={(e) => setNewProdDeskripsi(e.target.value)}
                      placeholder="Kondisi mulus, baterai sehat, sudah repasta..."
                      className="tc-input min-h-[70px] resize-none"
                    />
                  </div>

                  <button type="submit" disabled={submittingProduct} className="tc-btn-primary w-full">
                    {submittingProduct ? 'Menyimpan...' : 'Simpan ke Katalog'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: EDIT PRODUCT */}
        <AnimatePresence>
          {editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setEditingProduct(null)}
                className="fixed inset-0 bg-[#1D2129]/60 backdrop-blur-xs"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-[24px] max-w-lg w-full p-6 shadow-tc-lift z-10 space-y-4 my-8 border border-[#E2E7EE]"
              >
                <div className="flex items-center justify-between border-b border-[#ECEFF4] pb-3">
                  <h3 className="font-display text-lg font-bold text-[#1D2129]">Edit Produk Lengkap</h3>
                  <button
                    onClick={() => setEditingProduct(null)}
                    aria-label="Tutup modal edit produk"
                    className="w-9 h-9 rounded-xl text-[#8692A3] hover:text-[#1D2129] hover:bg-[#ECEFF4] flex items-center justify-center"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#323846] mb-1">Nama Produk</label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="tc-input"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#323846] mb-1">Brand</label>
                      <input
                        type="text"
                        value={editBrand}
                        onChange={(e) => setEditBrand(e.target.value)}
                        className="tc-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#323846] mb-1">Kategori</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="tc-input"
                      >
                        {collections.map((c) => (
                          <option key={c.id} value={c.nama}>
                            {c.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-[#323846] mb-1">Kondisi</label>
                      <input
                        type="text"
                        value={editKondisi}
                        onChange={(e) => setEditKondisi(e.target.value)}
                        className="tc-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block font-semibold text-[#323846] mb-1">Harga (Rp)</label>
                      <input
                        type="number"
                        min={1000}
                        max={9999999}
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="tc-input"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#323846] mb-1">Stok Unit</label>
                      <input
                        type="number"
                        min={0}
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        className="tc-input"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#323846] mb-1">Berat (g)</label>
                      <input
                        type="number"
                        min={50}
                        value={editWeight}
                        onChange={(e) => setEditWeight(e.target.value)}
                        className="tc-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#323846] mb-1">Deskripsi</label>
                    <textarea
                      rows={2}
                      value={editDeskripsi}
                      onChange={(e) => setEditDeskripsi(e.target.value)}
                      className="tc-input min-h-[70px] resize-none"
                    />
                  </div>

                  <button type="submit" disabled={submittingEdit} className="tc-btn-primary w-full">
                    <Check size={15} />
                    <span>{submittingEdit ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: CATEGORY */}
        <AnimatePresence>
          {showCategoryModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCategoryModal(false)}
                className="absolute inset-0 bg-[#1D2129]/60 backdrop-blur-xs"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-[24px] max-w-md w-full p-6 shadow-tc-lift z-10 space-y-4 border border-[#E2E7EE]"
              >
                <div className="flex items-center justify-between border-b border-[#ECEFF4] pb-3">
                  <h3 className="font-display text-lg font-bold text-[#1D2129]">
                    {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                  </h3>
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    aria-label="Tutup modal kategori"
                    className="w-9 h-9 rounded-xl text-[#8692A3] hover:text-[#1D2129] hover:bg-[#ECEFF4] flex items-center justify-center"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#323846] mb-1">Nama Kategori *</label>
                    <input
                      type="text"
                      required
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      placeholder="Mis. Networking & Router"
                      className="tc-input"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#323846] mb-1">Tagline Singkat</label>
                    <input
                      type="text"
                      value={catTagline}
                      onChange={(e) => setCatTagline(e.target.value)}
                      placeholder="Perangkat jaringan dan router kantor"
                      className="tc-input"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#323846] mb-1">Foto Kategori</label>
                    <select
                      value={catImage}
                      onChange={(e) => setCatImage(e.target.value)}
                      className="tc-input"
                    >
                      {IMAGE_PRESETS.map((img) => (
                        <option key={img.value} value={img.value}>
                          {img.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" disabled={submittingCat} className="tc-btn-primary w-full">
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
                className="absolute inset-0 bg-[#1D2129]/60 backdrop-blur-xs"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-[24px] max-w-md w-full p-6 shadow-tc-lift z-10 space-y-4 border border-[#E2E7EE]"
              >
                <div className="flex items-center justify-between border-b border-[#ECEFF4] pb-3">
                  <h3 className="font-display text-lg font-bold text-[#1D2129]">Buat Kupon Promo</h3>
                  <button
                    onClick={() => setShowAddDiscountModal(false)}
                    aria-label="Tutup modal kupon"
                    className="w-9 h-9 rounded-xl text-[#8692A3] hover:text-[#1D2129] hover:bg-[#ECEFF4] flex items-center justify-center"
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
                    className="tc-input uppercase"
                  />
                  <input
                    type="text"
                    placeholder="Nama Promo"
                    value={namaDiskon}
                    onChange={(e) => setNamaDiskon(e.target.value)}
                    className="tc-input"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={tipeDiskon}
                      onChange={(e) => setTipeDiskon(e.target.value)}
                      className="tc-input"
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
                      className="tc-input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      min={0}
                      placeholder="Min. Belanja"
                      value={minBelanja}
                      onChange={(e) => setMinBelanja(e.target.value)}
                      className="tc-input"
                    />
                    <input
                      type="number"
                      min={1}
                      placeholder="Kuota"
                      value={kuotaDiskon}
                      onChange={(e) => setKuotaDiskon(e.target.value)}
                      className="tc-input"
                    />
                  </div>
                  <button type="submit" disabled={submittingDiscount} className="tc-btn-primary w-full">
                    {submittingDiscount ? 'Menyimpan...' : 'Aktifkan Kupon'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: ADD USER */}
        <AnimatePresence>
          {showAddUserModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddUserModal(false)}
                className="absolute inset-0 bg-[#1D2129]/60 backdrop-blur-xs"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-[24px] max-w-md w-full p-6 shadow-tc-lift z-10 space-y-4 border border-[#E2E7EE]"
              >
                <div className="flex items-center justify-between border-b border-[#ECEFF4] pb-3">
                  <h3 className="font-display text-lg font-bold text-[#1D2129]">Tambah Pengguna Baru</h3>
                  <button
                    onClick={() => setShowAddUserModal(false)}
                    aria-label="Tutup modal pengguna"
                    className="w-9 h-9 rounded-xl text-[#8692A3] hover:text-[#1D2129] hover:bg-[#ECEFF4] flex items-center justify-center"
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
                    className="tc-input"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email *"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="tc-input"
                  />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Password (min. 6 karakter) *"
                    value={newUserPass}
                    onChange={(e) => setNewUserPass(e.target.value)}
                    className="tc-input"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="tel"
                      placeholder="No. WhatsApp"
                      value={newUserPhone}
                      onChange={(e) => setNewUserPhone(e.target.value)}
                      className="tc-input"
                    />
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="tc-input"
                    >
                      <option value="buyer">Role: Buyer</option>
                      <option value="admin">Role: Admin</option>
                    </select>
                  </div>
                  <button type="submit" className="tc-btn-primary w-full">
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
