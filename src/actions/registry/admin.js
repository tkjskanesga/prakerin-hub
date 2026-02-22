import { RegistryBuilder } from "seishiro";

const registry = new RegistryBuilder({
  middlewareNoContextRes: true, // Disable Auto Response Context HTTP
});

// Admin Platform - School Controls
registry.set("admin:school-list", () => {}, null); // List Sekolah
registry.set("admin:school-get", () => {}, null); // Detail Sekolah
registry.set("admin:school-create", () => {}, null); // Buat Sekolah
registry.set("admin:school-edit", () => {}, null); // Ubah Data Sekolah
registry.set("admin:school-delete", () => {}, null); // Hapus (soft/hard) Data Sekolah
// Admin Platform - Office Controls
registry.set("admin:office-list", () => {}, null); // List Kantor
registry.set("admin:office-get", () => {}, null); // Detail Kantor
registry.set("admin:office-create", () => {}, null); // Buat Kantor
registry.set("admin:office-edit", () => {}, null); // Ubah Data Kantor
registry.set("admin:office-delete", () => {}, null); // Hapus (soft/hard) Data Kantor

export default registry;
