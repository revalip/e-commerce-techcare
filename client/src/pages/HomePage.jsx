import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import FeatureStrip from '../components/FeatureStrip';
import BestsellersSection from '../components/BestsellersSection';
import CollectionsSection from '../components/CollectionsSection';
import { getProducts, getCollections } from '../services/api';

export default function HomePage({
  onSelectProduct,
  onNavigate,
  onSelectCollection,
  onQuickSearch
}) {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const [prodRes, colRes] = await Promise.all([
        getProducts({ bestseller: true }),
        getCollections()
      ]);
      if (isMounted) {
        if (prodRes.success) setProducts(prodRes.data);
        if (colRes.success) setCollections(colRes.data);
        setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-[#f9f9f8]">
      {/* 1. Editorial Clean Hero + Search & Quick Category Pill Bar */}
      <HeroSection
        onShopClick={() => onNavigate('shop')}
        onTrackClick={() => onNavigate('orders')}
        onQuickSearch={onQuickSearch}
        onSelectCollection={onSelectCollection}
      />

      {/* 2. Bestsellers (Unit Second < 10jt + RAM) */}
      <BestsellersSection
        products={products}
        loading={loading}
        onSelectProduct={onSelectProduct}
        onExploreAll={() => onNavigate('shop')}
      />

      {/* 3. Editorial Category Showcase */}
      <CollectionsSection
        collections={collections}
        onSelectCollection={onSelectCollection}
      />

      {/* 4. Standar QC 32 Titik & Jasa IT Banner */}
      <FeatureStrip
        onNavigateAbout={() => onNavigate('about')}
        onNavigateShop={() => onNavigate('shop')}
      />
    </div>
  );
}
