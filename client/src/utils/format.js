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
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Map order & payment status to clean Indonesian labels & badges
export function getStatusBadge(status) {
  switch (status) {
    case 'pending':
      return { label: 'Menunggu Pembayaran', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
    case 'awaiting_verification':
      return { label: 'Menunggu Verifikasi Admin', bg: 'bg-blue-50 text-blue-800 border-blue-200' };
    case 'paid':
      return { label: 'Dibayar', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    case 'processing':
      return { label: 'Diproses', bg: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
    case 'shipped':
      return { label: 'Sedang Dikirim', bg: 'bg-purple-50 text-purple-800 border-purple-200' };
    case 'completed':
      return { label: 'Selesai', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    case 'rejected':
      return { label: 'Pembayaran Ditolak', bg: 'bg-rose-50 text-rose-800 border-rose-200' };
    case 'cancelled':
      return { label: 'Dibatalkan', bg: 'bg-gray-100 text-gray-700 border-gray-300' };
    default:
      return { label: status || 'Diproses', bg: 'bg-gray-50 text-gray-700 border-gray-200' };
  }
}
