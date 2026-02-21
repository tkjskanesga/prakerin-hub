export function getCountdown(targetDate) {
  const now = new Date();
  const targets = new Date(targetDate);
  let diff = Math.max(0, targets - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff %= 1000 * 60 * 60 * 24;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff %= 1000 * 60 * 60;
  const minutes = Math.floor(diff / (1000 * 60));
  diff %= 1000 * 60;
  const seconds = Math.floor(diff / 1000);

  let parts = [];
  if (days > 0) parts.push(`${days} hari`);
  if (hours > 0) parts.push(`${hours} jam`);
  if (minutes > 0) parts.push(`${minutes} menit`);
  if (seconds > 0) parts.push(`${seconds} detik`);

  return parts.length > 0 ? parts.join(", ") + " lagi" : "Waktu habis";
}

export function timeAgo(date) {
  const now = new Date();
  const targets = new Date(date);
  const diff = Math.floor((now - targets) / 1000);

  if (diff < 60) return `${diff} detik yang lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari yang lalu`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)} minggu yang lalu`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} bulan yang lalu`;
  return `${Math.floor(diff / 31536000)} tahun yang lalu`;
}

export function formatDate(dateprm) {
  const date = new Date(dateprm);
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const dayName = hari[date.getDay()];
  const day = date.getDate();
  const monthName = bulan[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}, ${day} ${monthName} ${year}`;
}
