import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, MoveHorizontal, ArrowUpRight } from 'lucide-react';
import Laptop3DCanvas from './Laptop3DCanvas';
import Reveal from './Reveal';

const FEATURES = [
  {
    id: 'display',
    preset: 'display',
    label: 'Layar IPS & OLED Bebas Dead Pixel',
    badge: 'QC PANEL',
    summary:
      'Setiap layar diuji keseragaman warna, tingkat kecerahan 300–400 nits, engsel kokoh, dan bebas dead pixel atau burn-in sebelum masuk katalog.'
  },
  {
    id: 'ram',
    preset: 'ram',
    label: 'Custom Upgrade RAM 8–32GB',
    badge: 'MEMTEST86',
    summary:
      'Bebas pilih konfigurasi memori DDR4/DDR5 langsung di halaman produk. Setiap modul RAM lulus pengujian MemTest86 tanpa error.'
  },
  {
    id: 'ssd',
    preset: 'ssd',
    label: 'SSD NVMe PCIe Gen4 Health 97%+',
    badge: 'STORAGE',
    summary:
      'Kecepatan baca hingga 7.000 MB/s dengan kesehatan storage terverifikasi CrystalDiskInfo. Termasuk gratis instalasi OS bersih.'
  },
  {
    id: 'thermal',
    preset: 'thermal',
    label: 'Thermal Repaste & Kipas Bersih',
    badge: 'COOLING',
    summary:
      'Sebelum dikirim, heatsink dibersihkan dari debu dan thermal paste diganti baru agar suhu kerja tetap adem dan kipas senyap.'
  },
  {
    id: 'ports',
    preset: 'ports',
    label: 'Port Thunderbolt 4 & Bodi Grade A+',
    badge: 'I/O & CHASSIS',
    summary:
      'Seluruh port USB-C, Thunderbolt, HDMI, audio jack, dan tombol keyboard dicek fungsi satu per satu dengan kondisi fisik mulus 94–97%.'
  },
  {
    id: 'qc',
    preset: 'qc',
    label: 'Garansi Toko 30–90 Hari',
    badge: '32 TITIK QC',
    summary:
      'Unit dilengkapi stiker QC teknisi, laporan kondisi baterai jujur, serta garansi tukar unit & servis langsung di workshop Jakarta Barat.'
  }
];

export default function CloserLook3DSection({ onNavigateLearn }) {
  const [activeId, setActiveId] = useState('display');
  const [resetTick, setResetTick] = useState(0);

  const activeFeature = FEATURES.find((f) => f.id === activeId) || FEATURES[0];
  const currentPreset = resetTick > 0 && activeId === 'overview' ? 'overview' : activeFeature.preset;

  return (
    <section className="bg-[#F7F8FA] py-16 sm:py-24 border-b border-[#E2E7EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#647082] block">
                Inspeksi Interaktif 3D
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-[-0.04em] text-[#1D2129] leading-[1.02]">
                Lihat lebih dekat.
              </h2>
            </div>

            {onNavigateLearn && (
              <button
                type="button"
                onClick={onNavigateLearn}
                className="tc-btn-secondary self-start sm:self-auto"
              >
                <span>Baca Checklist 32 Titik QC</span>
                <ArrowUpRight size={15} />
              </button>
            )}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left: Airform One Interactive Expanding Feature Pills */}
          <div className="lg:col-span-5 space-y-2.5 order-2 lg:order-1">
            {FEATURES.map((feat) => {
              const isOpen = feat.id === activeId;
              return (
                <div
                  key={feat.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-white border-[#1D2129] shadow-tc-studio'
                      : 'bg-white/75 border-[#E2E7EE] hover:border-[#B8C4D2]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveId(feat.id)}
                    className="w-full text-left px-4 sm:px-5 min-h-[52px] py-3 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                          isOpen ? 'bg-[#1D2129]' : 'bg-[#BAC4D2]'
                        }`}
                      />
                      <span
                        className={`text-xs sm:text-sm truncate ${
                          isOpen ? 'font-semibold text-[#1D2129]' : 'font-medium text-[#4F627A]'
                        }`}
                      >
                        {feat.label}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#8692A3] shrink-0">
                      {feat.badge}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 pt-0.5 text-xs sm:text-[13px] text-[#647082] leading-relaxed">
                          {feat.summary}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right: Live 3D WebGL Orbit Inspector Stage */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative bg-white rounded-[28px] border border-[#E2E7EE] shadow-tc-studio overflow-hidden h-[340px] sm:h-[460px] lg:h-[520px]">
              {/* Top Minimal Telemetry Pill */}
              <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-2 pointer-events-none">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F7F8FA]/95 border border-[#E2E7EE] font-mono text-[10px] uppercase tracking-[0.08em] text-[#1D2129]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4F627A]" />
                  <span>3D VIEW // {activeFeature.badge}</span>
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setActiveId('overview');
                    setResetTick((n) => n + 1);
                  }}
                  className="pointer-events-auto inline-flex items-center gap-1.5 px-3 min-h-[34px] rounded-full bg-white/95 border border-[#E2E7EE] hover:border-[#1D2129] text-[11px] font-medium text-[#1D2129] transition-colors"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              </div>

              {/* Three.js Live Interactive Canvas */}
              <Laptop3DCanvas
                key={`explorer-${resetTick > 0 && activeId === 'overview' ? resetTick : 'live'}`}
                mode="explorer"
                activePreset={currentPreset}
              />

              {/* Bottom Drag Hint */}
              <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-center pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F7F8FA]/90 border border-[#E2E7EE] text-[11px] text-[#647082]">
                  <MoveHorizontal size={13} />
                  <span>Geser kiri / kanan untuk memutar 360°</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
