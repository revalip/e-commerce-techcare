import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import FeatureStrip from '../components/FeatureStrip';
import BestsellersSection from '../components/BestsellersSection';
import CollectionsSection from '../components/CollectionsSection';
import PromoBannerSection from '../components/PromoBannerSection';
import { getProducts, getCollections, getDiscounts } from '../services/api';

export default function HomePage({
  onSelectProduct,
  onNavigate,
  onSelectCollection,
  onQuickSearch
}) {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const [prodRes, colRes, discRes] = await Promise.all([
        getProducts({ bestseller: true }),
        getCollections(),
        getDiscounts()
      ]);
      if (isMounted) {
        if (prodRes.success) setProducts(prodRes.data);
        if (colRes.success) setCollections(colRes.data);
        if (discRes.success) setDiscounts(discRes.data);
        setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-[#F4F6FA]">
      {/* 1. Hero Tech-Retail Kuat + Search & Quick Category Bar */}
      <HeroSection
        onShopClick={() => onNavigate('shop')}
        onTrackClick={() => onNavigate('orders')}
        onQuickSearch={onQuickSearch}
        onSelectCollection={onSelectCollection}
      />

      {/* 2. Kategori Produk */}
      <CollectionsSection
        collections={collections}
        onSelectCollection={onSelectCollection}
      />

      {/* 3. Produk Unggulan / Bestsellers */}
      <BestsellersSection
        products={products}
        loading={loading}
        onSelectProduct={onSelectProduct}
        onExploreAll={() => onNavigate('shop')}
      />

      {/* 4. Promo & Voucher Aktif */}
      <PromoBannerSection
        discounts={discounts}
        onExploreShop={() => onNavigate('shop')}
      />

      {/* 5. Keunggulan Toko & Banner Jasa IT */}
      <FeatureStrip
        onNavigateAbout={() => onNavigate('about')}
        onNavigateShop={() => onNavigate('shop')}
      />
    </div>
  );
}
