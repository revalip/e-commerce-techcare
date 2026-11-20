import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import CloserLook3DSection from '../components/CloserLook3DSection';
import FeatureStrip from '../components/FeatureStrip';
import BestsellersSection from '../components/BestsellersSection';
import CollectionsSection from '../components/CollectionsSection';
import { getProducts, getCollections } from '../services/api';

/**
 * Minimal Apple-style home: five calm sections, one message each.
 * (Vouchers remain fully available in the cart and checkout.)
 */
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
    <div className="bg-[#F7F8FA]">
      <HeroSection
        onShopClick={() => onNavigate('shop')}
        onTrackClick={() => onNavigate('orders')}
      />

      <CloserLook3DSection />

      <CollectionsSection
        collections={collections}
        onSelectCollection={onSelectCollection}
      />

      <BestsellersSection
        products={products}
        loading={loading}
        onSelectProduct={onSelectProduct}
        onExploreAll={() => onNavigate('shop')}
      />

      <FeatureStrip
        onNavigateAbout={() => onNavigate('about')}
        onNavigateShop={() => onNavigate('shop')}
      />
    </div>
  );
}
