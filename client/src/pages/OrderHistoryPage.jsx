import React, { useState, useEffect } from 'react';
import { Package, Search, ChevronRight, AlertCircle, Lock } from 'lucide-react';
import { getOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatIDR, formatDate } from '../utils/format';

function getOrderMeta(statusKey) {
  switch (statusKey) {
    case 'completed':
      return { color: 'text-[#1D7F3E]', bar: 'bg-[#1D7F3E]', pct: 100 };
    case 'shipped':
      return { color: 'text-[#0071E3]', bar: 'bg-[#0071E3]', pct: 82 };
    case 'processing':
      return { color: 'text-[#0071E3]', bar: 'bg-[#0071E3]', pct: 64 };
    case 'paid':
      return { color: 'text-[#0071E3]', bar: 'bg-[#0071E3]', pct: 48 };
    case 'awaiting_verification':
      return { color: 'text-[#B64400]', bar: 'bg-[#0071E3]', pct: 32 };
    case 'cancelled':
      return { color: 'text-[#D70015]', bar: 'bg-[#D70015]', pct: 100 };
    default:
      return { color: 'text-[#B64400]', bar: 'bg-[#0071E3]', pct: 16 };
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
    { key: 'pending', label: 'Menunggu' },
    { key: 'paid', label: 'Dibayar' },
    { key: 'processing', label: 'QC & Kemas' },
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
    <div className="bg-[#F5F5F7] text-[#1D1D1F] min-h-screen py-8 sm:py-12 pb-24 sm:pb-16">
      <div className="max-w-[880px] mx-auto px-4 sm:px-6 space-y-6">
        {/* Clean Left-Aligned Apple Store Header */}
        <header className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-[-0.03em] leading-[1.08] text-[#1D1D1F]">
                Pesanan
              </h1>
              <p className="text-[14px] text-[#6E6E73] mt-1">
                {isBuyer
                  ? `Riwayat pesanan untuk ${user?.email}`
                  : isAdmin
                  ? 'Seluruh pesanan aktif & riwayat toko'
                  : 'Lacak pengiriman dengan nomor invoice atau resi ekspedisi.'}
              </p>
            </div>
            {!isGuest && (
              <span className="text-[13px] text-[#6E6E73] tabular-nums">
                {filteredOrders.length} pesanan
              </span>
            )}
          </div>

          {/* Crisp White Search & Quick Track Bar */}
          <form onSubmit={handleQuickTrackSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={16}
                strokeWidth={1.7}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868B]"
              />
              <input
                type="text"
                placeholder="Masukkan nomor invoice (mis. TC-...) atau resi"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setTrackError('');
                }}
                className="w-full h-[46px] pl-11 pr-4 bg-white text-[#1D1D1F] placeholder:text-[#86868B] rounded-[14px] text-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.06] focus:ring-2 focus:ring-[#0071E3] focus:outline-none transition-shadow"
              />
            </div>
            <button
              type="submit"
              className="h-[46px] px-6 rounded-[14px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-medium transition-colors shrink-0 cursor-pointer"
            >
              Lacak
            </button>
          </form>

          {trackError && (
            <div className="p-3.5 rounded-[14px] bg-white text-[#D70015] text-[13px] flex items-center gap-2 ring-1 ring-black/[0.05]">
              <AlertCircle size={15} className="shrink-0" />
              <span>{trackError}</span>
            </div>
          )}
        </header>

        {/* Guest Privacy Card OR Authenticated Order Cards */}
        {isGuest ? (
          <section className="bg-white rounded-[22px] p-8 sm:p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.05] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F5F5F7] text-[#6E6E73] flex items-center justify-center mx-auto">
              <Lock size={20} strokeWidth={1.6} />
            </div>
            <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">
              Riwayat pesanan dilindungi privasi
            </h2>
            <p className="text-[14px] text-[#6E6E73] max-w-md mx-auto leading-relaxed">
              Ketik nomor invoice atau nomor resi pada kolom di atas untuk melacak paket, atau masuk ke akun Anda untuk melihat daftar pesanan.
            </p>
            <div className="pt-3 flex items-center justify-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => openAuthModal('login', 'Masuk untuk melihat riwayat pesanan akun Anda.')}
                className="h-[44px] px-6 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-normal transition-colors cursor-pointer"
              >
                Masuk ke Akun
              </button>
              <button
                type="button"
                onClick={onBackToShop}
                className="h-[44px] px-6 rounded-[980px] bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] text-[14px] font-normal transition-colors cursor-pointer"
              >
                Lihat Katalog
              </button>
            </div>
          </section>
        ) : (
          <div className="space-y-4">
            {/* Compact iOS Filter Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              {statusTabs.map((tab) => {
                const active = statusFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setStatusFilter(tab.key)}
                    className={`px-3.5 h-[36px] rounded-[980px] text-[13px] whitespace-nowrap transition-all cursor-pointer ${
                      active
                        ? 'bg-[#1D1D1F] text-white font-medium'
                        : 'bg-white text-[#424245] hover:text-[#1D1D1F] ring-1 ring-black/[0.06]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((n) => (
                  <div key={n} className="bg-white rounded-[20px] p-6 space-y-3 ring-1 ring-black/[0.04]">
                    <div className="h-4 w-44 rounded tc-skeleton" />
                    <div className="h-16 w-full rounded-xl tc-skeleton" />
                  </div>
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-[22px] p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.05] space-y-3">
                <Package size={26} strokeWidth={1.5} className="text-[#86868B] mx-auto" />
                <p className="text-[18px] font-semibold tracking-[-0.015em] text-[#1D1D1F]">
                  Tidak ada pesanan
                </p>
                <p className="text-[14px] text-[#6E6E73] max-w-sm mx-auto">
                  Belum ada pesanan yang sesuai dengan filter atau pencarian saat ini.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onBackToShop}
                    className="h-[44px] px-6 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-normal transition-colors cursor-pointer"
                  >
                    Mulai Belanja
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredOrders.map((ord) => {
                  const latestTrack = ord.trackingHistory?.[0];
                  const firstItem = ord.items?.[0];
                  const meta = getOrderMeta(ord.statusKey || ord.paymentStatus);

                  return (
                    <article
                      key={ord.id}
                      onClick={() => onSelectOrder(ord.nomorPesanan)}
                      className="bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] rounded-[20px] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.05] transition-shadow cursor-pointer space-y-4"
                    >
                      {/* Top Row: Human Status First + Subtle Invoice/Date */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <p className={`text-[15px] font-semibold tracking-[-0.01em] ${meta.color}`}>
                          {latestTrack?.status || ord.status || 'Diproses'}
                        </p>
                        <p className="text-[12px] text-[#6E6E73] tabular-nums">
                          #{ord.nomorPesanan} · {formatDate(ord.tanggal)}
                        </p>
                      </div>

                      {/* Middle Row: Prominent Product Cutout + Info + Sleek Progress Line */}
                      <div className="flex items-center gap-4">
                        {firstItem && (
                          <div className="w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-[16px] bg-[#F5F5F7] p-2.5 flex items-center justify-center shrink-0">
                            <img
                              src={firstItem.gambar || '/assets/products/thinkpad-x1-carbon-front.png'}
                              alt={firstItem.nama}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div>
                            <h2 className="text-[16px] font-semibold tracking-[-0.015em] text-[#1D1D1F] truncate">
                              {firstItem?.nama || 'Perangkat IT TechCare'}
                              {ord.items.length > 1 && ` (+${ord.items.length - 1})`}
                            </h2>
                            <p className="text-[13px] text-[#6E6E73] truncate">
                              {firstItem?.specLabel || ord.kurir}
                              {ord.resi ? ` · Resi ${ord.resi}` : ''}
                            </p>
                          </div>

                          {/* Thin Apple progress bar directly on card */}
                          <div className="h-[3px] w-full max-w-[260px] bg-[#E5E5EA] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${meta.bar}`}
                              style={{ width: `${meta.pct}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bottom Hairline Row: Total + Clean Apple Blue Link */}
                      <div className="flex items-center justify-between pt-3.5 border-t border-[#E5E5EA]">
                        <div className="flex items-baseline gap-2">
                          <span className="text-[12px] text-[#6E6E73]">Total</span>
                          <span className="text-[15px] font-semibold text-[#1D1D1F] tabular-nums">
                            {formatIDR(ord.total)}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-0.5 text-[14px] text-[#0071E3] font-medium">
                          <span>Lihat detail</span>
                          <ChevronRight size={15} strokeWidth={2} />
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
