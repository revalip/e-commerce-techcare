import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import FeatureStrip from '../components/FeatureStrip';
import BestsellersSection from '../components/BestsellersSection';
import CollectionsSection from '../components/CollectionsSection';
import { getProducts, getCollections } from '../services/api';

export default function HomePage({ onSelectProduct, onNavigate, onSelectCollection }) {
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
    <div>
      {/* 1. Hero Banner */}
      <HeroSection onShopClick={() => onNavigate('shop')} />

      {/* 2. Strip Keunggulan (4 Points) */}
      <FeatureStrip />

      {/* 3. Bestsellers (4 Cards) */}
      <BestsellersSection
        products={products}
        loading={loading}
        onSelectProduct={onSelectProduct}
        onExploreAll={() => onNavigate('shop')}
      />

      {/* 4. Shop by Collection (4 Tall Cards) */}
      <CollectionsSection
        collections={collections}
        onSelectCollection={onSelectCollection}
      />
    </div>
  );
}
