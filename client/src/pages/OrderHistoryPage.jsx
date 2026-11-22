import React, { useState, useEffect } from 'react';
import { Package, Search, ChevronRight, MapPin, AlertCircle } from 'lucide-react';
import { getOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatIDR, formatDate } from '../utils/format';
import Reveal from '../components/Reveal';

function getOrderStatusColor(statusKey) {
  switch (statusKey) {
    case 'completed':
      return 'text-[#1D7F3E]';
    case 'shipped':
    case 'processing':
    case 'paid':
      return 'text-[#0071E3]';
    case 'cancelled':
      return 'text-[#D70015]';
    default:
      return 'text-[#B64400]';
  }
}

export default function OrderHistoryPage({ onSelectOrder, onBackToShop }) {
  const { user, isAdmin, isBuyer, isGuest, openAuthModal } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [trackError, setTrackError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    let isMounted = true;
    async function fetchOrdersList() {
      setLoading(true);
      const res = await getOrders();
      if (isMounted) {
        if (res.success) setOrders(res.data);
        setLoading(false);
      }
    }
    fetchOrdersList();
    return () => {
      isMounted = false;
    };
  }, []);

  const statusTabs = [
    { key: 'all', label: 'Semua' },
    { key: 'pending', label: 'Menunggu Bayar' },
    { key: 'paid', label: 'Dibayar' },
    { key: 'processing', label: 'Dikemas & QC' },
    { key: 'shipped', label: 'Dikirim' },
    { key: 'completed', label: 'Selesai' },
    { key: 'cancelled', label: 'Dibatalkan' }
  ];

  // Privacy guard: Guest CANNOT browse other people's orders; must type exact invoice/resi or sign in.
  const visibleBaseOrders = orders.filter((o) => {
    if (isAdmin) return true;
    if (isBuyer && user?.email) {
      return (o.userEmail || o.customer?.email || '').toLowerCase() === user.email.toLowerCase();
    }
    return false;
  });

  const filteredOrders = visibleBaseOrders.filter((o) => {
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'pending'
        ? o.statusKey === 'pending' || o.statusKey === 'awaiting_verification'
        : o.statusKey === statusFilter;

    if (!matchesStatus) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      o.nomorPesanan.toLowerCase().includes(q) ||
      (o.resi && o.resi.toLowerCase().includes(q)) ||
      (o.customer?.nama || '').toLowerCase().includes(q)
    );
  });

  const handleQuickTrackSubmit = (e) => {
    e.preventDefault();
    setTrackError('');
    const q = searchQuery.trim();
    if (!q) return;
    const exact = orders.find(
      (o) =>
        o.nomorPesanan.toLowerCase() === q.toLowerCase() ||
        (o.resi && o.resi.toLowerCase() === q.toLowerCase())
    );
    if (exact) {
      onSelectOrder(exact.nomorPesanan);
    } else {
      setTrackError(`Nomor invoice atau resi "${q}" tidak ditemukan.`);
    }
  };

  return (
    <div className="bg-white text-[#1D1D1F] min-h-screen">
      {/* 1. Full-Width Clean Apple Tracking Header (#F5F5F7) */}
      <section className="w-full bg-[#F5F5F7] py-12 sm:py-16">
        <div className="max-w-[920px] mx-auto px-4 sm:px-6 space-y-6">
          <Reveal>
            <div className="text-center space-y-2">
              <h1 className="tc-section-title text-[#1D1D1F]">
                Lacak &amp; Riwayat Pesanan
              </h1>
              <p className="text-[15px] sm:text-[17px] text-[#6E6E73]">
                {isBuyer
                  ? `Masuk sebagai ${user?.email}`
                  : isAdmin
                  ? 'Menampilkan seluruh pesanan toko'
                  : 'Masukkan nomor invoice atau resi ekspedisi untuk melihat status paket.'}
              </p>
            </div>
          </Reveal>

          <form
            onSubmit={handleQuickTrackSubmit}
            className="max-w-[680px] mx-auto flex flex-col sm:flex-row gap-2.5"
          >
            <div className="relative flex-1">
              <Search
                size={16}
                strokeWidth={1.7}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6E73]"
              />
              <input
                type="text"
                placeholder="Nomor invoice atau nomor resi ekspedisi"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setTrackError('');
                }}
                className="w-full h-[46px] pl-11 pr-4 bg-white text-[#1D1D1F] placeholder:text-[#6E6E73] rounded-[980px] text-[14px] sm:text-[15px] border border-[#D2D2D7]/80 focus:border-[#0071E3] focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="h-[46px] px-7 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[15px] font-normal transition-colors shrink-0 cursor-pointer"
            >
              Lacak
            </button>
          </form>

          {trackError && (
            <div className="max-w-[680px] mx-auto p-3.5 rounded-[14px] bg-white text-[#D70015] text-[13px] flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{trackError}</span>
            </div>
          )}
        </div>
      </section>

      {/* 2. Guest Privacy Notice OR Authenticated Order List on Pure White */}
      <section className="max-w-[920px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        {isGuest ? (
          <Reveal>
            <div className="bg-[#F5F5F7] rounded-[28px] p-10 sm:p-14 text-center space-y-3">
              <Package size={30} strokeWidth={1.4} className="text-[#6E6E73] mx-auto" />
              <h2 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">
                Riwayat pesanan dilindungi privasi
              </h2>
              <p className="text-[14px] sm:text-[15px] text-[#6E6E73] max-w-md mx-auto leading-relaxed">
                Untuk melacak paket tanpa masuk, ketik nomor invoice atau nomor resi Anda pada kolom di atas. Atau masuk ke akun untuk melihat seluruh riwayat pesanan Anda.
              </p>
              <div className="pt-3 flex items-center justify-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => openAuthModal('login', 'Masuk untuk melihat riwayat pesanan akun Anda.')}
                  className="h-[40px] px-6 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-normal transition-colors cursor-pointer"
                >
                  Masuk ke Akun
                </button>
                <button
                  type="button"
                  onClick={onBackToShop}
                  className="h-[40px] px-6 rounded-[980px] border border-[#0071E3] text-[#0071E3] hover:bg-[#0071E3] hover:text-white text-[14px] font-normal transition-colors cursor-pointer"
                >
                  Lihat Katalog
                </button>
              </div>
            </div>
          </Reveal>
        ) : (
          <>
            {/* Borderless Apple Pill Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {statusTabs.map((tab) => {
                const active = statusFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setStatusFilter(tab.key)}
                    className={`px-4 h-[36px] rounded-[980px] text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#1D1D1F] text-white font-medium'
                        : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED] font-normal'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Count line */}
            <p className="text-[13px] text-[#6E6E73]">
              {filteredOrders.length} pesanan ditemukan
            </p>

            {/* List */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((n) => (
                  <div key={n} className="bg-[#F5F5F7] rounded-[24px] p-6 space-y-3">
                    <div className="h-4 w-44 rounded tc-skeleton" />
                    <div className="h-16 w-full rounded-2xl tc-skeleton" />
                  </div>
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-[#F5F5F7] rounded-[28px] p-12 sm:p-16 text-center space-y-3">
                <Package size={30} strokeWidth={1.4} className="text-[#6E6E73] mx-auto" />
                <p className="text-[20px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">
                  Pesanan tidak ditemukan
                </p>
                <p className="text-[14px] text-[#6E6E73] max-w-sm mx-auto">
                  Belum ada pesanan yang sesuai dengan filter atau kata kunci pencarian Anda.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onBackToShop}
                    className="h-[40px] px-6 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-normal transition-colors cursor-pointer"
                  >
                    Mulai Belanja
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord, idx) => {
                  const latestTrack = ord.trackingHistory?.[0];
                  const firstItem = ord.items?.[0];
                  const statusColor = getOrderStatusColor(ord.statusKey || ord.paymentStatus);

                  return (
                    <Reveal key={ord.id} delay={idx * 0.03}>
                      <div
                        onClick={() => onSelectOrder(ord.nomorPesanan)}
                        className="bg-[#F5F5F7] hover:bg-[#EFEFF2] rounded-[24px] p-5 sm:p-6 transition-colors cursor-pointer space-y-4"
                      >
                        {/* Header row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-[15px] font-semibold tracking-[-0.01em] text-[#1D1D1F]">
                              #{ord.nomorPesanan}
                            </span>
                            <span className={`text-[13px] font-medium ${statusColor}`}>
                              {ord.status || 'Diproses'}
                            </span>
                            {ord.resi && (
                              <span className="text-[12px] text-[#6E6E73]">
                                · Resi {ord.resi}
                              </span>
                            )}
                          </div>
                          <span className="text-[12px] text-[#6E6E73]">{formatDate(ord.tanggal)}</span>
                        </div>

                        {/* Body row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#D2D2D7]/60">
                          <div className="flex items-center gap-4 min-w-0">
                            {firstItem && (
                              <div className="w-16 h-16 rounded-2xl bg-white p-2 flex items-center justify-center shrink-0">
                                <img
                                  src={firstItem.gambar || '/assets/products/thinkpad-x1-carbon-front.png'}
                                  alt={firstItem.nama}
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                            )}
                            <div className="min-w-0 space-y-0.5">
                              <p className="text-[16px] font-semibold tracking-[-0.015em] text-[#1D1D1F] truncate">
                                {firstItem?.nama || 'Perangkat IT TechCare'}
                                {ord.items.length > 1 && ` (+${ord.items.length - 1} lainnya)`}
                              </p>
                              {firstItem?.specLabel && (
                                <p className="text-[13px] text-[#6E6E73] truncate">{firstItem.specLabel}</p>
                              )}
                              {latestTrack && (
                                <p className="text-[12px] text-[#6E6E73] flex items-center gap-1 pt-0.5 truncate">
                                  <MapPin size={12} strokeWidth={1.7} className="shrink-0 text-[#0071E3]" />
                                  <span className="truncate">
                                    {latestTrack.status} — {latestTrack.lokasi}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#D2D2D7]/60 shrink-0">
                            <div className="sm:text-right">
                              <span className="text-[11px] text-[#6E6E73] block">Total</span>
                              <span className="text-[17px] font-semibold text-[#1D1D1F] tabular-nums">
                                {formatIDR(ord.total)}
                              </span>
                            </div>

                            <span className="inline-flex items-center gap-0.5 text-[14px] text-[#0071E3] font-normal">
                              <span>Detail</span>
                              <ChevronRight size={16} strokeWidth={1.8} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
