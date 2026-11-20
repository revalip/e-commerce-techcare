import React, { useState, useEffect, useMemo } from 'react';
import { Search, Heart, SlidersHorizontal, Tag, RotateCcw, AlertCircle, PackageSearch } from 'lucide-react';
import { getProducts, getCollections } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import Reveal from '../components/Reveal';

export default function ShopPage({
  onSelectProduct,
  selectedCategory,
  onSelectCategory,
  initialSearch = ''
}) {
  const { isWishlisted } = useWishlist();
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState(initialSearch);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    setSearch(initialSearch);
    setVisibleCount(8);
  }, [initialSearch]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [prodRes, colRes] = await Promise.all([getProducts(), getCollections()]);
      if (prodRes.success) setProducts(prodRes.data);
      else setError('Gagal memuat daftar produk.');
      if (colRes.success) setCollections(colRes.data);
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

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(selectedBrand) ||
    Boolean(search.trim()) ||
    priceRange !== 'all' ||
    onlyFavorites;

  const resetAllFilters = () => {
    setSearch('');
    setSelectedBrand('');
    setPriceRange('all');
    setOnlyFavorites(false);
    setSortBy('featured');
    onSelectCategory('');
    setVisibleCount(8);
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
        if (sortBy === 'rating_desc') return (Number(b.rating) || 0) - (Number(a.rating) || 0);
        if (sortBy === 'newest')
          return String(b.id).localeCompare(String(a.id), undefined, { numeric: true });
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [products, selectedCategory, selectedBrand, search, sortBy, priceRange, onlyFavorites, isWishlisted]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="bg-[#F4F6FA] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Crisp Retail Catalog Header */}
        <Reveal>
          <div className="bg-gradient-to-r from-[#0B1220] to-[#12264A] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 tc-tech-grid opacity-40 pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#38BDF8] block mb-1">
                  KATALOG PERANGKAT IT • SEMUA &lt; RP 10 JUTA
                </span>
                <h1 className="font-display text-2xl sm:text-4xl font-bold text-white">
                  Katalog Hardware &amp; Upgrade
                </h1>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold text-sky-100 self-start sm:self-auto tabular-nums">
                Menampilkan <strong>{filteredProducts.length}</strong> produk lulus QC
              </span>
            </div>
          </div>
        </Reveal>

        {/* Mobile-First Filter & Search Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-tc-card border border-slate-200/90 space-y-3.5">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari ThinkPad, ASUS, MSI, Logitech, RAM..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(8);
                }}
                className="tc-input pl-10"
              />
            </div>

            {/* Filter Selects & Favorite Toggle */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-[#F8FAFC] px-3 min-h-[44px] rounded-xl border border-slate-200 focus-within:border-[#0B5FFF]">
                <Tag size={13} className="text-[#0B5FFF] shrink-0" />
                <select
                  aria-label="Filter Brand"
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    setVisibleCount(8);
                  }}
                  className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer w-full truncate focus:ring-0"
                >
                  <option value="">Semua Brand</option>
                  {availableBrands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-[#F8FAFC] px-3 min-h-[44px] rounded-xl border border-slate-200 focus-within:border-[#0B5FFF]">
                <SlidersHorizontal size={13} className="text-[#0B5FFF] shrink-0" />
                <select
                  aria-label="Filter Harga"
                  value={priceRange}
                  onChange={(e) => {
                    setPriceRange(e.target.value);
                    setVisibleCount(8);
                  }}
                  className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer w-full truncate focus:ring-0"
                >
                  <option value="all">Semua Harga</option>
                  <option value="under1">&lt; Rp 1 Juta</option>
                  <option value="1to5">Rp 1 – 5 Juta</option>
                  <option value="5to10">Rp 5 – 10 Juta</option>
                </select>
              </div>

              <div className="flex items-center bg-[#F8FAFC] px-3 h-[44px] rounded-xl border border-slate-200 focus-within:border-[#0B5FFF]">
                <select
                  aria-label="Urutkan Produk"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer w-full truncate focus:ring-0"
                >
                  <option value="featured">Urut: Terlaris</option>
                  <option value="newest">Urut: Terbaru</option>
                  <option value="price_asc">Harga Terendah</option>
                  <option value="price_desc">Harga Tertinggi</option>
                  <option value="rating_desc">Rating Tertinggi</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setOnlyFavorites((prev) => !prev)}
                className={`inline-flex items-center justify-center gap-1.5 px-3.5 min-h-[44px] rounded-xl text-xs font-semibold border transition-all ${
                  onlyFavorites
                    ? 'bg-[#FFF7ED] text-[#F97316] border-[#FDBA74]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#0B5FFF] hover:text-[#0B5FFF]'
                }`}
              >
                <Heart size={14} className={onlyFavorites ? 'fill-[#F97316]' : ''} />
                <span>Favorit</span>
              </button>
            </div>
          </div>

          {/* Scrollable Category Pills + Reset */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 flex-1 no-scrollbar">
              <button
                onClick={() => {
                  onSelectCategory('');
                  setVisibleCount(8);
                }}
                className={`text-xs font-semibold px-4 min-h-[40px] rounded-xl whitespace-nowrap transition-all ${
                  !selectedCategory
                    ? 'bg-[#0B5FFF] text-white shadow-tc-primary'
                    : 'bg-[#F4F6FA] text-slate-600 hover:bg-[#EEF4FF] hover:text-[#0B5FFF]'
                }`}
              >
                Semua Kategori
              </button>
              {collections.map((col) => (
                <button
                  key={col.slug}
                  onClick={() => {
                    onSelectCategory(col.slug);
                    setVisibleCount(8);
                  }}
                  className={`text-xs font-semibold px-4 min-h-[40px] rounded-xl whitespace-nowrap transition-all ${
                    selectedCategory === col.slug
                      ? 'bg-[#0B5FFF] text-white shadow-tc-primary'
                      : 'bg-[#F4F6FA] text-slate-600 hover:bg-[#EEF4FF] hover:text-[#0B5FFF]'
                  }`}
                >
                  {col.nama}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="shrink-0 inline-flex items-center gap-1.5 min-h-[40px] text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 rounded-xl border border-rose-200 transition-colors"
              >
                <RotateCcw size={13} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Grid / States */}
        {error ? (
          <div className="bg-white rounded-2xl border border-rose-200 text-center py-14 px-4 space-y-3 shadow-tc-card">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle size={28} />
            </div>
            <p className="font-display text-xl font-bold text-[#0B1220]">Gagal Memuat Katalog</p>
            <p className="text-xs text-slate-500">{error}</p>
            <button onClick={fetchData} className="tc-btn-primary">
              Coba Lagi
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 text-center py-16 px-4 space-y-3 shadow-tc-card">
            <div className="w-14 h-14 rounded-2xl bg-[#EEF4FF] text-[#0B5FFF] flex items-center justify-center mx-auto">
              <PackageSearch size={28} />
            </div>
            <p className="font-display text-xl font-bold text-[#0B1220]">Produk Tidak Ditemukan</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Coba ubah kata kunci pencarian, pilih brand lain, atau atur ulang filter harga dan kategori.
            </p>
            <button onClick={resetAllFilters} className="tc-btn-primary">
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {displayedProducts.map((product, idx) => (
                <Reveal key={product.id} delay={(idx % 4) * 0.04}>
                  <ProductCard product={product} onSelect={onSelectProduct} />
                </Reveal>
              ))}
            </div>

            {hasMore && (
              <div className="text-center pt-4">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="tc-btn-secondary px-8"
                >
                  Tampilkan Lebih Banyak ({filteredProducts.length - visibleCount} produk lagi)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
