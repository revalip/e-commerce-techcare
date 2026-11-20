import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Heart,
  RotateCcw,
  AlertCircle,
  PackageSearch,
  LayoutGrid,
  List,
  Plus,
  Check
} from 'lucide-react';
import { getProducts, getCollections } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatIDR } from '../utils/format';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState(initialSearch);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [viewMode, setViewMode] = useState('img'); // 'img' | 'txt' (Monolith toggle)
  const [visibleCount, setVisibleCount] = useState(12);
  const [quickAddedId, setQuickAddedId] = useState(null);

  useEffect(() => {
    setSearch(initialSearch);
    setVisibleCount(12);
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

  const handleTxtAdd = (e, product) => {
    e.stopPropagation();
    if (Number(product.stok) <= 0) return;
    addToCart(product, 1);
    setQuickAddedId(product.id);
    setTimeout(() => setQuickAddedId(null), 900);
  };

  const countBadge = `0_${String(filteredProducts.length).padStart(2, '0')}`;

  return (
    <div className="bg-[#F2F1EC] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Monolith Typographic Catalog Header */}
        <header className="space-y-4">
          <div className="flex items-center justify-between gap-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.12em] text-[#6E6D68]">
            <span>TECHCARE // INDEX KATALOG HARDWARE</span>
            <span className="hidden sm:inline">SEMUA UNIT &lt; RP 10 JUTA • LULUS 32 TITIK QC</span>
          </div>

          <div className="flex items-end justify-between gap-4 pb-5 border-b border-[#111111]">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-[72px] font-black uppercase tracking-[-0.04em] text-[#111111] leading-[0.9]">
              CATALOG
            </h1>
            <div className="text-right shrink-0">
              <span className="font-mono text-2xl sm:text-4xl font-bold text-[#111111] tabular-nums block leading-none">
                {countBadge}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#6E6D68] block mt-1">
                UNIT TERSEDIA
              </span>
            </div>
          </div>
        </header>

        {/* Dimwit-Inspired Inline Filter & Monolith IMG/TXT Switcher */}
        <section className="space-y-4 pb-5 border-b border-[#D6D4CC]" aria-label="Filter Katalog">
          {/* Row 1: Search, Vertically Centered Selects, Favorite, High-Contrast IMG/TXT Toggle */}
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            <div className="relative w-full lg:flex-1 lg:max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E6D68]" />
              <input
                type="text"
                placeholder="Cari ThinkPad, ASUS, MSI, Logitech, RAM..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(12);
                }}
                className="tc-input pl-10"
              />
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
              <div className="flex items-center h-[44px] px-3 rounded-[2px] bg-[#FAF9F6] border border-[#D6D4CC] focus-within:border-[#111111]">
                <select
                  aria-label="Filter Brand"
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    setVisibleCount(12);
                  }}
                  className="w-full h-full bg-transparent font-mono text-[11px] font-semibold uppercase text-[#111111] outline-none cursor-pointer"
                >
                  <option value="">SEMUA BRAND</option>
                  {availableBrands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center h-[44px] px-3 rounded-[2px] bg-[#FAF9F6] border border-[#D6D4CC] focus-within:border-[#111111]">
                <select
                  aria-label="Filter Harga"
                  value={priceRange}
                  onChange={(e) => {
                    setPriceRange(e.target.value);
                    setVisibleCount(12);
                  }}
                  className="w-full h-full bg-transparent font-mono text-[11px] font-semibold uppercase text-[#111111] outline-none cursor-pointer"
                >
                  <option value="all">SEMUA HARGA</option>
                  <option value="under1">&lt; RP 1 JUTA</option>
                  <option value="1to5">RP 1 – 5 JUTA</option>
                  <option value="5to10">RP 5 – 10 JUTA</option>
                </select>
              </div>

              <div className="flex items-center h-[44px] px-3 rounded-[2px] bg-[#FAF9F6] border border-[#D6D4CC] focus-within:border-[#111111]">
                <select
                  aria-label="Urutkan Produk"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-full bg-transparent font-mono text-[11px] font-semibold uppercase text-[#111111] outline-none cursor-pointer"
                >
                  <option value="featured">URUT: UNGGULAN</option>
                  <option value="newest">URUT: TERBARU</option>
                  <option value="price_asc">HARGA TERENDAH</option>
                  <option value="price_desc">HARGA TERTINGGI</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setOnlyFavorites((prev) => !prev)}
                className={`inline-flex items-center justify-center gap-1.5 px-3 h-[44px] rounded-[2px] font-mono text-[11px] font-semibold uppercase tracking-[0.06em] border transition-colors ${
                  onlyFavorites
                    ? 'bg-[#111111] text-[#F2F1EC] border-[#111111]'
                    : 'bg-[#FAF9F6] text-[#111111] border-[#D6D4CC] hover:border-[#111111]'
                }`}
              >
                <Heart size={13} className={onlyFavorites ? 'fill-[#E63B19] text-[#E63B19]' : ''} />
                <span>FAVORIT</span>
              </button>

              {/* Monolith IMG / TXT View Switch */}
              <div
                className="col-span-2 sm:col-span-1 inline-flex border border-[#111111] rounded-[2px] overflow-hidden h-[44px]"
                role="group"
                aria-label="Mode Tampilan Katalog"
              >
                <button
                  type="button"
                  onClick={() => setViewMode('img')}
                  className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors duration-100 ${
                    viewMode === 'img'
                      ? 'bg-[#111111] text-[#F2F1EC]'
                      : 'bg-[#FAF9F6] text-[#111111] hover:bg-[#E7E5DE]'
                  }`}
                >
                  <LayoutGrid size={13} />
                  <span>IMG</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('txt')}
                  className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] border-l border-[#111111] transition-colors duration-100 ${
                    viewMode === 'txt'
                      ? 'bg-[#111111] text-[#F2F1EC]'
                      : 'bg-[#FAF9F6] text-[#111111] hover:bg-[#E7E5DE]'
                  }`}
                >
                  <List size={13} />
                  <span>TXT</span>
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Dimwit Inline Underlined Category Links + Reset */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-5 overflow-x-auto pb-1 flex-1 no-scrollbar">
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('');
                  setVisibleCount(12);
                }}
                className={`min-h-[40px] font-mono text-[11px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap border-b-2 transition-colors ${
                  !selectedCategory
                    ? 'text-[#111111] border-[#E63B19]'
                    : 'text-[#6E6D68] border-transparent hover:text-[#111111]'
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
                  className={`min-h-[40px] font-mono text-[11px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap border-b-2 transition-colors ${
                    selectedCategory === col.slug
                      ? 'text-[#111111] border-[#E63B19]'
                      : 'text-[#6E6D68] border-transparent hover:text-[#111111]'
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
                className="shrink-0 inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-[2px] border border-[#E63B19] text-[#E63B19] hover:bg-[#E63B19] hover:text-white font-mono text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </section>

        {/* Product List / Grid States */}
        {error ? (
          <div className="bg-[#FAF9F6] border border-[#111111] text-center py-14 px-4 space-y-4">
            <AlertCircle size={28} className="mx-auto text-[#E63B19]" />
            <p className="font-display text-xl font-bold uppercase text-[#111111]">
              Gagal Memuat Katalog
            </p>
            <p className="text-xs text-[#6E6D68]">{error}</p>
            <button type="button" onClick={fetchData} className="tc-btn-primary">
              Coba Lagi
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-[#FAF9F6] border border-[#D6D4CC] text-center py-16 px-4 space-y-4">
            <PackageSearch size={28} className="mx-auto text-[#6E6D68]" />
            <p className="font-display text-xl font-bold uppercase text-[#111111]">
              Unit Tidak Ditemukan
            </p>
            <p className="text-xs text-[#6E6D68] max-w-sm mx-auto leading-relaxed">
              Coba ubah kata kunci pencarian, pilih brand lain, atau atur ulang filter harga dan kategori.
            </p>
            <button type="button" onClick={resetAllFilters} className="tc-btn-primary">
              Reset Semua Filter
            </button>
          </div>
        ) : viewMode === 'img' ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>

            {hasMore && (
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="tc-btn-secondary px-8"
                >
                  Muat Lebih Banyak ({filteredProducts.length - visibleCount} unit lagi)
                </button>
              </div>
            )}
          </>
        ) : (
          /* Monolith TXT Mode — Mobile Stacked Spec Index (< md) + Full Architectural Table (md+) */
          <>
            {/* Mobile Stacked Spec Rows (Zero Horizontal Scroll Needed on 360px) */}
            <div className="md:hidden bg-[#FAF9F6] border border-[#D6D4CC] divide-y divide-[#D6D4CC]">
              {displayedProducts.map((product) => {
                const outOfStock = Number(product.stok) <= 0;
                const lowStock = !outOfStock && Number(product.stok) <= 5;
                const isAdded = quickAddedId === product.id;

                return (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="p-3.5 hover:bg-[#F2F1EC] cursor-pointer transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.06em]">
                      <span className="text-[#6E6D68] tabular-nums">
                        TC_{String(product.id).padStart(2, '0')} // {product.brand || 'TECHCARE'}
                      </span>
                      {outOfStock ? (
                        <span className="text-rose-700 font-bold">HABIS</span>
                      ) : lowStock ? (
                        <span className="text-[#E63B19] font-bold">SISA {product.stok}</span>
                      ) : (
                        <span className="text-[#111111]">
                          STOK {String(product.stok).padStart(2, '0')}
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="font-display text-sm font-bold text-[#111111] leading-snug">
                        {product.nama}
                      </p>
                      <p className="font-mono text-[10px] text-[#6E6D68] mt-0.5">
                        {product.kondisi || 'GRADE A'} • {product.specRangeLabel || product.tagline}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <div className="font-mono tabular-nums">
                        {product.hargaCoret && (
                          <span className="text-[10px] text-[#8A8880] line-through block leading-tight">
                            {formatIDR(product.hargaCoret)}
                          </span>
                        )}
                        <span className="text-sm font-bold text-[#111111]">
                          {formatIDR(product.harga)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleTxtAdd(e, product)}
                        disabled={outOfStock}
                        className={`inline-flex items-center justify-center gap-1 min-h-[44px] px-3.5 rounded-[2px] font-mono text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors ${
                          outOfStock
                            ? 'bg-[#E7E5DE] text-[#8A8880] cursor-not-allowed'
                            : isAdded
                            ? 'bg-emerald-700 text-white'
                            : 'bg-[#111111] text-[#F2F1EC] hover:bg-[#E63B19]'
                        }`}
                        aria-label={`Tambah ${product.nama} ke keranjang`}
                      >
                        {isAdded ? <Check size={14} /> : <Plus size={14} />}
                        <span>{outOfStock ? 'Habis' : isAdded ? 'Masuk' : 'Tambah'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tablet & Desktop 6-Column Monolith Specification Table */}
            <div className="hidden md:block bg-[#FAF9F6] border border-[#D6D4CC] overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#111111] bg-[#E7E5DE] font-mono text-[10px] uppercase tracking-[0.1em] text-[#3A3A36]">
                    <th className="py-3 px-3.5 w-20">SKU</th>
                    <th className="py-3 px-3.5">PERANGKAT &amp; SPESIFIKASI</th>
                    <th className="py-3 px-3.5 w-32">BRAND</th>
                    <th className="py-3 px-3.5 w-24">STOK</th>
                    <th className="py-3 px-3.5 w-36 text-right">HARGA</th>
                    <th className="py-3 px-3.5 w-24 text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D6D4CC]">
                  {displayedProducts.map((product) => {
                    const outOfStock = Number(product.stok) <= 0;
                    const lowStock = !outOfStock && Number(product.stok) <= 5;
                    const isAdded = quickAddedId === product.id;

                    return (
                      <tr
                        key={product.id}
                        onClick={() => onSelectProduct(product)}
                        className="hover:bg-[#F2F1EC] cursor-pointer transition-colors group"
                      >
                        <td className="py-3.5 px-3.5 font-mono text-xs text-[#6E6D68] tabular-nums">
                          TC_{String(product.id).padStart(2, '0')}
                        </td>
                        <td className="py-3.5 px-3.5">
                          <p className="font-display text-sm font-bold text-[#111111] group-hover:text-[#E63B19] transition-colors">
                            {product.nama}
                          </p>
                          <p className="font-mono text-[10px] text-[#6E6D68] mt-0.5">
                            {product.kondisi || 'GRADE A'} // {product.specRangeLabel || product.tagline}
                          </p>
                        </td>
                        <td className="py-3.5 px-3.5 font-mono text-[11px] uppercase text-[#3A3A36]">
                          {product.brand || 'TECHCARE'}
                        </td>
                        <td className="py-3.5 px-3.5 font-mono text-[11px] uppercase tabular-nums">
                          {outOfStock ? (
                            <span className="text-rose-700 font-bold">HABIS</span>
                          ) : lowStock ? (
                            <span className="text-[#E63B19] font-bold">SISA {product.stok}</span>
                          ) : (
                            <span className="text-[#111111]">
                              {String(product.stok).padStart(2, '0')} UNIT
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3.5 text-right font-mono tabular-nums">
                          {product.hargaCoret && (
                            <span className="text-[10px] text-[#8A8880] line-through block">
                              {formatIDR(product.hargaCoret)}
                            </span>
                          )}
                          <span className="text-xs sm:text-sm font-bold text-[#111111]">
                            {formatIDR(product.harga)}
                          </span>
                        </td>
                        <td className="py-3.5 px-3.5 text-right">
                          <button
                            type="button"
                            onClick={(e) => handleTxtAdd(e, product)}
                            disabled={outOfStock}
                            className={`inline-flex items-center justify-center w-11 h-11 rounded-[2px] transition-colors ${
                              outOfStock
                                ? 'bg-[#E7E5DE] text-[#8A8880] cursor-not-allowed'
                                : isAdded
                                ? 'bg-emerald-700 text-white'
                                : 'bg-[#111111] text-[#F2F1EC] hover:bg-[#E63B19]'
                            }`}
                            aria-label={`Tambah ${product.nama} ke keranjang`}
                          >
                            {isAdded ? <Check size={15} /> : <Plus size={15} />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {hasMore && (
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="tc-btn-secondary px-8"
                >
                  Muat Lebih Banyak ({filteredProducts.length - visibleCount} unit lagi)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
