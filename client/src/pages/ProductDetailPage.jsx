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
  ZoomIn,
  X,
  Cpu,
  HardDrive,
  Layers,
  Scale
} from 'lucide-react';
import { formatIDR, formatWeight } from '../utils/format';
import { mockProducts } from '../data/mock';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductDetailPage({ product, onBack, onDirectCheckout, onSelectProduct }) {
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

  // Varian warna aktif saat ini
  const activeColorVariant = useMemo(() => {
    if (!product?.varianWarna || product.varianWarna.length === 0) return null;
    return (
      product.varianWarna.find((v) => v.nama === selectedColor) ||
      product.varianWarna[0]
    );
  }, [product, selectedColor]);

  // Gallery foto aktif sesuai varian warna yang dipilih (persis konsep Digimap & Apple Store)
  const activeGallery = useMemo(() => {
    if (activeColorVariant?.gallery && activeColorVariant.gallery.length > 0) {
      return activeColorVariant.gallery;
    }
    if (activeColorVariant?.gambar) {
      return [activeColorVariant.gambar];
    }
    return product?.gambar && product.gambar.length > 0
      ? product.gambar
      : ['/assets/products/thinkpad-x1-carbon-front.png'];
  }, [activeColorVariant, product]);

  const currentMainImage = activeGallery[activeImageIdx] || activeGallery[0];

  useEffect(() => {
    const initialVariant = product?.varianWarna?.[0];
    setSelectedColor(initialVariant?.nama || 'Standard');
    setSelectedRamIdx(0);
    setSelectedSsdIdx(0);
    setSelectedTierIdx(0);
    setActiveImageIdx(0);
    setQuantity(1);
    setLightboxOpen(false);
  }, [product?.id]);

  const handleSelectColor = (v) => {
    setSelectedColor(v.nama);
    setActiveImageIdx(0); // Tampilkan foto pertama dari varian warna yang diklik
  };

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
  const selectedGambar = currentMainImage;

  const handleAddToCart = () => {
    if (outOfStock) return;
    addToCart(product, quantity, selectedColor, {
      ram: activeRam?.label || null,
      ssd: activeSsd?.label || null,
      tier: activeTier?.label || null,
      specLabel,
      harga: computedPrice,
      gambar: selectedGambar
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
      harga: computedPrice,
      gambar: selectedGambar
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
      className="bg-white py-6 sm:py-10 pb-28 sm:pb-16"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Apple-style Minimal Breadcrumb */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 min-h-[38px] text-xs font-medium text-[#0071E3] hover:underline transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Katalog</span>
          </button>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#6E6E73]">
            <span>{product.koleksi}</span>
            <span>/</span>
            <span className="font-medium text-[#1D2129]">{product.brand}</span>
          </span>
        </div>

        {/* Main 2-Column Apple Store Configurator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Sticky Hardware Studio Gallery */}
          <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-20">
            <div
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onClick={() => setLightboxOpen(true)}
              className="bg-[#F5F5F7] rounded-[28px] p-6 sm:p-10 flex items-center justify-center relative overflow-hidden group cursor-zoom-in aspect-[4/3]"
            >
              <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                {product.diskonPersen > 0 && (
                  <span className="bg-white/95 text-[#D70015] text-[12px] font-medium px-3 py-1 rounded-[980px]">
                    Hemat {product.diskonPersen}%
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 right-4 z-10 bg-white/90 text-[#1D2129] text-[11px] font-medium px-3 py-1.5 rounded-full border border-[#E2E7EE] flex items-center gap-1.5">
                <ZoomIn size={13} />
                <span>Perbesar</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.img
                  key={`${selectedColor}-${activeImageIdx}-${currentMainImage}`}
                  src={currentMainImage}
                  alt={`${product.nama} - ${selectedColor}`}
                  loading="eager"
                  decoding="async"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: isZoomed ? 1.06 : 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.22 }}
                  className="max-h-full max-w-[90%] object-contain"
                />
              </AnimatePresence>
            </div>

            {activeGallery.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {activeGallery.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImageIdx(i)}
                    className={`w-20 h-20 rounded-2xl bg-[#F5F5F7] border p-2 shrink-0 transition-all ${
                      activeImageIdx === i
                        ? 'border-[#0071E3] ring-2 ring-[#0071E3]/20'
                        : 'border-[#E2E7EE] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.nama} ${selectedColor} sudut ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* QC Verification Card (Borderless Apple #F5F5F7) */}
            <div className="bg-[#F5F5F7] rounded-[20px] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white text-[#0071E3] flex items-center justify-center shrink-0">
                  <ShieldCheck size={19} strokeWidth={1.7} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#1D1D1F]">
                    Certified Pre-Owned TechCare
                  </p>
                  <p className="text-[13px] text-[#6E6E73]">
                    {product.qcSummary || 'Lulus 32 Titik QC Teknisi · Siap Pakai'}
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-center text-[12px] font-medium px-3.5 py-1.5 rounded-[980px] bg-white text-[#1D1D1F] shrink-0">
                {product.garansi || 'Garansi Toko 60 Hari'}
              </span>
            </div>
          </div>

          {/* Right: Step-by-Step Apple Store Configurator */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2 border-b border-[#D2D2D7]/70 pb-5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] text-[#0071E3] font-medium">
                  {product.brand} • {product.koleksi}
                </span>
                {product.kondisi && (
                  <span className="text-[12px] px-2.5 py-0.5 rounded-[980px] bg-[#F5F5F7] text-[#1D1D1F] font-medium">
                    {product.kondisi}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#1D1D1F] leading-tight">
                {product.nama}
              </h1>
              <p className="text-[14px] text-[#6E6E73]">{product.tagline}</p>

              <div className="pt-2 flex items-baseline gap-2.5 flex-wrap">
                <span className="text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tabular-nums">
                  {formatIDR(computedPrice)}
                </span>
                {computedOriginalPrice && (
                  <span className="text-sm text-[#6E6E73] line-through tabular-nums">
                    {formatIDR(computedOriginalPrice)}
                  </span>
                )}
              </div>

              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-[13px] text-[#6E6E73] pt-1">
                <span>
                  Stok:{' '}
                  <strong className={outOfStock ? 'text-[#B64400]' : Number(product.stok) <= 3 ? 'text-[#B64400]' : 'text-[#1D1D1F]'}>
                    {outOfStock ? 'Habis' : `${product.stok} unit siap kirim`}
                  </strong>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Scale size={13} />
                  <span>{formatWeight(product.beratGram || 1000)}</span>
                </span>
              </div>
              {!outOfStock && Number(product.stok) <= 4 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF2EB] text-[#B64400] text-[12px] font-medium mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B64400] animate-pulse" />
                  <span>Stok terbatas — tersisa {product.stok} unit</span>
                </div>
              )}
            </div>

            {/* Color Selector */}
            {product.varianWarna && product.varianWarna.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-xs font-medium text-[#1D2129] block">
                  Warna. <span className="text-[#6E6E73]">Pilih tampilan favoritmu: {selectedColor}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {product.varianWarna.map((v) => (
                    <button
                      key={v.nama}
                      type="button"
                      onClick={() => handleSelectColor(v)}
                      aria-label={`Pilih warna ${v.nama}`}
                      className="w-11 h-11 rounded-full flex items-center justify-center transition-transform cursor-pointer hover:scale-105"
                      title={v.nama}
                    >
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                          selectedColor === v.nama ? 'border-[#0071E3]' : 'border-transparent'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-black/15"
                          style={{ backgroundColor: v.hex }}
                        />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* RAM Selector */}
            {ramOptions.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1D2129] flex items-center gap-1.5">
                    <Cpu size={14} className="text-[#0071E3]" /> Memori (RAM)
                  </span>
                  <span className="text-[#6E6E73]">{activeRam?.label}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {ramOptions.map((opt, idx) => {
                    const active = idx === selectedRamIdx;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setSelectedRamIdx(idx)}
                        className={`min-h-[54px] py-2 px-3 rounded-2xl border text-left transition-all ${
                          active
                            ? 'border-[#0071E3] bg-[#0071E3]/5 text-[#1D2129] ring-1 ring-[#0071E3]'
                            : 'border-[#DCE2EA] bg-white text-[#1D2129] hover:border-[#8692A3]'
                        }`}
                      >
                        <span className="block text-xs font-semibold leading-tight">{opt.label}</span>
                        <span className={`block text-[10px] mt-0.5 tabular-nums ${active ? 'text-[#0071E3] font-medium' : 'text-[#6E6E73]'}`}>
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
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1D2129] flex items-center gap-1.5">
                    <HardDrive size={14} className="text-[#0071E3]" /> Penyimpanan (SSD)
                  </span>
                  <span className="text-[#6E6E73]">{activeSsd?.label}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {ssdOptions.map((opt, idx) => {
                    const active = idx === selectedSsdIdx;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setSelectedSsdIdx(idx)}
                        className={`min-h-[54px] py-2 px-3 rounded-2xl border text-left transition-all ${
                          active
                            ? 'border-[#0071E3] bg-[#0071E3]/5 text-[#1D2129] ring-1 ring-[#0071E3]'
                            : 'border-[#DCE2EA] bg-white text-[#1D2129] hover:border-[#8692A3]'
                        }`}
                      >
                        <span className="block text-xs font-semibold leading-tight">{opt.label}</span>
                        <span className={`block text-[10px] mt-0.5 tabular-nums ${active ? 'text-[#0071E3] font-medium' : 'text-[#6E6E73]'}`}>
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
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1D1D1F] flex items-center gap-1.5">
                    <Layers size={14} className="text-[#0071E3]" /> Pilih Varian
                  </span>
                  <span className="text-[#6E6E73]">{activeTier?.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {tierOptions.map((opt, idx) => {
                    const active = idx === selectedTierIdx;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setSelectedTierIdx(idx)}
                        className={`min-h-[54px] py-2 px-3 rounded-2xl border text-left transition-all ${
                          active
                            ? 'border-[#0071E3] bg-[#0071E3]/5 text-[#1D2129] ring-1 ring-[#0071E3]'
                            : 'border-[#DCE2EA] bg-white text-[#1D2129] hover:border-[#8692A3]'
                        }`}
                      >
                        <span className="block text-xs font-semibold leading-tight">{opt.label}</span>
                        <span className={`block text-[10px] mt-0.5 tabular-nums ${active ? 'text-[#0071E3] font-medium' : 'text-[#6E6E73]'}`}>
                          {opt.priceDelta > 0 ? `+${formatIDR(opt.priceDelta)}` : 'Standar'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity & Action Buttons */}
            <div ref={actionBtnRef} className="space-y-3 pt-2 border-t border-[#E2E7EE]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#6E6E73]">Jumlah</span>
                <div className="inline-flex items-center border border-[#DCE2EA] rounded-full bg-[#F7F8FA]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#4F627A] hover:text-[#1D2129]"
                    aria-label="Kurangi jumlah"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-semibold min-w-[26px] text-center tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        Math.min(
                          Math.max(1, Number.isFinite(Number(product.stok)) ? Number(product.stok) : 1),
                          quantity + 1
                        )
                      )
                    }
                    className="w-10 h-10 flex items-center justify-center text-[#4F627A] hover:text-[#1D2129]"
                    aria-label="Tambah jumlah"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  disabled={outOfStock}
                  onClick={handleAddToCart}
                  className={`flex-1 min-h-[46px] px-4 rounded-full text-xs sm:text-sm font-medium flex items-center justify-center gap-2 border transition-all ${
                    outOfStock
                      ? 'bg-[#ECEFF4] border-[#E2E7EE] text-[#8692A3] cursor-not-allowed'
                      : addedFeedback
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-[#F5F5F7] hover:bg-[#ECEFF4] border-[#DCE2EA] text-[#1D2129]'
                  }`}
                >
                  {addedFeedback ? <Check size={16} /> : <ShoppingBag size={16} />}
                  <span>
                    {outOfStock ? 'Stok Habis' : addedFeedback ? 'Masuk Keranjang!' : '+ Tas Belanja'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  aria-label={wishlisted ? 'Hapus dari favorit' : 'Simpan ke favorit'}
                  className="w-12 min-h-[46px] rounded-full border border-[#DCE2EA] bg-[#F7F8FA] hover:border-[#BAC4D2] flex items-center justify-center shrink-0 transition-all"
                >
                  <Heart
                    size={18}
                    className={wishlisted ? 'fill-[#FF3B30] text-[#FF3B30]' : 'text-[#6E6E73]'}
                  />
                </button>
              </div>

              <button
                type="button"
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
            <div className="pt-4 border-t border-[#E2E7EE] space-y-4">
              <p className="text-xs sm:text-sm text-[#4F627A] leading-relaxed">{product.deskripsi}</p>

              {product.fitur && (
                <div className="space-y-2">
                  <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[#1D2129]">
                    Spesifikasi &amp; Hasil QC Teknisi
                  </h4>
                  <div className="space-y-2 text-xs text-[#4F627A]">
                    {product.fitur.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={10} strokeWidth={3} />
                        </span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Apple-style Trust Signals */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E2E7EE] text-[11px] text-[#1D2129] text-center">
              <div className="flex flex-col items-center gap-1 bg-[#F5F5F7] p-2.5 rounded-2xl">
                <ShieldCheck size={16} className="text-[#0071E3]" />
                <span className="font-medium">32 Titik QC</span>
              </div>
              <div className="flex flex-col items-center gap-1 bg-[#F5F5F7] p-2.5 rounded-2xl">
                <Wrench size={16} className="text-[#0071E3]" />
                <span className="font-medium">Free Pasang</span>
              </div>
              <div className="flex flex-col items-center gap-1 bg-[#F5F5F7] p-2.5 rounded-2xl">
                <Truck size={16} className="text-[#0071E3]" />
                <span className="font-medium">JNE / J&amp;T</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ecosystem Pairing */}
        {(() => {
          const slug = product.koleksiSlug;
          const targetSlugs =
            slug === 'laptop-second'
              ? ['ram-memori', 'ssd-storage', 'peripherals']
              : slug === 'display-monitor'
              ? ['peripherals', 'laptop-second']
              : slug === 'ram-memori' || slug === 'ssd-storage'
              ? ['laptop-second', 'ssd-storage', 'ram-memori']
              : ['laptop-second', 'display-monitor'];

          const paired = [];
          for (const target of targetSlugs) {
            const match = mockProducts.find(
              (item) => item.koleksiSlug === target && item.id !== product.id && !paired.some((p) => p.id === item.id)
            );
            if (match) paired.push(match);
          }
          if (paired.length === 0) return null;

          return (
            <section className="mt-14 pt-10 border-t border-[#E2E7EE]">
              <div className="mb-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#6E6E73]">
                  Rekomendasi Ekosistem
                </p>
                <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-[-0.03em] text-[#1D2129] mt-1">
                  Lengkapi setup kamu
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {paired.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectProduct && onSelectProduct(item)}
                    className="group text-left bg-[#F5F5F7] hover:bg-[#ECEFF4] border border-[#E2E7EE] rounded-2xl p-4 flex items-center gap-3.5 transition-all"
                  >
                    <div className="w-16 h-16 rounded-xl bg-white overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={item.gambar?.[0] || '/images/products/thinkpad-x1-carbon-front.jpg'}
                        alt={item.nama}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#6E6E73] block truncate">
                        {item.koleksi}
                      </span>
                      <p className="font-display text-xs sm:text-sm font-medium text-[#1D2129] line-clamp-1 mt-0.5">
                        {item.nama}
                      </p>
                      <p className="font-display text-xs font-semibold text-[#0071E3] mt-1 tabular-nums">
                        {formatIDR(item.harga)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          );
        })()}
      </div>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-[#1D2129]/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
              aria-label="Tutup perbesar"
            >
              <X size={20} />
            </button>
            <img
              src={currentMainImage}
              alt={`${product.nama} - ${selectedColor}`}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[92vw] object-contain rounded-[24px] bg-white p-6"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Bottom Buy Bar (Apple Liquid Glass) */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-white/85 backdrop-blur-xl border-t border-black/10 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="text-[12px] text-[#6E6E73] truncate">{specLabel || product.kondisi}</p>
              <p className="text-[15px] font-semibold text-[#1D1D1F] tabular-nums">
                {formatIDR(computedPrice * quantity)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={outOfStock}
                onClick={handleAddToCart}
                className="w-11 h-11 rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] flex items-center justify-center disabled:opacity-40 cursor-pointer"
                aria-label="Tambah ke keranjang"
              >
                <ShoppingBag size={18} strokeWidth={1.7} />
              </button>
              <button
                type="button"
                disabled={outOfStock}
                onClick={handleBuyNow}
                className="h-[44px] px-5 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-normal disabled:opacity-40 transition-colors cursor-pointer"
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
