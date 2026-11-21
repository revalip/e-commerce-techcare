import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import FlagshipSpotlightSection from '../components/FlagshipSpotlightSection';
import CollectionsSection from '../components/CollectionsSection';
import BestsellersSection from '../components/BestsellersSection';
import CloserLook3DSection from '../components/CloserLook3DSection';
import FeatureStrip from '../components/FeatureStrip';
import { getProducts, getCollections } from '../services/api';

/**
 * Apple.com/id inspired home rhythm:
 * 1) 2 Full-Width Hero Tiles (Light + Dark)
 * 2) 2-Column Alternating Promo Grid
 * 3) Quick Category Swipe Strip + Featured Hardware Carousel + 32-Point QC + Service Strip
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
    <div className="bg-white">
      <HeroSection
        onShopClick={() => onNavigate('shop')}
        onLearnClick={() => onNavigate('learn')}
        onAboutClick={() => onNavigate('about')}
      />

      <FlagshipSpotlightSection
        onSelectProduct={onSelectProduct}
        onShopClick={() => onNavigate('shop')}
      />

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

      <CloserLook3DSection />

      <FeatureStrip
        onNavigateAbout={() => onNavigate('about')}
        onNavigateShop={() => onNavigate('shop')}
      />
    </div>
  );
}
