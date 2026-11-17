import React, { useState, useEffect } from 'react';
import { Package, Search, ArrowRight } from 'lucide-react';
import { getOrders } from '../services/api';
import { formatIDR, formatDate } from '../utils/format';
import Reveal from '../components/Reveal';

export default function OrderHistoryPage({ onSelectOrder, onBackToShop }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.nomorPesanan.toLowerCase().includes(q) ||
      o.customer?.nama?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-[#fcfcfd] min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <Reveal>
          <div className="text-center sm:text-left">
            <span className="text-[11px] uppercase tracking-[0.22em] font-semibold text-neutral-400 block mb-1">
              PELACAKAN PESANAN
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 font-normal">
              Riwayat Pembelian
            </h1>
          </div>
        </Reveal>

        {/* Tracking Search Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-100 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2">
            Lacak dengan Nomor Pesanan
          </h3>
          <p className="text-xs text-neutral-500 mb-4">
            Masukkan nomor pesanan (contoh: <code>NOV-261117-8192</code>) untuk memeriksa status pengiriman.
          </p>

          <div className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-3 text-neutral-400" />
              <input
                type="text"
                placeholder="Nomor Pesanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#f8f8fa] border border-neutral-200 rounded-xl text-xs outline-none focus:border-black transition-all"
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
            Daftar Pesanan ({filteredOrders.length})
          </h3>

          {loading ? (
            <div className="text-center py-16 text-xs text-neutral-400">
              Memuat data pesanan...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-neutral-100 space-y-3">
              <Package size={36} className="text-neutral-300 mx-auto" />
              <p className="font-serif text-lg text-neutral-800">Belum Ada Pesanan</p>
              <p className="text-xs text-neutral-500">Anda belum memiliki riwayat pembelian.</p>
              <button
                onClick={onBackToShop}
                className="mt-2 px-6 py-2.5 bg-black text-white rounded-full text-xs font-semibold tracking-wider uppercase hover:bg-neutral-800 transition-colors"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((ord, idx) => (
                <Reveal key={ord.id} delay={idx * 0.05}>
                  <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-200 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-sm font-bold text-neutral-900">
                          #{ord.nomorPesanan}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-800 uppercase tracking-wider">
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        {formatDate(ord.tanggal)} • {ord.items.length} item • {ord.metodeBayar}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-5 border-t sm:border-t-0 pt-2 sm:pt-0">
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                          Total
                        </span>
                        <span className="text-sm font-bold text-neutral-900">
                          {formatIDR(ord.total)}
                        </span>
                      </div>

                      <button
                        onClick={() => onSelectOrder(ord.nomorPesanan)}
                        className="px-4 py-2 bg-neutral-100 hover:bg-black hover:text-white rounded-full text-xs font-semibold transition-all flex items-center space-x-1"
                      >
                        <span>Detail</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
