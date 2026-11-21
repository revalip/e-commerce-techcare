import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import FlagshipSpotlightSection from '../components/FlagshipSpotlightSection';
import CollectionsSection from '../components/CollectionsSection';
import FeatureStrip from '../components/FeatureStrip';
import { getCollections } from '../services/api';

/**
 * Apple.com/id Beranda Section Order:
 * 1) Hero terang (#F5F5F7) + 2) Tile besar hitam (#000000) Upgrade RAM & SSD
 * 3) Alternating category tiles (#F5F5F7 / #000000: Laptop, Keyboard, Mouse, Monitor, Headset)
 * 4) Horizontal scroll-snap category row with large rounded cards
 * 5) Minimalist TechCare advantages (thin line icons, no boxes)
 * 6) Footer (#F5F5F7, rendered globally in App.jsx)
 */
export default function HomePage({ onSelectProduct, onNavigate, onSelectCollection }) {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      const colRes = await getCollections();
      if (isMounted && colRes.success) {
        setCollections(colRes.data);
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
        onSelectCollection={onSelectCollection}
        onShopClick={() => onNavigate('shop')}
      />

      <CollectionsSection
        collections={collections}
        onSelectCollection={onSelectCollection}
      />

      <FeatureStrip
        onNavigateAbout={() => onNavigate('about')}
        onNavigateShop={() => onNavigate('shop')}
      />
    </div>
  );
}
