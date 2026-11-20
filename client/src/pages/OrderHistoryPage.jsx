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

  // Filter kepemilikan pesanan: Buyer melihat pesanannya sendiri, Admin melihat semua, Guest melihat demo tracking publik
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
    <div className="bg-[#f9f9f8] min-h-screen py-6 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-7">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5">
            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-neutral-400 block mb-1">
                PELACAKAN PESANAN &amp; RESI REAL-TIME
              </span>
              <h1 className="font-serif text-2xl sm:text-4xl text-neutral-900 font-medium">
                Lacak &amp; Riwayat Pesanan
              </h1>
            </div>
            <p className="text-xs text-neutral-500">
              {isBuyer
                ? `Menampilkan riwayat belanja untuk ${user?.email}`
                : isAdmin
                ? 'Mode Admin: menampilkan seluruh pesanan toko'
                : 'Masukkan nomor invoice/resi untuk melacak paket Anda.'}
            </p>
          </div>
        </Reveal>

        {/* Tracking Search Box */}
        <div className="bg-white rounded-3xl p-4 sm:p-7 border border-neutral-200/70 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
            <Truck size={16} />
            <span>Lacak Paket dengan Nomor Invoice atau Resi</span>
          </div>

          <form onSubmit={handleQuickTrackSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="No. Invoice (mis. TC-261117-9102) atau No. Resi (JNE...)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setTrackError('');
                }}
                className="w-full pl-11 pr-4 py-3 bg-[#f5f5f4] border border-neutral-200 rounded-full text-xs outline-none focus:border-black focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 min-h-[42px] bg-black text-white hover:bg-neutral-800 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
            >
              Lacak Sekarang
            </button>
          </form>

          {trackError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{trackError}</span>
            </div>
          )}

          {/* Quick Demo Invoice Chips */}
          {orders.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap text-[11px] text-neutral-500">
              <span>Coba cepat:</span>
              {orders.slice(0, 3).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => onSelectOrder(o.nomorPesanan)}
                  className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-black hover:text-white font-mono text-[10px] font-semibold text-neutral-700 transition-colors"
                >
                  {o.nomorPesanan}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-2 min-h-[38px] rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.key
                  ? 'bg-black text-white'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:border-black hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
            Daftar Pesanan ({filteredOrders.length})
          </h3>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div key={n} className="bg-white rounded-3xl p-6 border border-neutral-200/70 animate-pulse space-y-3">
                  <div className="h-4 w-40 bg-neutral-200 rounded-full" />
                  <div className="h-14 w-full bg-neutral-100 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 sm:p-12 text-center border border-neutral-200/70 space-y-3">
              <Package size={36} className="text-neutral-300 mx-auto" />
              <p className="font-serif text-lg text-neutral-800">Pesanan Tidak Ditemukan</p>
              <p className="text-xs text-neutral-500">
                Belum ada pesanan yang sesuai filter atau pencarian Anda.
              </p>
              <button
                onClick={onBackToShop}
                className="mt-2 px-6 py-3 bg-black text-white rounded-full text-xs font-semibold tracking-wider uppercase hover:bg-neutral-800 transition-colors"
              >
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
                      className="bg-white rounded-3xl p-4 sm:p-6 border border-neutral-200/70 hover:border-neutral-900 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm font-bold text-neutral-900">
                            #{ord.nomorPesanan}
                          </span>
                          <span
                            className={`px-3 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${badge.bg}`}
                          >
                            {ord.status || badge.label}
                          </span>
                          {ord.resi && (
                            <span className="text-[11px] font-mono text-neutral-500 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                              Resi: {ord.resi}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-neutral-400">
                          {formatDate(ord.tanggal)}
                        </span>
                      </div>

                      {/* Product Preview + Latest Tracking Snippet */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-neutral-100">
                        <div className="flex items-center gap-3.5 min-w-0">
                          {firstItem && (
                            <div className="w-14 h-14 rounded-2xl bg-[#f4f4f5] p-1.5 flex items-center justify-center flex-shrink-0">
                              <img
                                src={firstItem.gambar || '/images/products/thinkpad-x1-carbon-front.jpg'}
                                alt={firstItem.nama}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                          )}
                          <div className="min-w-0 space-y-0.5">
                            <p className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                              {firstItem?.nama || 'Perangkat IT TECHCARE'}
                              {ord.items.length > 1 && ` (+${ord.items.length - 1} lainnya)`}
                            </p>
                            {firstItem?.specLabel && (
                              <p className="text-[11px] text-neutral-500 truncate">
                                {firstItem.specLabel}
                              </p>
                            )}
                            {latestTrack && (
                              <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 pt-0.5 truncate">
                                <MapPin size={11} className="flex-shrink-0" />
                                <span className="truncate">
                                  {latestTrack.status} — {latestTrack.lokasi}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 flex-shrink-0">
                          <div className="sm:text-right">
                            <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                              Total Belanja
                            </span>
                            <span className="text-sm sm:text-base font-bold text-neutral-900">
                              {formatIDR(ord.total)}
                            </span>
                          </div>

                          <span className="px-4 py-2.5 bg-black text-white rounded-full text-xs font-semibold flex items-center gap-1.5">
                            <span>Detail</span>
                            <ArrowRight size={13} />
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
