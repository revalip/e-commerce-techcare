import React, { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { getProducts, getCollections } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import Reveal from '../components/Reveal';

export default function ShopPage({ onSelectProduct, selectedCategory, onSelectCategory }) {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [visibleCount, setVisibleCount] = useState(4); // Load more mechanism

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      const [prodRes, colRes] = await Promise.all([
        getProducts(),
        getCollections()
      ]);
      if (isMounted) {
        if (prodRes.success) setProducts(prodRes.data);
        if (colRes.success) setCollections(colRes.data);
        setLoading(false);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        const matchesCategory = !selectedCategory || item.koleksiSlug === selectedCategory;
        const matchesSearch =
          !search ||
          item.nama.toLowerCase().includes(search.toLowerCase()) ||
          item.tagline?.toLowerCase().includes(search.toLowerCase()) ||
          item.deskripsi?.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.harga - b.harga;
        if (sortBy === 'price_desc') return b.harga - a.harga;
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [products, selectedCategory, search, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <div className="bg-[#fcfcfd] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <Reveal>
          <div className="text-center mb-10">
            <span className="text-[11px] uppercase tracking-[0.24em] font-medium text-neutral-500 block mb-2">
              Katalog NOVAIRE
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-neutral-900 tracking-tight">
              Eksplorasi Mahakarya Akustik
            </h1>
          </div>
        </Reveal>

        {/* Filters & Search Toolbar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xs border border-neutral-100 mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3.5 top-3 text-neutral-400" />
              <input
                type="text"
                placeholder="Cari headphone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(4);
                }}
                className="w-full pl-10 pr-4 py-2 bg-[#f6f6f8] rounded-full text-xs outline-none border border-transparent focus:border-black focus:bg-white transition-all"
              />
            </div>

            {/* Collection Tabs */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => {
                  onSelectCategory('');
                  setVisibleCount(4);
                }}
                className={`text-[11px] font-semibold tracking-wider px-4 py-2 rounded-full uppercase transition-all ${
                  !selectedCategory
                    ? 'bg-black text-white'
                    : 'bg-[#f4f4f6] text-neutral-600 hover:text-black'
                }`}
              >
                Semua
              </button>
              {collections.map((col) => (
                <button
                  key={col.slug}
                  onClick={() => {
                    onSelectCategory(col.slug);
                    setVisibleCount(4);
                  }}
                  className={`text-[11px] font-semibold tracking-wider px-4 py-2 rounded-full uppercase transition-all ${
                    selectedCategory === col.slug
                      ? 'bg-black text-white'
                      : 'bg-[#f4f4f6] text-neutral-600 hover:text-black'
                  }`}
                >
                  {col.nama}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
              <span className="text-[11px] text-neutral-500">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#f6f6f8] text-xs font-medium py-1.5 px-3 rounded-full outline-none border border-neutral-200 cursor-pointer"
              >
                <option value="featured">Pilihan Editor</option>
                <option value="price_asc">Harga: Terendah</option>
                <option value="price_desc">Harga: Tertinggi</option>
              </select>
            </div>

          </div>
        </div>

        {/* Product Grid / Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 space-y-2">
            <p className="font-serif text-2xl text-neutral-800">Tidak ada produk ditemukan</p>
            <p className="text-xs text-neutral-500">
              Silakan ganti kata kunci pencarian atau pilih kategori Semua.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
              {displayedProducts.map((product, idx) => (
                <Reveal key={product.id} delay={idx * 0.08}>
                  <ProductCard product={product} onSelect={onSelectProduct} />
                </Reveal>
              ))}
            </div>

            {/* Load More Button (NOT Infinite Scroll) */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  className="bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-200 text-xs font-semibold tracking-wider uppercase px-8 py-3 rounded-full transition-all active:scale-95 shadow-xs"
                >
                  Tampilkan Lebih Banyak ({filteredProducts.length - visibleCount} tersisa)
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
