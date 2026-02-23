import { RegistryBuilder } from "seishiro";

const registry = new RegistryBuilder();

// Student / Participant - Profile
registry.set("participant:profile-get", () => {}, null); // Detail Profil Diri
registry.set("participant:profile-edit", () => {}, null); // Ubah Data Diri
// Student / Participant - Group Trainee
registry.set("participant:group-trainee-list", () => {}, null); // List Kelompok PKL
registry.set("participant:create-group-trainee", () => {}, null); // Buat Kelompok PKL
registry.set("participant:group-trainee-delete", () => {}, null); // Hapus Kelompok PKL
// Student / Participant - Group Trainee Participants
registry.set("participant:group-trainee-participants-list", () => {}, null); // List Peserta Didik dalam Kelompok PKL
registry.set("participant:join-group-trainee", () => {}, null); // Bergabung dengan Kelompok PKL
registry.set("participant:leave-group-trainee", () => {}, null); // Keluar dari Kelompok PKL
registry.set("participant:kick-group-trainee", () => {}, null); // Mengeluarkan Peserta Didik dari Kelompok PKL
// Student / Participant - Trainee Activity
registry.set("participant:trainee-activity-list", () => {}, null); // List Aktivitas PKL
registry.set("participant:trainee-activity-update", () => {}, null); // Memperbarui Aktivitas PKL
registry.set("participant:trainee-activity-delete", () => {}, null); // Menghapus Aktivitas PKL

export default registry;
