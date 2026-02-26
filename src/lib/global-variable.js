export default {
  db: {
    school_type: [
      "smk", // SMK
      "sma", // SMA
      "ma", // MA
      "smalb", // SMALB
      "kuliah", // Kuliah
      "other", // Lainnya
    ],
    school_status: [
      "negeri", // Negeri
      "swasta", // Swasta
      "universitas", // Universitas
      "other", // Lainnya
    ],
    role_users: [
      "participant", // Peserta PKL
      "mentor", // Guru / Dosen biasa / partner
      "mentor-high", // Guru Admin / Dosen
      "admin", // Admin cadangan
      "default-admin", // Admin bawaan
    ],
    trainees_activity_type: [
      "action", // Aksi (berupa tombol)
      "chat", // Pesan (berupa teks / file)
      "file", // Hanya menunggah file
    ],
    trainees_type: [
      "participant", // Peserta PKL
      "partner", // Partner PKL
    ],
    trainees_status: [
      "draft", // Pembuatan Grup & Menunggu Peserta
      "deleting", // Dihapus oleh admin
      "submission", // Pengajuan anggota ke PKL (Meminta persetujuan)
      "rejected", // Ditolak atas pengajuan ke sekolah (Ditolak Guru Admin)
      "letter_acceptance", // Penerimaan Surat (Mengirim surat ke PKL)
      "letter_submission", // Pengiriman Surat (Mengirim surat ke Guru Admin)
      "rejection_pkl", // Ditolaknya oleh pihak PKL
      "acceptance_pkl", // Diterimanya oleh pihak PKL
      "ongoing", // Sedang PKL
      "completed", // Selesai PKL
    ],
    default_worker_duration: 30 * 4, // 4 month
    default_minimum_group: 1, // 1 person
    default_maximum_group: 4, // 4 person
  },
  context_info: {
    role_slug: {
      "participant": "participant", // Student
      "mentor": "mentor", // Teacher / Dosen biasa / partner
      "mentor-high": "mentor", // Teacher Admin / Dosen Admin
      "admin": "admin", // Admin cadangan
      "default-admin": "admin", // Admin bawaan
    },
    school_type_slug: {
      smk: "SMK (Sekolah Menengah Kejuruan)",
      sma: "SMA (Sekolah Menengah Atas)",
      ma: "MA (Madrasah Aliyah)",
      smalb: "SMALB (Sekolah Menengah Atas Luar Biasa)",
      kuliah: "Kuliah (Perguruan Tinggi)",
      other: "Lainnya",
    },
    school_status_slug: {
      negeri: "Negeri",
      swasta: "Swasta",
      universitas: "Universitas",
      other: "Lainnya",
    },
  },
  authorization: {
    name: "auth-prakerin",
    max_age: 60 * 60 * 24 * 80, // 80 Day's
  },
  scrapper_SekolahKita: {
    school_type: [
      "SMK", // SMK
      "SMA", // SMA
      "MA", // MA
    ],
    school_status: [
      "Negeri", // Negeri
      "Swasta", // Swasta
      "Lainnya", // Lainnya
    ],
  },
};
