export function formatIDR(amount) {
  const number = Number(amount) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
}

export function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function formatWeight(grams) {
  const g = Number(grams) || 0;
  if (g >= 1000) {
    return `${(g / 1000).toFixed(g % 1000 === 0 ? 0 : 1)} kg`;
  }
  return `${g} gram`;
}

export function getRemainingTime(deadlineIso) {
  if (!deadlineIso) return null;
  const diff = new Date(deadlineIso).getTime() - Date.now();
  if (diff <= 0) {
    return { expired: true, text: 'Batas waktu habis', hours: 0, minutes: 0, seconds: 0 };
  }
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return {
    expired: false,
    hours,
    minutes,
    seconds,
    text: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  };
}

// Map order & payment status to clean Indonesian labels & badges
export function getStatusBadge(status) {
  switch (status) {
    case 'pending':
      return { label: 'Menunggu Bayar', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
    case 'awaiting_verification':
      return { label: 'Menunggu Verifikasi', bg: 'bg-sky-50 text-sky-800 border-sky-200' };
    case 'paid':
      return { label: 'Dibayar', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    case 'processing':
      return { label: 'Dikemas & QC', bg: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
    case 'shipped':
      return { label: 'Dikirim', bg: 'bg-purple-50 text-purple-800 border-purple-200' };
    case 'completed':
      return { label: 'Selesai', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    case 'rejected':
      return { label: 'Pembayaran Ditolak', bg: 'bg-rose-50 text-rose-800 border-rose-200' };
    case 'cancelled':
      return { label: 'Dibatalkan', bg: 'bg-neutral-100 text-neutral-600 border-neutral-300' };
    default:
      return { label: status || 'Diproses', bg: 'bg-neutral-50 text-neutral-700 border-neutral-200' };
  }
}
