import React, { useState, useEffect } from 'react';
import { Package, Search, ArrowRight, Truck, MapPin, AlertCircle } from 'lucide-react';
import { getOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatIDR, formatDate, getStatusBadge } from '../utils/format';
import Reveal from '../components/Reveal';

export default function OrderHistoryPage({ onSelectOrder, onBackToShop }) {
  const { user, isAdmin, isBuyer } = useAuth();
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

  const visibleBaseOrders = orders.filter((o) => {
    if (isAdmin) return true;
    if (isBuyer && user?.email) {
      return (o.userEmail || o.customer?.email || '').toLowerCase() === user.email.toLowerCase();
    }
    return true;
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
    <div className="bg-[#F4F6FA] min-h-screen py-6 sm:py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Navy Header + Tracking Search */}
        <Reveal>
          <div className="bg-gradient-to-r from-[#0B1220] to-[#12264A] text-white rounded-3xl p-5 sm:p-8 border border-slate-800 space-y-5 relative overflow-hidden shadow-tc-float">
            <div className="absolute inset-0 tc-tech-grid opacity-40 pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#38BDF8] block mb-1">
                  PELACAKAN PESANAN &amp; RESI REAL-TIME
                </span>
                <h1 className="font-display text-2xl sm:text-4xl font-bold text-white">
                  Lacak &amp; Riwayat Pesanan
                </h1>
              </div>
              <p className="text-xs text-slate-300">
                {isBuyer
                  ? `Akun: ${user?.email}`
                  : isAdmin
                  ? 'Mode Admin: semua pesanan toko'
                  : 'Masukkan nomor invoice atau resi ekspedisi'}
              </p>
            </div>

            <form onSubmit={handleQuickTrackSubmit} className="relative z-10 flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="No. Invoice (mis. TC-261117-9102) atau No. Resi (JNE...)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setTrackError('');
                  }}
                  className="w-full min-h-[46px] pl-11 pr-4 py-2.5 bg-white text-slate-900 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#38BDF8]"
                />
              </div>
              <button type="submit" className="tc-btn-primary px-6 shrink-0">
                <Truck size={15} />
                <span>Lacak Paket</span>
              </button>
            </form>

            {trackError && (
              <div className="relative z-10 p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-100 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{trackError}</span>
              </div>
            )}

            {orders.length > 0 && (
              <div className="relative z-10 flex items-center gap-2 flex-wrap text-[11px] text-slate-300">
                <span>Coba cepat:</span>
                {orders.slice(0, 3).map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => onSelectOrder(o.nomorPesanan)}
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-[#0B5FFF] border border-white/15 font-mono text-[11px] font-semibold text-white transition-colors"
                  >
                    {o.nomorPesanan}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 min-h-[40px] rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.key
                  ? 'bg-[#0B5FFF] text-white shadow-tc-primary'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-[#0B5FFF] hover:text-[#0B5FFF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-600">
              Daftar Pesanan ({filteredOrders.length})
            </h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
                  <div className="h-4 w-44 rounded tc-skeleton" />
                  <div className="h-16 w-full rounded-xl tc-skeleton" />
                </div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 sm:p-14 text-center border border-slate-200 shadow-tc-card space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#EEF4FF] text-[#0B5FFF] flex items-center justify-center mx-auto">
                <Package size={26} />
              </div>
              <p className="font-display text-lg font-bold text-[#0B1220]">Pesanan Tidak Ditemukan</p>
              <p className="text-xs text-slate-500">
                Belum ada pesanan yang sesuai filter atau kata kunci pencarian Anda.
              </p>
              <button onClick={onBackToShop} className="tc-btn-primary">
                Mulai Belanja
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredOrders.map((ord, idx) => {
                const badge = getStatusBadge(ord.statusKey || ord.paymentStatus);
                const latestTrack = ord.trackingHistory?.[0];
                const firstItem = ord.items?.[0];

                return (
                  <Reveal key={ord.id} delay={idx * 0.03}>
                    <div
                      onClick={() => onSelectOrder(ord.nomorPesanan)}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:border-[#0B5FFF] shadow-tc-card hover:shadow-tc-hover transition-all cursor-pointer space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm font-bold text-[#0B5FFF]">
                            #{ord.nomorPesanan}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border uppercase ${badge.bg}`}
                          >
                            {ord.status || badge.label}
                          </span>
                          {ord.resi && (
                            <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                              Resi: {ord.resi}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">{formatDate(ord.tanggal)}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-3.5 min-w-0">
                          {firstItem && (
                            <div className="w-14 h-14 rounded-xl bg-[#EEF2F7] p-1.5 flex items-center justify-center shrink-0">
                              <img
                                src={firstItem.gambar || '/images/products/thinkpad-x1-carbon-front.jpg'}
                                alt={firstItem.nama}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                          )}
                          <div className="min-w-0 space-y-0.5">
                            <p className="font-display text-sm font-bold text-[#0B1220] truncate">
                              {firstItem?.nama || 'Perangkat IT TECHCARE'}
                              {ord.items.length > 1 && ` (+${ord.items.length - 1} lainnya)`}
                            </p>
                            {firstItem?.specLabel && (
                              <p className="text-[11px] text-slate-500 truncate">{firstItem.specLabel}</p>
                            )}
                            {latestTrack && (
                              <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 pt-0.5 truncate">
                                <MapPin size={12} className="shrink-0" />
                                <span className="truncate">
                                  {latestTrack.status} — {latestTrack.lokasi}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 shrink-0">
                          <div className="sm:text-right">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">
                              Total Belanja
                            </span>
                            <span className="font-display text-base font-bold text-[#0B1220] tabular-nums">
                              {formatIDR(ord.total)}
                            </span>
                          </div>

                          <span className="min-h-[40px] px-4 bg-[#EEF4FF] text-[#0B5FFF] border border-[#C7DCFF] rounded-xl text-xs font-bold inline-flex items-center gap-1.5">
                            <span>Detail</span>
                            <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
