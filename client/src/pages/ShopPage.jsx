import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  Check,
  ChevronRight,
  AlertCircle,
  PackageSearch,
  X
} from 'lucide-react';
import { getProducts, getCollections, getDiscounts } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatIDR } from '../utils/format';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import FilterSheet from '../components/FilterSheet';

/**
 * Apple.com/id Simplified Catalog (Max 3 control rows before products):
 * - Header: Giant "Katalog" + 1 plain grey line ("13 unit tersedia"), zero mono/pills.
 * - Row 1: Borderless #F5F5F7 search bar (12px radius) + single "Filter" button opening FilterSheet.
 * - Row 2: Horizontal category chips (active black fill, inactive #F5F5F7 no border) + 2 tiny Grid/List icons.
 * - Row 3: Thin 1-line tap-to-copy promo banner.
 * All existing filter/sort/promo/wishlist/cart logic preserved identically.
 */
export default function ShopPage({
  onSelectProduct,
  selectedCategory,
  onSelectCategory,
  initialSearch = ''
}) {
  const { isWishlisted } = useWishlist();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [copiedKode, setCopiedKode] = useState('');
  const [promoIndex, setPromoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState(initialSearch);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef(null);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [viewMode, setViewMode] = useState('img'); // 'img' | 'txt'
  const [visibleCount, setVisibleCount] = useState(12);
  const [quickAddedId, setQuickAddedId] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    setSearch(initialSearch);
    setVisibleCount(12);
  }, [initialSearch]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [prodRes, colRes, discRes] = await Promise.all([
        getProducts(),
        getCollections(),
        getDiscounts()
      ]);
      if (prodRes.success) setProducts(prodRes.data);
      else setError('Gagal memuat daftar produk.');
      if (colRes.success) setCollections(colRes.data);
      if (discRes.success) {
        const today = new Date().toISOString().slice(0, 10);
        setDiscounts(
          discRes.data.filter(
            (d) =>
              d.aktif &&
              (!d.kuota || d.terpakai < d.kuota) &&
              (!d.berlakuSampai || d.berlakuSampai >= today)
          )
        );
      }
    } catch {
      setError('Terjadi kendala saat memuat katalog. Silakan muat ulang.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const availableBrands = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const activeFilterCount =
    (selectedBrand ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0) +
    (sortBy !== 'featured' ? 1 : 0) +
    (onlyFavorites ? 1 : 0);

  const resetAllFilters = () => {
    setSearch('');
    setSelectedBrand('');
    setPriceRange('all');
    setOnlyFavorites(false);
    setSortBy('featured');
    setViewMode('img');
    onSelectCategory('');
    setVisibleCount(12);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        const matchesCategory = !selectedCategory || item.koleksiSlug === selectedCategory;
        const matchesBrand =
          !selectedBrand || (item.brand || '').toLowerCase() === selectedBrand.toLowerCase();

        const q = search.trim().toLowerCase();
        const matchesSearch =
          !q ||
          item.nama.toLowerCase().includes(q) ||
          (item.brand || '').toLowerCase().includes(q) ||
          (item.tagline || '').toLowerCase().includes(q) ||
          (item.deskripsi || '').toLowerCase().includes(q) ||
          (item.koleksi || '').toLowerCase().includes(q);

        const price = Number(item.harga) || 0;
        const matchesPrice =
          priceRange === 'all'
            ? true
            : priceRange === 'under1'
            ? price < 1000000
            : priceRange === '1to5'
            ? price >= 1000000 && price <= 5000000
            : price > 5000000;

        const matchesFav = !onlyFavorites || isWishlisted(item.id);
        return matchesCategory && matchesBrand && matchesSearch && matchesPrice && matchesFav;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.harga - b.harga;
        if (sortBy === 'price_desc') return b.harga - a.harga;
        if (sortBy === 'newest')
          return String(b.id).localeCompare(String(a.id), undefined, { numeric: true });
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [products, selectedCategory, selectedBrand, search, sortBy, priceRange, onlyFavorites, isWishlisted]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;
  const currentPromo = discounts[promoIndex % Math.max(discounts.length, 1)] || null;

  const handleQuickAdd = (e, product) => {
    e.stopPropagation();
    if (Number(product.stok) <= 0) return;
    addToCart(product, 1);
    setQuickAddedId(product.id);
    setTimeout(() => setQuickAddedId(null), 900);
  };

  const handleCopyPromo = () => {
    if (!currentPromo) return;
    navigator.clipboard?.writeText(currentPromo.kode);
    setCopiedKode(currentPromo.kode);
    setTimeout(() => {
      setCopiedKode('');
      if (discounts.length > 1) {
        setPromoIndex((i) => (i + 1) % discounts.length);
      }
    }, 1800);
  };

  const shortCategoryLabel = (col) => {
    const map = {
      'laptop-second': 'Laptop',
      'ram-memori': 'RAM',
      'ssd-storage': 'SSD',
      'display-monitor': 'Monitor',
      peripherals: 'Aksesori'
    };
    return map[col.slug] || col.nama.replace(/\s*Second\b/i, '').trim();
  };

  return (
    <div className="bg-white overflow-x-clip pb-16">
      {/* 1. Authentic Apple Store Full-Width Top Announcement Ribbon */}
      {currentPromo && (
        <div className="w-full bg-[#F5F5F7] border-b border-[#D2D2D7]/60">
          <button
            type="button"
            onClick={handleCopyPromo}
            className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-center gap-1.5 text-[13px] text-[#1D1D1F] hover:opacity-80 transition-opacity text-center cursor-pointer"
          >
            {copiedKode === currentPromo.kode ? (
              <span className="inline-flex items-center gap-1.5 text-[#0071E3] font-medium">
                <Check size={14} />
                <span>Kode {currentPromo.kode} disalin — tempel saat checkout</span>
              </span>
            ) : (
              <>
                <span>
                  Pakai kode <strong>{currentPromo.kode}</strong>,{' '}
                  <span className="text-[#D70015] font-medium">
                    hemat{' '}
                    {currentPromo.tipe === 'persen'
                      ? `${currentPromo.nilai}%`
                      : formatIDR(currentPromo.nilai)}
                  </span>
                </span>
                <ChevronRight size={14} className="text-[#D70015] shrink-0" />
              </>
            )}
          </button>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-5 sm:pt-14 space-y-5 sm:space-y-9">
        {/* 2. Iconic Apple Store Editorial Header + Compact Right Search/Filter */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-5">
          <div className="max-w-2xl space-y-1">
            <h1 className="text-[28px] sm:text-[44px] font-semibold tracking-[-0.03em] leading-[1.08] text-[#1D1D1F]">
              Katalog.{' '}
              <span className="text-[#6E6E73]">
                Perangkat pilihan, siap kerja.
              </span>
            </h1>
            <p className="text-[13px] sm:text-[14px] text-[#6E6E73] tabular-nums">
              {filteredProducts.length} unit tersedia · Lulus 32 titik QC
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full lg:w-auto">
            {/* Native iOS 17 UISearchBar */}
            <div className="relative flex-1 lg:w-[270px]">
              <Search
                size={15}
                strokeWidth={1.9}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93] pointer-events-none"
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Cari produk"
                value={search}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(12);
                }}
                className="w-full h-[38px] sm:h-[40px] pl-9 pr-8 rounded-[10px] bg-[#767680]/[0.12] text-[15px] text-[#1D1D1F] placeholder:text-[#8E8E93] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:bg-[#767680]/[0.16] transition-colors"
              />
              {search && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setSearch('');
                    setVisibleCount(12);
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Hapus pencarian"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-[#8E8E93] hover:bg-[#6E6E73] text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={11} strokeWidth={2.5} />
                </button>
              )}
            </div>

            {searchFocused || search ? (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setSearch('');
                  setVisibleCount(12);
                  setSearchFocused(false);
                  searchInputRef.current?.blur();
                }}
                className="shrink-0 h-[38px] sm:h-[40px] px-1.5 text-[15px] font-normal text-[#0071E3] hover:opacity-75 transition-opacity cursor-pointer"
              >
                Batal
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setFilterOpen(true)}
                className={`shrink-0 inline-flex items-center gap-2 h-[38px] sm:h-[40px] px-3.5 rounded-[10px] text-[14px] font-medium transition-colors cursor-pointer ${
                  activeFilterCount > 0
                    ? 'bg-[#1D1D1F] text-white'
                    : 'bg-[#767680]/[0.12] text-[#1D1D1F] hover:bg-[#767680]/[0.18]'
                }`}
              >
                <SlidersHorizontal size={14} strokeWidth={1.8} />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#0071E3] text-white text-[11px] flex items-center justify-center tabular-nums">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </header>

        {/* 3. Concise Full-Width Apple Category Pills */}
        <section aria-label="Kategori Katalog">
          <div className="relative min-w-0">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 pr-5 sm:pr-0">
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('');
                  setVisibleCount(12);
                }}
                className={`min-h-[36px] sm:min-h-[38px] px-3.5 sm:px-4 rounded-[980px] text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
                  !selectedCategory
                    ? 'bg-[#1D1D1F] text-white font-medium'
                    : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
                }`}
              >
                Semua
              </button>
              {collections.map((col) => (
                <button
                  key={col.slug}
                  type="button"
                  onClick={() => {
                    onSelectCategory(col.slug);
                    setVisibleCount(12);
                  }}
                  className={`min-h-[36px] sm:min-h-[38px] px-3.5 sm:px-4 rounded-[980px] text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === col.slug
                      ? 'bg-[#1D1D1F] text-white font-medium'
                      : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
                  }`}
                >
                  {shortCategoryLabel(col)}
                </button>
              ))}
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-white to-transparent sm:hidden"
            />
          </div>
        </section>

        {/* Error State */}
        {error && (
          <div className="bg-[#F5F5F7] rounded-[28px] p-8 text-center space-y-3">
            <AlertCircle size={24} className="text-[#B64400] mx-auto" />
            <p className="text-[15px] font-medium text-[#1D1D1F]">{error}</p>
            <button type="button" onClick={fetchData} className="tc-btn-primary">
              Coba Lagi
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="bg-[#F5F5F7] rounded-[28px] p-12 text-center space-y-3">
            <PackageSearch size={28} strokeWidth={1.5} className="text-[#6E6E73] mx-auto" />
            <h3 className="text-[19px] font-semibold text-[#1D1D1F]">Produk tidak ditemukan</h3>
            <p className="text-[14px] text-[#6E6E73] max-w-sm mx-auto">
              Ubah kata kunci pencarian atau atur ulang filter untuk melihat semua unit yang tersedia.
            </p>
            <button type="button" onClick={resetAllFilters} className="tc-btn-primary mt-2">
              Reset Filter
            </button>
          </div>
        )}

        {/* Product Grid View */}
        {!loading && !error && displayedProducts.length > 0 && viewMode === 'img' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
            ))}
          </div>
        )}

        {/* Clean List View */}
        {!loading && !error && displayedProducts.length > 0 && viewMode === 'txt' && (
          <div className="divide-y divide-[#D2D2D7]/70 border-y border-[#D2D2D7]/70">
            {displayedProducts.map((product) => {
              const stockNum = Number(product.stok) || 0;
              const outOfStock = stockNum <= 0;
              const lowStock = !outOfStock && stockNum <= 3;
              const isAdded = quickAddedId === product.id;

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="py-5 flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-16 rounded-2xl bg-[#F5F5F7] p-2 flex items-center justify-center shrink-0">
                      <img
                        src={product.gambar?.[0] || '/assets/products/thinkpad-x1-carbon-front.png'}
                        alt={product.nama}
                        width={64}
                        height={64}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[16px] font-semibold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors truncate">
                        {product.nama}
                      </h3>
                      <p className="text-[13px] text-[#6E6E73] truncate">
                        {product.specRangeLabel || product.tagline}
                      </p>
                      <div className="flex items-baseline gap-2 sm:hidden mt-1">
                        <span className="text-[14px] font-semibold text-[#1D1D1F] tabular-nums">
                          {formatIDR(product.harga)}
                        </span>
                        {product.hargaCoret && (
                          <span className="text-[12px] text-[#6E6E73] line-through tabular-nums">
                            {formatIDR(product.hargaCoret)}
                          </span>
                        )}
                      </div>
                      {lowStock && (
                        <span className="text-[12px] text-[#B64400]">Sisa {stockNum}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-[15px] font-semibold text-[#1D1D1F] tabular-nums">
                        {formatIDR(product.harga)}
                      </p>
                      {product.hargaCoret && (
                        <p className="text-[12px] text-[#6E6E73] line-through tabular-nums">
                          {formatIDR(product.hargaCoret)}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={outOfStock}
                      onClick={(e) => handleQuickAdd(e, product)}
                      className={`min-h-[40px] px-4 rounded-[980px] text-[13px] transition-colors cursor-pointer ${
                        outOfStock
                          ? 'bg-[#F5F5F7] text-[#6E6E73] cursor-not-allowed'
                          : isAdded
                          ? 'bg-[#1D1D1F] text-white'
                          : 'bg-[#0071E3] text-white hover:bg-[#0077ED]'
                      }`}
                    >
                      {outOfStock ? 'Habis' : isAdded ? 'Masuk' : 'Beli'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {!loading && !error && hasMore && (
          <div className="pt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="tc-btn-secondary"
            >
              Muat lebih banyak ({filteredProducts.length - displayedProducts.length} lagi)
            </button>
          </div>
        )}
      </div>

      {/* Filter Bottom Sheet */}
      <FilterSheet
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        availableBrands={availableBrands}
        selectedBrand={selectedBrand}
        onSelectBrand={(val) => {
          setSelectedBrand(val);
          setVisibleCount(12);
        }}
        priceRange={priceRange}
        onSelectPriceRange={(val) => {
          setPriceRange(val);
          setVisibleCount(12);
        }}
        sortBy={sortBy}
        onSelectSortBy={setSortBy}
        onlyFavorites={onlyFavorites}
        onToggleFavorites={() => {
          setOnlyFavorites((prev) => !prev);
          setVisibleCount(12);
        }}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onReset={resetAllFilters}
        resultCount={filteredProducts.length}
      />
    </div>
  );
}
