import React, { useState, useEffect, useMemo } from 'react';
import { Search, Heart, SlidersHorizontal, Tag, RotateCcw, AlertCircle } from 'lucide-react';
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
  const [priceRange, setPriceRange] = useState('all'); // 'all' | 'under1' | '1to5' | '5to10'
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

  // Daftar brand unik secara dinamis dari katalog aktif
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
        if (sortBy === 'newest') return String(b.id).localeCompare(String(a.id), undefined, { numeric: true });
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [products, selectedCategory, selectedBrand, search, sortBy, priceRange, onlyFavorites, isWishlisted]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="bg-[#f9f9f8] min-h-screen py-6 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-2.5">
            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-neutral-400 block mb-1">
                KATALOG CERTIFIED SECOND-HAND • SEMUA &lt; RP 10 JUTA
              </span>
              <h1 className="font-serif text-2xl sm:text-4xl text-neutral-900 tracking-tight">
                Perangkat IT Second & Komponen Upgrade
              </h1>
            </div>
            <span className="text-xs text-neutral-500 font-medium">
              Menampilkan <strong className="text-neutral-900">{filteredProducts.length}</strong> produk lulus QC
            </span>
          </div>
        </Reveal>

        {/* Clean Filter & Search Toolbar (Mobile-First) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-neutral-200/70 mb-6 sm:mb-8 space-y-3.5">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Cari ThinkPad, ASUS, MSI, Logitech, RAM..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(8);
                }}
                className="w-full pl-10 pr-4 py-2.5 min-h-[42px] bg-[#f5f5f4] rounded-full text-xs outline-none border border-transparent focus:border-black focus:bg-white transition-all"
              />
            </div>

            {/* Brand, Price, Favorite & Sort Controls */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
              {/* Brand Filter */}
              <div className="flex items-center gap-1.5 bg-[#f5f5f4] px-3 py-2 min-h-[40px] rounded-full border border-neutral-200/70">
                <Tag size={12} className="text-neutral-500 shrink-0" />
                <select
                  aria-label="Filter Brand"
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    setVisibleCount(8);
                  }}
                  className="bg-transparent text-xs font-semibold text-neutral-800 outline-none cursor-pointer w-full truncate"
                >
                  <option value="">Semua Brand</option>
                  {availableBrands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div className="flex items-center gap-1.5 bg-[#f5f5f4] px-3 py-2 min-h-[40px] rounded-full border border-neutral-200/70">
                <SlidersHorizontal size={12} className="text-neutral-500 shrink-0" />
                <select
                  aria-label="Filter Harga"
                  value={priceRange}
                  onChange={(e) => {
                    setPriceRange(e.target.value);
                    setVisibleCount(8);
                  }}
                  className="bg-transparent text-xs font-semibold text-neutral-800 outline-none cursor-pointer w-full truncate"
                >
                  <option value="all">Semua Harga</option>
                  <option value="under1">&lt; Rp 1 Juta</option>
                  <option value="1to5">Rp 1 – 5 Juta</option>
                  <option value="5to10">Rp 5 – 10 Juta</option>
                </select>
              </div>

              {/* Sort */}
              <select
                aria-label="Urutkan Produk"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#f5f5f4] text-xs font-semibold py-2 px-3.5 min-h-[40px] rounded-full outline-none border border-neutral-200/70 cursor-pointer"
              >
                <option value="featured">Terlaris</option>
                <option value="newest">Terbaru</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
                <option value="rating_desc">Rating Tertinggi</option>
              </select>

              {/* Favorites Toggle */}
              <button
                type="button"
                onClick={() => setOnlyFavorites((prev) => !prev)}
                className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-full text-xs font-semibold border transition-all ${
                  onlyFavorites
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
                }`}
              >
                <Heart size={13} className={onlyFavorites ? 'fill-white' : ''} />
                <span>Favorit</span>
              </button>
            </div>
          </div>

          {/* Category Pills + Quick Reset */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1">
              <button
                onClick={() => {
                  onSelectCategory('');
                  setVisibleCount(8);
                }}
                className={`text-[11px] font-bold tracking-wider px-4 py-2 min-h-[36px] rounded-full uppercase whitespace-nowrap transition-all ${
                  !selectedCategory
                    ? 'bg-black text-white'
                    : 'bg-[#f4f4f5] text-neutral-600 hover:text-black'
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
                  className={`text-[11px] font-bold tracking-wider px-4 py-2 min-h-[36px] rounded-full uppercase whitespace-nowrap transition-all ${
                    selectedCategory === col.slug
                      ? 'bg-black text-white'
                      : 'bg-[#f4f4f5] text-neutral-600 hover:text-black'
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
                className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-neutral-600 hover:text-black px-3 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                title="Reset semua filter"
              >
                <RotateCcw size={12} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Error State */}
        {error ? (
          <div className="bg-white rounded-3xl border border-rose-200 text-center py-16 px-4 space-y-3">
            <AlertCircle size={32} className="text-rose-500 mx-auto" />
            <p className="font-serif text-xl text-neutral-900">Gagal Memuat Katalog</p>
            <p className="text-xs text-neutral-500">{error}</p>
            <button
              onClick={fetchData}
              className="mt-2 px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider"
            >
              Coba Lagi
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200/70 text-center py-16 sm:py-20 px-4 space-y-3">
            <p className="font-serif text-2xl text-neutral-800">Produk Tidak Ditemukan</p>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Coba ganti kata kunci, pilih brand lain, ubah rentang harga, atau reset filter kategori.
            </p>
            <button
              onClick={resetAllFilters}
              className="mt-2 px-6 py-3 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {displayedProducts.map((product, idx) => (
                <Reveal key={product.id} delay={(idx % 4) * 0.04}>
                  <ProductCard product={product} onSelect={onSelectProduct} />
                </Reveal>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="bg-white hover:bg-neutral-900 hover:text-white text-neutral-900 border border-neutral-300 hover:border-neutral-900 text-xs font-bold tracking-wider uppercase px-8 py-3.5 rounded-full transition-all active:scale-95"
                >
                  Tampilkan Lebih Banyak ({filteredProducts.length - visibleCount} lagi)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
