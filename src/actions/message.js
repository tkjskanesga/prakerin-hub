import { MessageBuilder } from "seishiro";

// Set Your Variable Message
const message = new MessageBuilder("id");
// Default Seishiro Variable Message
message.set("no-response-sending", "Server tidak merespon!");
message.set("no-registry", "Registry tidak ditemukan!");
message.set("internal-server-error", "Terjadi kesalahan pada server!");
// S3 Bucket Error
message.set("bucket-check-failed", "Gagal mengecek bucket {{bucket}}!");
message.set("bucket-create-failed", "Gagal membuat bucket {{bucket}}!");
message.set("upload-failed", "Gagal mengupload file ke bucket!");
message.set("delete-failed", "Gagal menghapus file {{id}}!");
message.set("read-failed", "Gagal membaca file {{id}}!");
message.set("signed-url-failed", "Gagal membuat signed URL untuk {{id}}!");
// Turnstile Error
message.set("turnstile-error-failed", "Gagal memverifikasi Turnstile!");
message.set("turnstile-token-invalid", "Token Turnstile tidak valid!");
message.set("turnstile-logic-crash", "Logika untuk memverfikasi Turnstile gagal!")

export default message;
