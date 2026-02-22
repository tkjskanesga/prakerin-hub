import { RegistryBuilder } from "seishiro";

const registry = new RegistryBuilder({
  noMidGen: true, // No Middleware Generate Response Context
});

// Teach / Mentor Admin - Profile School
registry.set("mentor:profile-school-get", () => {}, null); // Detail Profil Sekolah
registry.set("mentor:profile-school-edit", () => {}, null); // Ubah Data Sekolah
// Teach / Mentor Admin - Profile
registry.set("mentor:profile-get", () => {}, null); // Detail Profil Diri
registry.set("mentor:profile-edit", () => {}, null); // Ubah Data Diri
registry.set("mentor:profile-update-signature", () => {}, null); // Menambahkan/Memperbarui Tanda Tangan
// Teach / Mentor Admin - Create Mentor Basic
registry.set("mentor:mentor-list", () => {}, null); // List Mentor
registry.set("mentor:mentor-get", () => {}, null); // Detail Mentor
registry.set("mentor:mentor-create", () => {}, null); // Buat Mentor
registry.set("mentor:mentor-edit", () => {}, null); // Ubah Data Mentor
registry.set("mentor:mentor-delete", () => {}, null); // Hapus (soft/hard) Data Mentor
// Teach / Mentor Admin - Class Controls
registry.set("mentor:class-list", () => {}, null); // List Kelas
registry.set("mentor:class-create", () => {}, null); // Buat Kelas
registry.set("mentor:class-edit", () => {}, null); // Ubah Data Kelas
registry.set("mentor:class-delete", () => {}, null); // Hapus (hard) Data Kelas
// Teach / Mentor Admin - Participant Controls
registry.set("mentor:participant-list", () => {}, null); // List Peserta Didik
registry.set("mentor:participant-get", () => {}, null); // Detail Peserta Didik
registry.set("mentor:participant-create", () => {}, null); // Buat Peserta Didik
registry.set("mentor:participant-edit", () => {}, null); // Ubah Data Peserta Didik
registry.set("mentor:participant-reset-pw", () => {}, null); // Reset Password Peserta Didik
registry.set("mentor:participant-delete", () => {}, null); // Hapus (hard) Data Peserta Didik
// Teach / Mentor Admin - Letter Template
registry.set("mentor:letter-template-list", () => {}, null); // List Template Surat
registry.set("mentor:letter-template-upload", () => {}, null); // Upload Template Surat
registry.set("mentor:letter-template-delete", () => {}, null); // Hapus Template Surat
// Teach / Mentor Admin - Trainee
registry.set("mentor:trainee-list", () => {}, null); // List Peserta Didik
registry.set("mentor:trainee-get", () => {}, null); // Detail Peserta Didik
registry.set("mentor:trainee-delete", () => {}, null); // Hapus (hard) Data Peserta Didik
registry.set("mentor:trainee-accept-as-partner", () => {}, null); // Menerima Diri Menjadi Partner
registry.set("mentor:trainee-update-status", () => {}, null); // Memperbarui Status Peserta Didik
// Teach / Mentor Admin - Trainee Activity
registry.set("mentor:trainee-activity-list", () => {}, null); // List Aktivitas PKL
registry.set("mentor:trainee-activity-update", () => {}, null); // Memperbarui Aktivitas PKL
registry.set("mentor:trainee-activity-delete", () => {}, null); // Menghapus Aktivitas PKL

export default registry;
