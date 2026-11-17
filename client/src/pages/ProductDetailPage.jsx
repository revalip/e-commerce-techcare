import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Plus, Minus, ShoppingBag, Truck, Shield, RotateCcw } from 'lucide-react';
import { formatIDR } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Reveal from '../components/Reveal';

export default function ProductDetailPage({ product, onBack, onDirectCheckout }) {
  const { addToCart } = useCart();
  const { isGuest, openAuthModal } = useAuth();
  const [selectedColor, setSelectedColor] = useState(
    product?.varianWarna ? product.varianWarna[0].nama : 'Standard'
  );
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  // Sticky Bar Mobile Trigger: detect when main Buy Button scrolls out of view
  const [showStickyBar, setShowStickyBar] = useState(false);
  const actionBtnRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When main action button is not intersecting (scrolled past), show sticky bar
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (actionBtnRef.current) {
      observer.observe(actionBtnRef.current);
    }
    return () => observer.disconnect();
  }, []);

  if (!product) return null;

  const images = product.gambar && product.gambar.length > 0
    ? product.gambar
    : ['/images/products/novaire-air.svg'];

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor);
    if (isGuest) {
      openAuthModal(
        'login',
        'Silakan masuk atau buat akun baru terlebih dahulu untuk melanjutkan proses checkout.',
        () => onDirectCheckout()
      );
    } else {
      onDirectCheckout();
    }
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen py-8 sm:py-14 pb-28 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Reveal>
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-black mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Katalog</span>
          </button>
        </Reveal>

        {/* Product Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left: Gallery with Zoom & Swipe */}
          <Reveal delay={0.1}>
            <div className="space-y-4">
              <div
                className="bg-white rounded-4xl p-8 sm:p-14 border border-neutral-100 flex items-center justify-center shadow-xs relative overflow-hidden group cursor-crosshair"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              >
                {product.diskonPersen && (
                  <span className="absolute top-6 left-6 bg-black text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                    Diskon {product.diskonPersen}%
                  </span>
                )}

                <motion.img
                  key={activeImageIdx}
                  src={images[activeImageIdx]}
                  alt={product.nama}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: isZoomed ? 1.15 : 1 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="max-h-[360px] sm:max-h-[440px] w-auto object-contain drop-shadow-xl"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex space-x-3 justify-center">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIdx(i)}
                      className={`w-16 h-16 rounded-2xl bg-white border p-1 transition-all ${
                        activeImageIdx === i
                          ? 'border-black ring-1 ring-black'
                          : 'border-neutral-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {/* Right: Info, Variants & Buy Actions */}
          <Reveal delay={0.2}>
            <div className="space-y-6">
              <div>
                <span className="text-[11px] uppercase tracking-[0.24em] font-bold text-neutral-400 block mb-1">
                  {product.tagline} • {product.koleksi}
                </span>
                <h1 className="font-serif text-3xl sm:text-5xl text-neutral-900 font-normal tracking-tight">
                  {product.nama}
                </h1>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3">
                <span className="text-2xl sm:text-3xl font-bold text-neutral-900">
                  {formatIDR(product.harga)}
                </span>
                {product.hargaCoret && (
                  <span className="text-sm text-neutral-400 line-through">
                    {formatIDR(product.hargaCoret)}
                  </span>
                )}
              </div>

              {/* Color Selector */}
              {product.varianWarna && product.varianWarna.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs text-neutral-500 font-medium">
                    Varian Warna: <strong>{selectedColor}</strong>
                  </span>
                  <div className="flex space-x-2.5">
                    {product.varianWarna.map((v) => (
                      <button
                        key={v.nama}
                        onClick={() => setSelectedColor(v.nama)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedColor === v.nama
                            ? 'border-black scale-110'
                            : 'border-transparent hover:scale-105'
                        }`}
                        title={v.nama}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-black/10"
                          style={{ backgroundColor: v.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-neutral-600 leading-relaxed font-light border-y border-neutral-100 py-4">
                {product.deskripsi}
              </p>

              {/* Feature Checklist */}
              {product.fitur && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Spesifikasi Utama:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-600">
                    {product.fitur.map((feat, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 flex-shrink-0">
                          <Check size={10} strokeWidth={3} />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Buy Controls with Ref for Mobile Sticky Detection */}
              <div ref={actionBtnRef} className="space-y-4 pt-4">
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-semibold text-neutral-700">Jumlah:</span>
                  <div className="flex items-center border border-neutral-200 rounded-full px-3 py-1.5 space-x-3 bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-neutral-500 hover:text-black active:scale-90"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-xs font-bold min-w-[20px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-neutral-500 hover:text-black active:scale-90"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => addToCart(product, quantity, selectedColor)}
                    className="flex-1 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-900 transition-all py-3.5 px-6 rounded-full text-xs font-semibold tracking-wider uppercase flex items-center justify-center space-x-2 active:scale-[0.98]"
                  >
                    <ShoppingBag size={15} />
                    <span>Tambah ke Keranjang</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-black text-white hover:bg-neutral-800 transition-all py-3.5 px-6 rounded-full text-xs font-semibold tracking-wider uppercase flex items-center justify-center space-x-2 active:scale-[0.98] shadow-md"
                  >
                    <span>Beli Sekarang</span>
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-neutral-100 text-[11px] text-neutral-500 text-center">
                <div className="flex flex-col items-center space-y-1">
                  <Truck size={16} className="text-neutral-800" />
                  <span>Gratis Pengiriman</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <Shield size={16} className="text-neutral-800" />
                  <span>Garansi Resmi 1 Tahun</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <RotateCcw size={16} className="text-neutral-800" />
                  <span>14 Hari Pengembalian</span>
                </div>
              </div>

            </div>
          </Reveal>

        </div>

      </div>

      {/* Sticky Mobile Add-to-Cart Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 px-4 flex items-center justify-between gap-3 shadow-2xl"
          >
            <div className="flex-1 min-w-0">
              <p className="font-serif text-xs font-bold text-neutral-900 truncate">
                {product.nama}
              </p>
              <p className="text-[11px] font-semibold text-neutral-700">
                {formatIDR(product.harga)}
              </p>
            </div>

            <button
              onClick={() => addToCart(product, quantity, selectedColor)}
              className="bg-black text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase flex items-center space-x-1.5 active:scale-95 shadow-sm"
            >
              <ShoppingBag size={13} />
              <span>Tambah</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
