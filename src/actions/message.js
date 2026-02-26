import { MessageBuilder } from "seishiro";

// Set Your Variable Message
const message = new MessageBuilder("id");
// Default Seishiro Variable Message
message.set("no-response-sending", "Server tidak merespon!");
message.set("no-registry", "Registry tidak ditemukan!");
message.set("internal-server-error", "Terjadi kesalahan pada server!");
message.set("client-version-required", "Versi client/SDK wajib diisi!");
message.set("need-upgrade-client", "Versi client/SDK perlu di upgrade!");
// S3 Bucket Error
message.set("s3-bucket-check-failed", "Gagal mengecek bucket {{bucket}}!");
message.set("s3-bucket-create-failed", "Gagal membuat bucket {{bucket}}!");
message.set("s3-upload-failed", "Gagal mengupload file ke bucket!");
message.set("s3-delete-failed", "Gagal menghapus file {{id}}!");
message.set("s3-read-failed", "Gagal membaca file {{id}}!");
message.set("s3-signed-url-failed", "Gagal membuat signed URL untuk {{id}}!");
message.set("s3-list-failed", "Gagal mengambil daftar file!");
// Turnstile Error
message.set("turnstile-error-failed", "Gagal memverifikasi Turnstile!");
message.set("turnstile-token-invalid", "Token Turnstile tidak valid!");
message.set(
  "turnstile-logic-crash",
  "Logika untuk memverfikasi Turnstile gagal!",
);
// Auth Error
message.set("user-not-found", "User tidak ditemukan!");
message.set("password-not-match", "Password tidak cocok, coba lagi!");
message.set("auth-not-found", "Sesi login tidak ditemukan!");

export default message;
