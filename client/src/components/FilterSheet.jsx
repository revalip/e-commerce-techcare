import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

/**
 * Apple-style Filter Bottom Sheet (mobile) / Side Sheet (desktop):
 * Houses Brand, Rentang Harga, Urutkan, and Favorit toggle — zero logic changes,
 * keeps ShopPage toolbar clean with max 3 control rows before products!
 */
export default function FilterSheet({
  isOpen,
  onClose,
  availableBrands,
  selectedBrand,
  onSelectBrand,
  priceRange,
  onSelectPriceRange,
  sortBy,
  onSelectSortBy,
  onlyFavorites,
  onToggleFavorites,
  onReset,
  resultCount
}) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const priceOptions = [
    { value: 'all', label: 'Semua Harga' },
    { value: 'under1', label: 'Di bawah Rp 1 Juta' },
    { value: '1to5', label: 'Rp 1 – 5 Juta' },
    { value: '5to10', label: 'Rp 5 – 10 Juta' }
  ];

  const sortOptions = [
    { value: 'featured', label: 'Unggulan' },
    { value: 'newest', label: 'Terbaru' },
    { value: 'price_asc', label: 'Harga Terendah' },
    { value: 'price_desc', label: 'Harga Tertinggi' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[4px]"
          />

          <div className="fixed inset-0 pointer-events-none flex items-end sm:items-center sm:justify-center">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="pointer-events-auto w-full sm:max-w-lg bg-white rounded-t-[28px] sm:rounded-[28px] max-h-[86vh] flex flex-col overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
              role="dialog"
              aria-modal="true"
              aria-label="Filter dan Urutkan Produk"
            >
              {/* Mobile handle */}
              <div className="sm:hidden w-full flex justify-center pt-3">
                <span className="w-10 h-1 rounded-full bg-[#D2D2D7]" />
              </div>

              {/* Header */}
              <div className="px-6 py-4 border-b border-[#D2D2D7]/70 flex items-center justify-between">
                <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">
                  Filter &amp; Urutkan
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center hover:bg-[#E8E8ED] transition-colors"
                  aria-label="Tutup filter"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">
                {/* Favorit Toggle */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[15px] font-semibold text-[#1D1D1F]">Hanya produk favorit</p>
                    <p className="text-[13px] text-[#6E6E73]">Tampilkan unit yang sudah kamu simpan.</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={onlyFavorites}
                    onClick={onToggleFavorites}
                    className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-200 ${
                      onlyFavorites ? 'bg-[#0071E3]' : 'bg-[#D2D2D7]'
                    }`}
                  >
                    <span
                      className={`block w-6 h-6 rounded-full bg-white transition-transform duration-200 ${
                        onlyFavorites ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Urutkan */}
                <div className="space-y-3 pt-5 border-t border-[#D2D2D7]/60">
                  <p className="text-[14px] font-semibold text-[#1D1D1F]">Urutkan</p>
                  <div className="grid grid-cols-2 gap-2">
                    {sortOptions.map((opt) => {
                      const active = sortBy === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => onSelectSortBy(opt.value)}
                          className={`min-h-[42px] px-4 rounded-[12px] text-[14px] text-left flex items-center justify-between transition-colors ${
                            active
                              ? 'bg-[#1D1D1F] text-white font-medium'
                              : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {active && <Check size={14} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rentang Harga */}
                <div className="space-y-3 pt-5 border-t border-[#D2D2D7]/60">
                  <p className="text-[14px] font-semibold text-[#1D1D1F]">Rentang Harga</p>
                  <div className="flex flex-wrap gap-2">
                    {priceOptions.map((opt) => {
                      const active = priceRange === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => onSelectPriceRange(opt.value)}
                          className={`min-h-[38px] px-4 rounded-[980px] text-[13px] transition-colors ${
                            active
                              ? 'bg-[#1D1D1F] text-white font-medium'
                              : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Brand */}
                <div className="space-y-3 pt-5 border-t border-[#D2D2D7]/60">
                  <p className="text-[14px] font-semibold text-[#1D1D1F]">Merek</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectBrand('')}
                      className={`min-h-[38px] px-4 rounded-[980px] text-[13px] transition-colors ${
                        !selectedBrand
                          ? 'bg-[#1D1D1F] text-white font-medium'
                          : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
                      }`}
                    >
                      Semua Merek
                    </button>
                    {availableBrands.map((brand) => {
                      const active = selectedBrand === brand;
                      return (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => onSelectBrand(brand)}
                          className={`min-h-[38px] px-4 rounded-[980px] text-[13px] transition-colors ${
                            active
                              ? 'bg-[#1D1D1F] text-white font-medium'
                              : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
                          }`}
                        >
                          {brand}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 border-t border-[#D2D2D7]/70 bg-white flex items-center gap-3">
                <button
                  type="button"
                  onClick={onReset}
                  className="min-h-[44px] px-5 rounded-[980px] bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[14px] text-[#1D1D1F] transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="tc-btn-primary flex-1 text-[15px]"
                >
                  Tampilkan {resultCount} Produk
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
