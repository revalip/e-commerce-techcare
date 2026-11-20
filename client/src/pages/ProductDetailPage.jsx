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
  Sparkles
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

  // Reset pilihan ketika berganti produk
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
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="bg-[#f9f9f8] min-h-screen py-6 sm:py-12 pb-28 sm:pb-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back Row */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Katalog</span>
          </button>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500">
            <span>{product.koleksi}</span>
            <span>/</span>
            <span className="text-neutral-900">{product.brand}</span>
          </span>
        </div>

        {/* Main 2-Column Adidas-inspired Editorial Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Studio Gallery (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onClick={() => setLightboxOpen(true)}
              className="bg-[#f0f0f2] rounded-3xl sm:rounded-4xl p-6 sm:p-12 border border-neutral-200/70 flex items-center justify-center relative overflow-hidden group cursor-zoom-in aspect-[4/3]"
            >
              {/* Top-left Badges */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 flex flex-wrap gap-2">
                {product.diskonPersen > 0 && (
                  <span className="bg-black text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                    Hemat {product.diskonPersen}%
                  </span>
                )}
                <span className="bg-white/95 backdrop-blur-sm text-neutral-900 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border border-neutral-200">
                  {product.kondisi || 'Second Grade A'}
                </span>
              </div>

              {/* Zoom Hint */}
              <div className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-sm text-neutral-700 text-[10px] font-semibold px-3 py-1.5 rounded-full border border-neutral-200 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                <ZoomIn size={13} />
                <span>Klik perbesar</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIdx}
                  src={images[activeImageIdx]}
                  alt={product.nama}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: isZoomed ? 1.12 : 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="max-h-full max-w-[90%] object-contain drop-shadow-xl"
                />
              </AnimatePresence>
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#f0f0f2] border p-2 transition-all ${
                      activeImageIdx === i
                        ? 'border-black ring-2 ring-black/10 scale-[1.03]'
                        : 'border-neutral-200 opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Sudut ${i + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* QC Verification Strip */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Certified Second-Hand TECHCARE
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    {product.qcSummary || 'Lulus 32 Titik QC Teknisi • Siap Pakai'}
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-center text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {product.garansi || 'Garansi Toko 60 Hari'}
              </span>
            </div>
          </div>

          {/* Right: Info, Dynamic Spec Configurator & Actions (5 cols on lg) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/70 shadow-xs space-y-6">
            {/* Brand, Rating & Title */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-neutral-400">
                  {product.brand} • {product.koleksi}
                </span>
                <div className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-800 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span>{product.rating || '4.9'}</span>
                  <span className="text-neutral-400 font-normal">({product.ulasan || 40})</span>
                </div>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl text-neutral-900 font-medium tracking-tight leading-tight">
                {product.nama}
              </h1>
              <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-neutral-500">
                {product.tagline}
              </p>
            </div>

            {/* Live Dynamic Price */}
            <div className="pb-4 border-b border-neutral-100">
              <div className="flex items-baseline gap-3 flex-wrap">
                <motion.span
                  key={computedPrice}
                  initial={{ opacity: 0.5, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight"
                >
                  {formatIDR(computedPrice)}
                </motion.span>
                {computedOriginalPrice && (
                  <span className="text-sm text-neutral-400 line-through">
                    {formatIDR(computedOriginalPrice)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Stok:{' '}
                <strong className={outOfStock ? 'text-rose-600' : 'text-neutral-900'}>
                  {outOfStock ? 'Stok Habis' : `${product.stok} unit tersedia`}
                </strong>{' '}
                • Berat kirim: <strong className="text-neutral-800">{formatWeight(product.beratGram || 1000)}</strong>
              </p>
            </div>

            {/* DYNAMIC SPEC SELECTOR: RAM */}
            {ramOptions.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                    <Cpu size={14} />
                    <span>Pilih Kapasitas RAM</span>
                  </span>
                  <span className="text-[11px] font-semibold text-neutral-500">
                    {activeRam?.label}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {ramOptions.map((opt, idx) => {
                    const active = idx === selectedRamIdx;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setSelectedRamIdx(idx)}
                        className={`relative py-2.5 px-2.5 rounded-xl border text-left transition-all ${
                          active
                            ? 'border-black bg-black text-white shadow-xs'
                            : 'border-neutral-200 bg-[#fafafa] text-neutral-800 hover:border-neutral-500'
                        }`}
                      >
                        <span className="block text-xs font-bold leading-tight">{opt.label}</span>
                        <span
                          className={`block text-[10px] mt-0.5 ${
                            active ? 'text-neutral-300' : 'text-neutral-400'
                          }`}
                        >
                          {opt.priceDelta > 0 ? `+${formatIDR(opt.priceDelta)}` : 'Standar'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* DYNAMIC SPEC SELECTOR: SSD */}
            {ssdOptions.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                    <HardDrive size={14} />
                    <span>Pilih Kapasitas SSD</span>
                  </span>
                  <span className="text-[11px] font-semibold text-neutral-500">
                    {activeSsd?.label}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {ssdOptions.map((opt, idx) => {
                    const active = idx === selectedSsdIdx;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setSelectedSsdIdx(idx)}
                        className={`relative py-2.5 px-2.5 rounded-xl border text-left transition-all ${
                          active
                            ? 'border-black bg-black text-white shadow-xs'
                            : 'border-neutral-200 bg-[#fafafa] text-neutral-800 hover:border-neutral-500'
                        }`}
                      >
                        <span className="block text-xs font-bold leading-tight">{opt.label}</span>
                        <span
                          className={`block text-[10px] mt-0.5 ${
                            active ? 'text-neutral-300' : 'text-neutral-400'
                          }`}
                        >
                          {opt.priceDelta > 0 ? `+${formatIDR(opt.priceDelta)}` : 'Standar'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* DYNAMIC SPEC SELECTOR: DDR4/DDR5 or Monitor Size */}
            {tierOptions.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                    <Sparkles size={14} />
                    <span>Pilih Tipe / Varian</span>
                  </span>
                  <span className="text-[11px] font-semibold text-neutral-500">
                    {activeTier?.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {tierOptions.map((opt, idx) => {
                    const active = idx === selectedTierIdx;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setSelectedTierIdx(idx)}
                        className={`py-2.5 px-3 rounded-xl border text-left transition-all ${
                          active
                            ? 'border-black bg-black text-white shadow-xs'
                            : 'border-neutral-200 bg-[#fafafa] text-neutral-800 hover:border-neutral-500'
                        }`}
                      >
                        <span className="block text-xs font-bold leading-tight">{opt.label}</span>
                        <span
                          className={`block text-[10px] mt-0.5 ${
                            active ? 'text-neutral-300' : 'text-neutral-400'
                          }`}
                        >
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
                <span className="text-xs text-neutral-600 font-medium">
                  Warna Unit: <strong className="text-neutral-900">{selectedColor}</strong>
                </span>
                <div className="flex items-center gap-2.5">
                  {product.varianWarna.map((v) => (
                    <button
                      key={v.nama}
                      type="button"
                      onClick={() => setSelectedColor(v.nama)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedColor === v.nama
                          ? 'border-black scale-110'
                          : 'border-transparent hover:scale-105'
                      }`}
                      title={v.nama}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-black/15"
                        style={{ backgroundColor: v.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Main Buy Actions */}
            <div ref={actionBtnRef} className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-700">Jumlah Unit:</span>
                <div className="flex items-center border border-neutral-200 rounded-full px-3 py-1.5 space-x-4 bg-[#fafafa]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-neutral-500 hover:text-black active:scale-90"
                    aria-label="Kurangi jumlah"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-xs font-bold min-w-[20px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stok || 10, quantity + 1))}
                    className="text-neutral-500 hover:text-black active:scale-90"
                    aria-label="Tambah jumlah"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2.5">
                <motion.button
                  whileTap={{ scale: outOfStock ? 1 : 0.97 }}
                  disabled={outOfStock}
                  onClick={handleAddToCart}
                  className={`flex-1 transition-all py-3.5 px-5 rounded-full text-xs font-bold tracking-wider uppercase flex items-center justify-center space-x-2 border ${
                    outOfStock
                      ? 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed'
                      : addedFeedback
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white hover:bg-neutral-50 border-neutral-900 text-neutral-900'
                  }`}
                >
                  {addedFeedback ? <Check size={15} /> : <ShoppingBag size={15} />}
                  <span>{outOfStock ? 'Stok Habis' : addedFeedback ? 'Masuk Keranjang!' : 'Keranjang'}</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleWishlist(product)}
                  aria-label={wishlisted ? 'Hapus dari favorit' : 'Simpan ke favorit'}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                    wishlisted
                      ? 'bg-neutral-900 border-neutral-900 text-white'
                      : 'bg-white border-neutral-300 text-neutral-700 hover:border-black hover:text-black'
                  }`}
                >
                  <Heart size={18} className={wishlisted ? 'fill-white' : ''} />
                </motion.button>
              </div>

              <motion.button
                whileTap={{ scale: outOfStock ? 1 : 0.98 }}
                disabled={outOfStock}
                onClick={handleBuyNow}
                className="w-full bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all py-3.5 px-6 rounded-full text-xs font-bold tracking-[0.14em] uppercase shadow-md"
              >
                {outOfStock ? 'Stok Sementara Habis' : `Beli Sekarang • ${formatIDR(computedPrice * quantity)}`}
              </motion.button>
            </div>

            {/* Description & Spec Details */}
            <div className="pt-4 border-t border-neutral-100 space-y-4">
              <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed">
                {product.deskripsi}
              </p>

              {product.fitur && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">
                    Hasil Cek Kondisi & Spesifikasi:
                  </h4>
                  <div className="space-y-2 text-xs text-neutral-600">
                    {product.fitur.map((feat, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <div className="w-4 h-4 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 flex-shrink-0 mt-0.5">
                          <Check size={10} strokeWidth={3} />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-100 text-[10px] sm:text-[11px] text-neutral-600 text-center">
              <div className="flex flex-col items-center space-y-1 bg-[#fafafa] p-2.5 rounded-2xl">
                <ShieldCheck size={16} className="text-neutral-900" />
                <span className="font-semibold">32 Titik QC</span>
              </div>
              <div className="flex flex-col items-center space-y-1 bg-[#fafafa] p-2.5 rounded-2xl">
                <Wrench size={16} className="text-neutral-900" />
                <span className="font-semibold">Free Pasang RAM/SSD</span>
              </div>
              <div className="flex flex-col items-center space-y-1 bg-[#fafafa] p-2.5 rounded-2xl">
                <Truck size={16} className="text-neutral-900" />
                <span className="font-semibold">Tracking Real-Time</span>
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
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
              aria-label="Tutup perbesar"
            >
              <X size={20} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={images[activeImageIdx]}
              alt={product.nama}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[92vw] object-contain rounded-2xl bg-[#f4f4f5] p-6"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile-First Sticky Bottom Buy Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-16 inset-x-0 z-30 md:hidden bg-white/95 backdrop-blur-md border-t border-neutral-200 px-4 py-3 flex items-center justify-between gap-3 shadow-[0_-6px_24px_rgba(0,0,0,0.08)]"
          >
            <div className="min-w-0">
              <p className="text-[10px] text-neutral-500 truncate">
                {specLabel || product.kondisi}
              </p>
              <p className="text-sm font-bold text-neutral-900">
                {formatIDR(computedPrice * quantity)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={outOfStock}
                onClick={handleAddToCart}
                className="p-2.5 rounded-full border border-neutral-900 text-neutral-900 disabled:opacity-40"
                aria-label="Tambah ke keranjang"
              >
                <ShoppingBag size={16} />
              </button>
              <button
                disabled={outOfStock}
                onClick={handleBuyNow}
                className="bg-black text-white disabled:bg-neutral-300 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider"
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
