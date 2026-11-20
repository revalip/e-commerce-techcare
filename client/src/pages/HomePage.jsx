import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import CloserLook3DSection from '../components/CloserLook3DSection';
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
    <div className="bg-[#F7F8FA]">
      {/* 1. Airform One Scroll-Choreographed Real-Time 3D Hero */}
      <HeroSection
        onShopClick={() => onNavigate('shop')}
        onTrackClick={() => onNavigate('orders')}
        onQuickSearch={onQuickSearch}
        onSelectCollection={onSelectCollection}
      />

      {/* 2. Interactive "Take a Closer Look" 3D Orbit Explorer */}
      <CloserLook3DSection onNavigateLearn={() => onNavigate('learn')} />

      {/* 3. Asymmetric Studio Category Bento */}
      <CollectionsSection
        collections={collections}
        onSelectCollection={onSelectCollection}
      />

      {/* 4. Asymmetric Editorial Bestsellers Bento */}
      <BestsellersSection
        products={products}
        loading={loading}
        onSelectProduct={onSelectProduct}
        onExploreAll={() => onNavigate('shop')}
      />

      {/* 5. Clean Studio Voucher Strip */}
      <PromoBannerSection
        discounts={discounts}
        onExploreShop={() => onNavigate('shop')}
      />

      {/* 6. Numbered Operational Spec Grid & Workshop CTA */}
      <FeatureStrip
        onNavigateAbout={() => onNavigate('about')}
        onNavigateShop={() => onNavigate('shop')}
      />
    </div>
  );
}
