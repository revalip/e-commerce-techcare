import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Truck, Package, ShieldCheck, Copy, Check, Upload, AlertCircle, ArrowLeft } from 'lucide-react';
import { formatIDR, formatDate, getStatusBadge } from '../utils/format';

export default function OrderDetailPage({ orderNumber, onBackToShop }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Payment proof form state
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  // Bank & QRIS details
  const [paymentInfo, setPaymentInfo] = useState({
    bank: {
      name: 'Bank Central Asia (BCA)',
      account_number: '8271039821',
      account_holder: 'PT NOVAIRE INDONESIA'
    },
    qris: {
      merchant_name: 'NOVAIRE OFFICIAL INDONESIA',
      image_url: '/images/qris-novaire.svg'
    }
  });

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${orderNumber}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setOrder(data.order);
      } else {
        // Fallback from localStorage demo orders
        const demoOrders = JSON.parse(localStorage.getItem('novaire_demo_orders') || '[]');
        const found = demoOrders.find(o => o.order_number === orderNumber);
        if (found) {
          setOrder(found);
        } else {
          setError(data.message || 'Pesanan tidak ditemukan.');
        }
      }
    } catch {
      const demoOrders = JSON.parse(localStorage.getItem('novaire_demo_orders') || '[]');
      const found = demoOrders.find(o => o.order_number === orderNumber);
      if (found) {
        setOrder(found);
      } else {
        setError('Gagal memuat informasi pesanan.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    fetch('/api/settings/payment-info')
      .then(res => res.json())
      .then(data => { if (data.success) setPaymentInfo(data); })
      .catch(() => {});
  }, [orderNumber]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadProof = async (e) => {
    e.preventDefault();
    if (!proofFile) {
      alert('Silakan pilih foto bukti transfer terlebih dahulu.');
      return;
    }

    setUploading(true);
    setUploadSuccess('');

    try {
      const formData = new FormData();
      formData.append('payment_proof', proofFile);
      if (notes) formData.append('notes', notes);

      const res = await fetch(`/api/orders/${orderNumber}/payment-proof`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal mengunggah bukti.');

      setUploadSuccess('Bukti transfer berhasil dikirim! Menunggu konfirmasi admin.');
      setOrder(prev => ({
        ...prev,
        payment_status: 'awaiting_verification',
        payment_proof_url: data.payment_proof_url
      }));
    } catch (err) {
      // Local fallback
      setUploadSuccess('Bukti transfer tersimpan (Demo Mode). Status pesanan kini Menunggu Verifikasi.');
      setOrder(prev => ({
        ...prev,
        payment_status: 'awaiting_verification',
        payment_proof_url: proofPreview
      }));
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-neutral-500 font-semibold tracking-wider uppercase">Memuat Pesanan...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd] px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm text-center space-y-4">
          <AlertCircle size={36} className="text-red-500 mx-auto" />
          <h2 className="font-serif text-xl text-neutral-900">Pesanan Tidak Ditemukan</h2>
          <p className="text-xs text-neutral-500">{error || 'Nomor pesanan yang dicari tidak ada.'}</p>
          <button
            onClick={onBackToShop}
            className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const badge = getStatusBadge(order.payment_status);

  // Status timeline steps
  const steps = [
    { key: 'pending', title: 'Menunggu Pembayaran' },
    { key: 'awaiting_verification', title: 'Verifikasi Admin' },
    { key: 'processing', title: 'Diproses' },
    { key: 'shipped', title: 'Dikirim' },
    { key: 'completed', title: 'Selesai' }
  ];

  const getStepActiveIndex = () => {
    if (order.order_status === 'completed') return 4;
    if (order.order_status === 'shipped') return 3;
    if (order.order_status === 'processing' || order.payment_status === 'paid') return 2;
    if (order.payment_status === 'awaiting_verification') return 1;
    return 0;
  };

  const activeIndex = getStepActiveIndex();

  return (
    <div className="bg-[#fcfcfd] min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-6">
          <div>
            <button
              onClick={onBackToShop}
              className="inline-flex items-center space-x-1.5 text-xs text-neutral-500 hover:text-black mb-2 transition-colors uppercase font-semibold"
            >
              <ArrowLeft size={14} />
              <span>Kembali Berbelanja</span>
            </button>
            <h1 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal">
              Pesanan #{order.order_number}
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Dibuat pada {formatDate(order.created_at)}
            </p>
          </div>

          <div className="self-start sm:self-auto">
            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border ${badge.bg}`}>
              {badge.label}
            </span>
          </div>
        </div>

        {/* Stepper Timeline */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-100 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {steps.map((st, i) => {
              const isPassed = i <= activeIndex;
              const isCurrent = i === activeIndex;
              return (
                <div key={st.key} className="flex flex-col items-center text-center space-y-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                      isCurrent
                        ? 'bg-black text-white ring-4 ring-neutral-200'
                        : isPassed
                        ? 'bg-neutral-800 text-white'
                        : 'bg-neutral-100 text-neutral-400'
                    }`}
                  >
                    {isPassed ? <Check size={14} /> : i + 1}
                  </div>
                  <span className={`text-[11px] font-semibold leading-tight ${isCurrent ? 'text-black' : isPassed ? 'text-neutral-700' : 'text-neutral-400'}`}>
                    {st.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Resi notice if shipped */}
          {order.tracking_number && (
            <div className="mt-6 pt-5 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-purple-50/60 p-4 rounded-2xl border border-purple-100 text-xs">
              <div className="flex items-center space-x-2.5 text-purple-950">
                <Truck size={18} className="text-purple-700" />
                <span>Kurir: <strong>{order.courier || 'JNE Reguler'}</strong></span>
                <span>• Resi Pengiriman: <strong className="font-mono text-sm tracking-wider">{order.tracking_number}</strong></span>
              </div>
              <button
                onClick={() => handleCopy(order.tracking_number)}
                className="px-3 py-1 bg-purple-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-purple-800"
              >
                {copied ? 'Tersalin' : 'Salin Resi'}
              </button>
            </div>
          )}
        </div>

        {/* Payment Instruction & Proof Upload Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Payment Guide (Bank Transfer or QRIS) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="font-serif text-lg font-medium text-neutral-900">
                  Instruksi Pembayaran
                </h3>
                <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Total: {formatIDR(order.total_amount)}
                </span>
              </div>

              {order.payment_method === 'bank_transfer' ? (
                <div className="space-y-4">
                  <div className="bg-[#f8f8fa] p-4 rounded-2xl border border-neutral-200 space-y-3">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Bank Tujuan</p>
                      <h4 className="text-base font-bold text-neutral-900">{paymentInfo.bank.name}</h4>
                      <p className="text-xs text-neutral-600">Atas Nama: <strong>{paymentInfo.bank.account_holder}</strong></p>
                    </div>

                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-neutral-200">
                      <span className="font-mono text-base font-bold text-neutral-900 tracking-wider">
                        {paymentInfo.bank.account_number}
                      </span>
                      <button
                        onClick={() => handleCopy(paymentInfo.bank.account_number)}
                        className="px-3 py-1 bg-black text-white text-xs rounded-lg hover:bg-neutral-800 transition-colors"
                      >
                        {copied ? 'Tersalin' : 'Salin No. Rekening'}
                      </button>
                    </div>
                  </div>

                  <ol className="text-xs text-neutral-600 space-y-1.5 list-decimal pl-4 leading-relaxed">
                    <li>Buka aplikasi m-Banking atau ATM bank Anda.</li>
                    <li>Transfer sesuai total nominal: <strong>{formatIDR(order.total_amount)}</strong>.</li>
                    <li>Ambil tangkapan layar (screenshot) bukti transfer sukses.</li>
                    <li>Unggah screenshot pada form di sebelah kanan/bawah.</li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="w-56 h-64 mx-auto bg-white p-3 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-center">
                    <img
                      src={paymentInfo.qris.image_url}
                      alt="QRIS NOVAIRE"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">{paymentInfo.qris.merchant_name}</h4>
                    <p className="text-xs text-neutral-500 mt-1">
                      Pindai QRIS menggunakan BCA Mobile, Livin, GoPay, OVO, ShopeePay, atau DANA.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Upload Bukti Transfer Form */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-100 shadow-sm space-y-5">
              <div className="border-b border-neutral-100 pb-3">
                <h3 className="font-serif text-lg font-medium text-neutral-900">
                  Upload Bukti Pembayaran
                </h3>
                <p className="text-xs text-neutral-500">
                  Kirimkan bukti transfer untuk diverifikasi oleh tim admin kami.
                </p>
              </div>

              {uploadSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                  <span>{uploadSuccess}</span>
                </div>
              )}

              {/* Already uploaded preview */}
              {order.payment_proof_url && (
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-center space-y-2">
                  <p className="text-xs font-semibold text-neutral-700">Bukti yang Telah Diunggah:</p>
                  <img
                    src={order.payment_proof_url}
                    alt="Bukti Transfer"
                    className="max-h-48 rounded-xl mx-auto object-contain border border-neutral-200 shadow-sm"
                  />
                  <p className="text-[11px] text-neutral-500">Status: Menunggu verifikasi admin</p>
                </div>
              )}

              {/* Upload Form */}
              <form onSubmit={handleUploadProof} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                    Pilih Foto Bukti Transfer *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-neutral-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-neutral-800 file:cursor-pointer cursor-pointer border border-neutral-200 rounded-2xl p-1.5 bg-[#f9f9fb]"
                  />
                </div>

                {proofPreview && !order.payment_proof_url && (
                  <div className="text-center">
                    <img
                      src={proofPreview}
                      alt="Preview"
                      className="max-h-36 rounded-xl mx-auto object-contain border border-neutral-200"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                    Catatan Pembayaran (Opsional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Transfer atas nama Budi Santoso"
                    className="w-full px-4 py-2.5 bg-[#f9f9fb] border border-neutral-200 rounded-xl text-xs focus:bg-white focus:border-black outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploading || !proofFile}
                  className="w-full bg-black text-white hover:bg-neutral-800 transition-all py-3 px-6 rounded-full text-xs font-semibold tracking-wider uppercase flex items-center justify-center space-x-2 disabled:opacity-40 shadow-sm"
                >
                  <Upload size={14} />
                  <span>{uploading ? 'Mengunggah Bukti...' : 'Kirim Bukti Pembayaran'}</span>
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Order Items & Shipping Address Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-100 shadow-sm space-y-6">
          <h3 className="font-serif text-lg font-medium text-neutral-900 border-b border-neutral-100 pb-3">
            Rincian Pesanan & Alamat Pengiriman
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Produk yang Dipesan
              </h4>
              <div className="divide-y divide-neutral-100">
                {order.items && order.items.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-neutral-900">{it.product_name}</p>
                      <p className="text-[11px] text-neutral-400">{it.quantity} x {formatIDR(it.product_price)}</p>
                    </div>
                    <span className="font-semibold text-neutral-800">{formatIDR(it.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 flex justify-between text-sm font-bold border-t border-neutral-100">
                <span>Total Pembayaran:</span>
                <span>{formatIDR(order.total_amount)}</span>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="space-y-2 text-xs text-neutral-600 bg-neutral-50/70 p-4 rounded-2xl border border-neutral-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                Tujuan Pengiriman
              </h4>
              <p><strong>Penerima:</strong> {order.customer_name} ({order.customer_phone})</p>
              <p><strong>Email:</strong> {order.customer_email}</p>
              <p><strong>Alamat:</strong> {order.shipping_address}, {order.shipping_city} {order.shipping_postal_code || ''}</p>
              <p><strong>Ekspedisi:</strong> {order.courier || 'JNE Reguler'}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
