import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Heart,
  RotateCcw,
  AlertCircle,
  PackageSearch,
  LayoutGrid,
  List,
  Plus,
  Check,
  ChevronDown
} from 'lucide-react';
import { getProducts, getCollections } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatIDR } from '../utils/format';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

/**
 * Custom Airform Studio Pill Dropdown (100% vertically centered, single chevron, zero OS select quirks)
 */
function StudioDropdown({ value, onChange, options, ariaLabel }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const activeOpt = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full min-h-[44px] px-4 rounded-full bg-white border text-xs font-medium text-[#1D2129] inline-flex items-center justify-between gap-2.5 whitespace-nowrap transition-colors ${
          open ? 'border-[#1D2129]' : 'border-[#DCE2EA] hover:border-[#1D2129]'
        }`}
      >
        <span className="truncate">{activeOpt?.label}</span>
        <ChevronDown
          size={14}
          className={`text-[#647082] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 sm:left-auto sm:right-0 mt-1.5 min-w-[180px] w-full sm:w-auto max-h-64 overflow-y-auto bg-white rounded-2xl border border-[#DCE2EA] shadow-tc-lift p-1.5 z-30">
          {options.map((opt) => {
            const selected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-colors ${
                  selected
                    ? 'bg-[#1D2129] text-white font-medium'
                    : 'text-[#4F627A] hover:bg-[#F7F8FA] hover:text-[#1D2129]'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {selected && <Check size={12} className="shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

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
  const [viewMode, setViewMode] = useState('img'); // 'img' | 'txt'
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

  return (
    <div className="bg-[#F7F8FA] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Clean Airform Studio Catalog Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E2E7EE]">
          <div className="space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#647082] block">
              Certified Hardware &lt; Rp 10 Juta • Lulus 32 Titik QC
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-medium tracking-[-0.045em] text-[#1D2129] leading-[0.98]">
              Katalog.
            </h1>
          </div>

          <div className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-full bg-white border border-[#E2E7EE] font-mono text-xs text-[#4F627A] tabular-nums">
            <span className="w-2 h-2 rounded-full bg-[#1D2129]" />
            <span>
              <strong className="text-[#1D2129]">{filteredProducts.length}</strong> unit tersedia
            </span>
          </div>
        </header>

        {/* Studio Pill Filter Toolbar (Custom appearance-none selects = 100% centered on Windows Chrome!) */}
        <section className="space-y-4" aria-label="Filter Katalog">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            <div className="relative w-full lg:flex-1 lg:max-w-md">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8692A3]" />
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
              <StudioDropdown
                ariaLabel="Filter Brand"
                value={selectedBrand}
                onChange={(val) => {
                  setSelectedBrand(val);
                  setVisibleCount(12);
                }}
                options={[
                  { value: '', label: 'Semua Brand' },
                  ...availableBrands.map((b) => ({ value: b, label: b }))
                ]}
              />

              <StudioDropdown
                ariaLabel="Filter Harga"
                value={priceRange}
                onChange={(val) => {
                  setPriceRange(val);
                  setVisibleCount(12);
                }}
                options={[
                  { value: 'all', label: 'Semua Harga' },
                  { value: 'under1', label: '< Rp 1 Juta' },
                  { value: '1to5', label: 'Rp 1 – 5 Juta' },
                  { value: '5to10', label: 'Rp 5 – 10 Juta' }
                ]}
              />

              <StudioDropdown
                ariaLabel="Urutkan Produk"
                value={sortBy}
                onChange={(val) => setSortBy(val)}
                options={[
                  { value: 'featured', label: 'Urut: Unggulan' },
                  { value: 'newest', label: 'Urut: Terbaru' },
                  { value: 'price_asc', label: 'Harga Terendah' },
                  { value: 'price_desc', label: 'Harga Tertinggi' }
                ]}
              />

              <button
                type="button"
                onClick={() => setOnlyFavorites((prev) => !prev)}
                className={`inline-flex items-center justify-center gap-1.5 px-4 h-[44px] rounded-full text-xs font-medium border transition-colors ${
                  onlyFavorites
                    ? 'bg-[#1D2129] text-white border-[#1D2129]'
                    : 'bg-white text-[#1D2129] border-[#DCE2EA] hover:border-[#1D2129]'
                }`}
              >
                <Heart size={13} className={onlyFavorites ? 'fill-white text-white' : ''} />
                <span>Favorit</span>
              </button>

              {/* Pill Grid / List Toggle */}
              <div
                className="col-span-2 sm:col-span-1 inline-flex bg-white border border-[#DCE2EA] rounded-full p-1 h-[44px]"
                role="group"
                aria-label="Mode Tampilan Katalog"
              >
                <button
                  type="button"
                  onClick={() => setViewMode('img')}
                  className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 rounded-full text-xs font-medium transition-colors ${
                    viewMode === 'img'
                      ? 'bg-[#1D2129] text-white'
                      : 'text-[#647082] hover:text-[#1D2129]'
                  }`}
                >
                  <LayoutGrid size={13} />
                  <span>Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('txt')}
                  className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 rounded-full text-xs font-medium transition-colors ${
                    viewMode === 'txt'
                      ? 'bg-[#1D2129] text-white'
                      : 'text-[#647082] hover:text-[#1D2129]'
                  }`}
                >
                  <List size={13} />
                  <span>List</span>
                </button>
              </div>
            </div>
          </div>

          {/* Pill Category Strip + Reset */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1 no-scrollbar">
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('');
                  setVisibleCount(12);
                }}
                className={`min-h-[40px] px-4 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
                  !selectedCategory
                    ? 'bg-[#1D2129] text-white border-[#1D2129]'
                    : 'bg-white text-[#4F627A] border-[#E2E7EE] hover:border-[#1D2129] hover:text-[#1D2129]'
                }`}
              >
                Semua Kategori
              </button>
              {collections.map((col) => (
                <button
                  key={col.slug}
                  type="button"
                  onClick={() => {
                    onSelectCategory(col.slug);
                    setVisibleCount(12);
                  }}
                  className={`min-h-[40px] px-4 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
                    selectedCategory === col.slug
                      ? 'bg-[#1D2129] text-white border-[#1D2129]'
                      : 'bg-white text-[#4F627A] border-[#E2E7EE] hover:border-[#1D2129] hover:text-[#1D2129]'
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
                className="shrink-0 inline-flex items-center gap-1.5 min-h-[40px] px-4 rounded-full border border-[#1D2129] text-[#1D2129] hover:bg-[#1D2129] hover:text-white text-xs font-medium transition-colors"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </section>

        {/* Product List / Grid States */}
        {error ? (
          <div className="bg-white rounded-[24px] border border-[#E2E7EE] text-center py-14 px-4 space-y-4">
            <AlertCircle size={28} className="mx-auto text-[#4F627A]" />
            <p className="font-display text-xl font-medium text-[#1D2129]">
              Gagal Memuat Katalog
            </p>
            <p className="text-xs text-[#647082]">{error}</p>
            <button type="button" onClick={fetchData} className="tc-btn-primary">
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
          <div className="bg-white rounded-[24px] border border-[#E2E7EE] text-center py-16 px-4 space-y-4">
            <PackageSearch size={28} className="mx-auto text-[#8692A3]" />
            <p className="font-display text-xl font-medium text-[#1D2129]">
              Unit Tidak Ditemukan
            </p>
            <p className="text-xs text-[#647082] max-w-sm mx-auto leading-relaxed">
              Coba ubah kata kunci pencarian, pilih brand lain, atau atur ulang filter harga dan kategori.
            </p>
            <button type="button" onClick={resetAllFilters} className="tc-btn-primary">
              Reset Semua Filter
            </button>
          </div>
        ) : viewMode === 'img' ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
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
          /* Clean Studio List Mode (Mobile Stacked + Tablet/Desktop Spec Table) */
          <>
            <div className="md:hidden bg-white rounded-[24px] border border-[#E2E7EE] divide-y divide-[#ECEFF4] overflow-hidden">
              {displayedProducts.map((product) => {
                const outOfStock = Number(product.stok) <= 0;
                const lowStock = !outOfStock && Number(product.stok) <= 5;
                const isAdded = quickAddedId === product.id;

                return (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="p-4 hover:bg-[#F7F8FA] cursor-pointer transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.06em]">
                      <span className="text-[#8692A3] tabular-nums">
                        TC_{String(product.id).padStart(2, '0')} • {product.brand || 'TechCare'}
                      </span>
                      {outOfStock ? (
                        <span className="text-rose-600 font-semibold">Habis</span>
                      ) : lowStock ? (
                        <span className="text-[#1D2129] font-semibold">Sisa {product.stok}</span>
                      ) : (
                        <span className="text-[#647082]">Stok {product.stok}</span>
                      )}
                    </div>

                    <div>
                      <p className="font-display text-sm font-medium text-[#1D2129] leading-snug">
                        {product.nama}
                      </p>
                      <p className="text-[11px] text-[#647082] mt-0.5">
                        {product.kondisi || 'Grade A'} • {product.specRangeLabel || product.tagline}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <div className="tabular-nums">
                        {product.hargaCoret && (
                          <span className="font-mono text-[10px] text-[#8692A3] line-through block leading-tight">
                            {formatIDR(product.hargaCoret)}
                          </span>
                        )}
                        <span className="font-display text-sm font-semibold text-[#1D2129]">
                          {formatIDR(product.harga)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleTxtAdd(e, product)}
                        disabled={outOfStock}
                        className={`inline-flex items-center justify-center gap-1 min-h-[42px] px-4 rounded-full text-xs font-medium transition-colors ${
                          outOfStock
                            ? 'bg-[#ECEFF4] text-[#8692A3] cursor-not-allowed'
                            : isAdded
                            ? 'bg-emerald-700 text-white'
                            : 'bg-[#1D2129] text-white hover:bg-[#323846]'
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

            <div className="hidden md:block bg-white rounded-[24px] border border-[#E2E7EE] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E7EE] bg-[#F7F8FA] font-mono text-[10px] uppercase tracking-[0.1em] text-[#647082]">
                    <th className="py-3.5 px-4 w-20">SKU</th>
                    <th className="py-3.5 px-4">Perangkat &amp; Spesifikasi</th>
                    <th className="py-3.5 px-4 w-32">Brand</th>
                    <th className="py-3.5 px-4 w-24">Stok</th>
                    <th className="py-3.5 px-4 w-36 text-right">Harga</th>
                    <th className="py-3.5 px-4 w-24 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECEFF4]">
                  {displayedProducts.map((product) => {
                    const outOfStock = Number(product.stok) <= 0;
                    const lowStock = !outOfStock && Number(product.stok) <= 5;
                    const isAdded = quickAddedId === product.id;

                    return (
                      <tr
                        key={product.id}
                        onClick={() => onSelectProduct(product)}
                        className="hover:bg-[#F7F8FA] cursor-pointer transition-colors group"
                      >
                        <td className="py-3.5 px-4 font-mono text-xs text-[#8692A3] tabular-nums">
                          TC_{String(product.id).padStart(2, '0')}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-display text-sm font-medium text-[#1D2129] group-hover:text-[#4F627A] transition-colors">
                            {product.nama}
                          </p>
                          <p className="text-[11px] text-[#647082] mt-0.5">
                            {product.kondisi || 'Grade A'} • {product.specRangeLabel || product.tagline}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] uppercase text-[#4F627A]">
                          {product.brand || 'TechCare'}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] tabular-nums">
                          {outOfStock ? (
                            <span className="text-rose-600 font-semibold">Habis</span>
                          ) : lowStock ? (
                            <span className="text-[#1D2129] font-semibold">Sisa {product.stok}</span>
                          ) : (
                            <span className="text-[#647082]">{product.stok} unit</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right tabular-nums">
                          {product.hargaCoret && (
                            <span className="font-mono text-[10px] text-[#8692A3] line-through block">
                              {formatIDR(product.hargaCoret)}
                            </span>
                          )}
                          <span className="font-display text-sm font-semibold text-[#1D2129]">
                            {formatIDR(product.harga)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => handleTxtAdd(e, product)}
                            disabled={outOfStock}
                            className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                              outOfStock
                                ? 'bg-[#ECEFF4] text-[#8692A3] cursor-not-allowed'
                                : isAdded
                                ? 'bg-emerald-700 text-white'
                                : 'bg-[#1D2129] text-white hover:bg-[#323846]'
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
