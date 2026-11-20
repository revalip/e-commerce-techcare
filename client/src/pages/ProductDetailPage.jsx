import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Wrench,
  Heart,
  Star,
  ZoomIn,
  X,
  Cpu,
  HardDrive,
  Sparkles,
  Scale
} from 'lucide-react';
import { formatIDR, formatWeight } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductDetailPage({ product, onBack, onDirectCheckout }) {
  const { addToCart } = useCart();
  const { isGuest, openAuthModal } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [selectedColor, setSelectedColor] = useState(
    product?.varianWarna?.[0]?.nama || 'Standard'
  );
  const [selectedRamIdx, setSelectedRamIdx] = useState(0);
  const [selectedSsdIdx, setSelectedSsdIdx] = useState(0);
  const [selectedTierIdx, setSelectedTierIdx] = useState(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const [showStickyBar, setShowStickyBar] = useState(false);
  const actionBtnRef = useRef(null);

  useEffect(() => {
    setSelectedColor(product?.varianWarna?.[0]?.nama || 'Standard');
    setSelectedRamIdx(0);
    setSelectedSsdIdx(0);
    setSelectedTierIdx(0);
    setActiveImageIdx(0);
    setQuantity(1);
    setLightboxOpen(false);
  }, [product?.id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (actionBtnRef.current) observer.observe(actionBtnRef.current);
    return () => observer.disconnect();
  }, [product?.id]);

  const ramOptions = product?.specOptions?.ram || [];
  const ssdOptions = product?.specOptions?.ssd || [];
  const tierOptions = product?.specOptions?.tier || [];

  const activeRam = ramOptions[selectedRamIdx] || null;
  const activeSsd = ssdOptions[selectedSsdIdx] || null;
  const activeTier = tierOptions[selectedTierIdx] || null;

  const computedPrice = useMemo(() => {
    if (!product) return 0;
    const base = Number(product.harga) || 0;
    const delta =
      (activeRam?.priceDelta || 0) +
      (activeSsd?.priceDelta || 0) +
      (activeTier?.priceDelta || 0);
    return base + delta;
  }, [product, activeRam, activeSsd, activeTier]);

  const computedOriginalPrice = useMemo(() => {
    if (!product?.hargaCoret) return null;
    const delta =
      (activeRam?.priceDelta || 0) +
      (activeSsd?.priceDelta || 0) +
      (activeTier?.priceDelta || 0);
    return Number(product.hargaCoret) + delta;
  }, [product, activeRam, activeSsd, activeTier]);

  const specLabel = [activeRam?.label, activeSsd?.label, activeTier?.label]
    .filter(Boolean)
    .join(' • ');

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const outOfStock = Number(product.stok) <= 0;
  const images =
    product.gambar && product.gambar.length > 0
      ? product.gambar
      : ['/images/products/thinkpad-x1-carbon-front.jpg'];

  const handleAddToCart = () => {
    if (outOfStock) return;
    addToCart(product, quantity, selectedColor, {
      ram: activeRam?.label || null,
      ssd: activeSsd?.label || null,
      tier: activeTier?.label || null,
      specLabel,
      harga: computedPrice
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1100);
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    addToCart(product, quantity, selectedColor, {
      ram: activeRam?.label || null,
      ssd: activeSsd?.label || null,
      tier: activeTier?.label || null,
      specLabel,
      harga: computedPrice
    });
    if (isGuest) {
      openAuthModal(
        'login',
        'Silakan masuk atau daftar akun buyer terlebih dahulu untuk melanjutkan checkout & pelacakan pesanan.',
        () => onDirectCheckout()
      );
    } else {
      onDirectCheckout();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="bg-[#F4F6FA] min-h-screen py-5 sm:py-10 pb-28 sm:pb-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb / Back Row */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 min-h-[40px] px-3.5 rounded-xl bg-white border border-slate-200 hover:border-[#0B5FFF] text-xs font-semibold text-slate-700 hover:text-[#0B5FFF] transition-colors"
          >
            <ArrowLeft size={15} />
            <span>Kembali ke Katalog</span>
          </button>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span>{product.koleksi}</span>
            <span>/</span>
            <span className="font-bold text-[#0B5FFF]">{product.brand}</span>
          </span>
        </div>

        {/* Main 2-Column Hardware Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left: Gallery & QC Card */}
          <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-28">
            <div
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onClick={() => setLightboxOpen(true)}
              className="bg-gradient-to-b from-[#FFFFFF] to-[#E8EEF6] rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-tc-card flex items-center justify-center relative overflow-hidden group cursor-zoom-in aspect-[4/3]"
            >
              <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                {product.diskonPersen > 0 && (
                  <span className="bg-[#F97316] text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-xs">
                    Hemat {product.diskonPersen}%
                  </span>
                )}
                <span className="bg-white/95 backdrop-blur-xs text-slate-800 text-[11px] font-semibold px-3 py-1 rounded-lg border border-slate-200">
                  {product.kondisi || 'Second Grade A'}
                </span>
              </div>

              <div className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-xs text-slate-700 text-[11px] font-semibold px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
                <ZoomIn size={14} className="text-[#0B5FFF]" />
                <span>Perbesar</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIdx}
                  src={images[activeImageIdx]}
                  alt={product.nama}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: isZoomed ? 1.08 : 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="max-h-full max-w-[88%] object-contain drop-shadow-md"
                />
              </AnimatePresence>
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`w-20 h-20 rounded-2xl bg-white border p-2 shrink-0 transition-all ${
                      activeImageIdx === i
                        ? 'border-[#0B5FFF] ring-2 ring-[#0B5FFF]/20'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Sudut ${i + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* QC Verification Strip */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-tc-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] text-[#0B5FFF] flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="font-display text-xs sm:text-sm font-bold text-[#0B1220]">
                    Certified Pre-Owned TECHCARE
                  </p>
                  <p className="text-xs text-slate-500">
                    {product.qcSummary || 'Lulus 32 Titik QC Teknisi • Siap Pakai'}
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-center text-[11px] font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                {product.garansi || 'Garansi Toko 60 Hari'}
              </span>
            </div>
          </div>

          {/* Right: Specs, Dynamic Configurator & Buy Panel */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-tc-card space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B5FFF] bg-[#EEF4FF] px-2.5 py-1 rounded-lg">
                  {product.brand} • {product.koleksi}
                </span>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg tabular-nums">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span>{product.rating || '4.9'}</span>
                  <span className="text-slate-500 font-normal">({product.ulasan || 40})</span>
                </div>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1220] leading-tight">
                {product.nama}
              </h1>
              <p className="text-xs font-semibold text-slate-500">{product.tagline}</p>
            </div>

            {/* Dynamic Price Box */}
            <div className="p-4 rounded-2xl bg-[#F4F6FA] border border-slate-200/80 space-y-1.5">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="font-display text-2xl sm:text-3xl font-bold text-[#0B1220] tabular-nums">
                  {formatIDR(computedPrice)}
                </span>
                {computedOriginalPrice && (
                  <span className="text-sm text-slate-400 line-through tabular-nums">
                    {formatIDR(computedOriginalPrice)}
                  </span>
                )}
              </div>
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                <span>
                  Stok:{' '}
                  <strong className={outOfStock ? 'text-rose-600' : 'text-emerald-700'}>
                    {outOfStock ? 'Stok Habis' : `${product.stok} unit tersedia`}
                  </strong>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Scale size={13} className="text-[#0B5FFF]" />
                  Berat kirim: <strong>{formatWeight(product.beratGram || 1000)}</strong>
                </span>
              </div>
            </div>

            {/* RAM Selector */}
            {ramOptions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Cpu size={14} className="text-[#0B5FFF]" /> Pilih Kapasitas RAM
                  </span>
                  <span className="font-semibold text-[#0B5FFF]">{activeRam?.label}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {ramOptions.map((opt, idx) => {
                    const active = idx === selectedRamIdx;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setSelectedRamIdx(idx)}
                        className={`min-h-[52px] py-2 px-2.5 rounded-xl border text-left transition-all ${
                          active
                            ? 'border-[#0B5FFF] bg-[#EEF4FF] text-[#0B1220] ring-1 ring-[#0B5FFF]'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <span className="block text-xs font-bold leading-tight">{opt.label}</span>
                        <span className={`block text-[10px] mt-0.5 tabular-nums ${active ? 'text-[#0B5FFF] font-semibold' : 'text-slate-400'}`}>
                          {opt.priceDelta > 0 ? `+${formatIDR(opt.priceDelta)}` : 'Standar'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SSD Selector */}
            {ssdOptions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <HardDrive size={14} className="text-[#0B5FFF]" /> Pilih Kapasitas SSD
                  </span>
                  <span className="font-semibold text-[#0B5FFF]">{activeSsd?.label}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {ssdOptions.map((opt, idx) => {
                    const active = idx === selectedSsdIdx;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setSelectedSsdIdx(idx)}
                        className={`min-h-[52px] py-2 px-2.5 rounded-xl border text-left transition-all ${
                          active
                            ? 'border-[#0B5FFF] bg-[#EEF4FF] text-[#0B1220] ring-1 ring-[#0B5FFF]'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <span className="block text-xs font-bold leading-tight">{opt.label}</span>
                        <span className={`block text-[10px] mt-0.5 tabular-nums ${active ? 'text-[#0B5FFF] font-semibold' : 'text-slate-400'}`}>
                          {opt.priceDelta > 0 ? `+${formatIDR(opt.priceDelta)}` : 'Standar'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tier Selector */}
            {tierOptions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#0B5FFF]" /> Pilih Tipe / Varian
                  </span>
                  <span className="font-semibold text-[#0B5FFF]">{activeTier?.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {tierOptions.map((opt, idx) => {
                    const active = idx === selectedTierIdx;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setSelectedTierIdx(idx)}
                        className={`min-h-[52px] py-2 px-3 rounded-xl border text-left transition-all ${
                          active
                            ? 'border-[#0B5FFF] bg-[#EEF4FF] text-[#0B1220] ring-1 ring-[#0B5FFF]'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <span className="block text-xs font-bold leading-tight">{opt.label}</span>
                        <span className={`block text-[10px] mt-0.5 tabular-nums ${active ? 'text-[#0B5FFF] font-semibold' : 'text-slate-400'}`}>
                          {opt.priceDelta > 0 ? `+${formatIDR(opt.priceDelta)}` : 'Standar'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.varianWarna && product.varianWarna.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs text-slate-600 font-medium">
                  Warna Unit: <strong className="text-slate-900">{selectedColor}</strong>
                </span>
                <div className="flex items-center gap-2.5">
                  {product.varianWarna.map((v) => (
                    <button
                      key={v.nama}
                      type="button"
                      onClick={() => setSelectedColor(v.nama)}
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedColor === v.nama
                          ? 'border-[#0B5FFF] scale-110'
                          : 'border-transparent hover:scale-105'
                      }`}
                      title={v.nama}
                    >
                      <span
                        className="w-6 h-6 rounded-full border border-black/15"
                        style={{ backgroundColor: v.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Action Buttons (min 44px) */}
            <div ref={actionBtnRef} className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Jumlah Unit:</span>
                <div className="inline-flex items-center border border-slate-200 rounded-xl bg-[#F8FAFC]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 flex items-center justify-center text-slate-600 hover:text-[#0B5FFF]"
                    aria-label="Kurangi jumlah"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="text-sm font-bold min-w-[30px] text-center tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stok || 10, quantity + 1))}
                    className="w-11 h-11 flex items-center justify-center text-slate-600 hover:text-[#0B5FFF]"
                    aria-label="Tambah jumlah"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  disabled={outOfStock}
                  onClick={handleAddToCart}
                  className={`flex-1 min-h-[46px] px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border transition-all ${
                    outOfStock
                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                      : addedFeedback
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-[#EEF4FF] hover:bg-[#DCE8FF] border-[#C7DCFF] text-[#0B5FFF]'
                  }`}
                >
                  {addedFeedback ? <Check size={16} /> : <ShoppingBag size={16} />}
                  <span>
                    {outOfStock ? 'Stok Habis' : addedFeedback ? 'Masuk Keranjang!' : '+ Keranjang'}
                  </span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label={wishlisted ? 'Hapus dari favorit' : 'Simpan ke favorit'}
                  className={`w-12 min-h-[46px] rounded-xl border flex items-center justify-center shrink-0 transition-all ${
                    wishlisted
                      ? 'bg-[#FFF7ED] border-[#FDBA74] text-[#F97316]'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-[#F97316] hover:text-[#F97316]'
                  }`}
                >
                  <Heart size={18} className={wishlisted ? 'fill-[#F97316]' : ''} />
                </button>
              </div>

              <button
                disabled={outOfStock}
                onClick={handleBuyNow}
                className="tc-btn-primary w-full py-3.5 text-sm"
              >
                {outOfStock
                  ? 'Stok Sementara Habis'
                  : `Beli Sekarang • ${formatIDR(computedPrice * quantity)}`}
              </button>
            </div>

            {/* Description & Spec Details */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{product.deskripsi}</p>

              {product.fitur && (
                <div className="space-y-2">
                  <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#0B1220]">
                    Spesifikasi &amp; Hasil QC Teknisi:
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600">
                    {product.fitur.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#EEF4FF] text-[#0B5FFF] flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={10} strokeWidth={3} />
                        </span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-[11px] text-slate-700 text-center">
              <div className="flex flex-col items-center gap-1 bg-[#F4F6FA] p-2.5 rounded-xl border border-slate-200/70">
                <ShieldCheck size={16} className="text-[#0B5FFF]" />
                <span className="font-semibold">32 Titik QC</span>
              </div>
              <div className="flex flex-col items-center gap-1 bg-[#F4F6FA] p-2.5 rounded-xl border border-slate-200/70">
                <Wrench size={16} className="text-[#0B5FFF]" />
                <span className="font-semibold">Free Pasang</span>
              </div>
              <div className="flex flex-col items-center gap-1 bg-[#F4F6FA] p-2.5 rounded-xl border border-slate-200/70">
                <Truck size={16} className="text-[#0B5FFF]" />
                <span className="font-semibold">JNE / J&amp;T</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-[#0B1220]/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-5 right-5 w-11 h-11 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
              aria-label="Tutup perbesar"
            >
              <X size={20} />
            </button>
            <img
              src={images[activeImageIdx]}
              alt={product.nama}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[92vw] object-contain rounded-2xl bg-white p-6"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Bottom Buy Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-16 inset-x-0 z-30 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 flex items-center justify-between gap-3 shadow-[0_-6px_24px_rgba(11,18,32,0.10)]"
          >
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 truncate">{specLabel || product.kondisi}</p>
              <p className="font-display text-sm font-bold text-[#0B1220] tabular-nums">
                {formatIDR(computedPrice * quantity)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={outOfStock}
                onClick={handleAddToCart}
                className="w-11 h-11 rounded-xl border border-[#C7DCFF] bg-[#EEF4FF] text-[#0B5FFF] flex items-center justify-center disabled:opacity-40"
                aria-label="Tambah ke keranjang"
              >
                <ShoppingBag size={17} />
              </button>
              <button
                disabled={outOfStock}
                onClick={handleBuyNow}
                className="tc-btn-primary px-4 text-xs"
              >
                {outOfStock ? 'Habis' : 'Beli Sekarang'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
