# Prakerin Hub (Praktik Kerja Industri) - Sederhanakan Administrasi, Maksimalkan Potensi Praktik!

> [!WARNING]
> Aplikasi masih ditahap pengembangan, silahkan tunggu dari hasil task yang dikerjakan!.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-099cec?style=for-the-badge&logo=docker&logoColor=white)
![Postgresql](https://img.shields.io/badge/Postgresql-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Amazon S3](https://img.shields.io/badge/Amazon%20S3-FF9900?style=for-the-badge&logo=amazons3&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)

Prakerin Hub adalah sistem informasi manajemen Praktik Kerja Lapangan (PKL) dan Magang yang dirancang untuk mengotomatisasi proses administrasi pengajuan serta menyediakan fitur pelacakan (tracker) aktivitas peserta (siswa/mahasiswa).

## 🧑💻 Fitur Utama:

- **Manajemen Pengajuan Kelompok**: Memungkinkan peserta untuk membentuk grup, menggabungkan beberapa anggota, dan melakukan pengajuan PKL secara kolektif kepada pembimbing.
- **Integritas Data**: Untuk menjaga validitas informasi, data pengajuan yang sedang dalam proses atau telah diterima akan dikunci secara otomatis dan tidak dapat diubah kembali.
- **Otomatisasi Dokumen**: Sistem mendukung pembuatan laporan pengajuan otomatis yang dapat langsung dicetak ke format PDF, baik melalui modul internal maupun integrasi alur sistem yang tersedia.
- **Pelacakan Status Transparan**: Monitoring status permohonan dengan kategori yang jelas: *Diterima*, *Tidak Diterima*, atau *Menunggu Jawaban Perusahaan*.
- **Sistem Tracker Aktivitas**: Fitur pemantauan kegiatan harian peserta selama masa PKL. Status aktivitas dapat diperbarui oleh peserta maupun pembimbing untuk memberikan transparansi progres kerja dan memudahkan koordinasi antara pihak institusi pendidikan dan perusahaan.

## 📚 Instalasi

Aplikasi ini dapat diinstall menggunakan opsi Docker Compose.

### Persyaratan Sistem
- **Database**: PostgreSQL versi 17 atau lebih baru.
- **Object Storage/Simple Storage Service (S3)**: MinIO, RustFS, atau AWS S3.
- **Bot Protection**: Cloudflare Turnstile.

### Opsi Image Docker
Tersedia dua versi image yang dapat digunakan:
- **Stable**: `ghcr.io/tkjskanesga/prakerin-hub:latest` (Direkomendasikan)
- **Development**: `ghcr.io/tkjskanesga/prakerin-hub:stage` (Versi tahap awal, sering berubah)

### Menggunakan Auto Installer

> [!WARNING]
> Auto installer ini akan menginstall aplikasi di direktori kerja saat ini, dan akan menghapus direktori kerja setelah selesai.

```bash
curl https://raw.githubusercontent.com/tkjskanesga/prakerin-hub/main/auto-installer.sh -o ./setup.sh
chmod +x ./setup.sh
./setup.sh
```

Ikuti instruksi yang diberikan oleh auto installer, pastikan docker & bun sudah terinstall.

### Menggunakan Docker Compose

Aplikasi berjalan di port `3000` dan tidak memerlukan mounting volume khusus pada container aplikasi. Berikut contoh konfigurasi `docker-compose.yml`:

```yaml
services:
  app:
    image: ghcr.io/tkjskanesga/prakerin-hub:latest
    container_name: prakerinhub-app
    ports:
      - "3000:3000"
    environment:
      - # Application (Required)
      - "APP_DEBUG=true"
      - "APP_JWT_SECRET=xxxxxx" # Need Generated For JWT!
      - "SEISHIRO_PASSKEY=xxxx" # Need Generated For Seishiro!
      - # Turnstle Widget (Required)
      - "TURNSTILE_SITE_KEY=xxx" # Need From Cloudflare
      - "TURNSTILE_SECRET_KEY=xxx" # Need From Cloudflare
      - # Database (Required)
      - "DB_HOST=postgres" # Hostname
      - "DB_PORT=5432" # Port
      - "DB_USERNAME=postgres" # Username
      - "DB_PASSWORD=password" # Password
      - "DB_DATABASE=prakerinhub" # Database
      - # S3 Bucket (Required)
      - "S3_ACCESS_KEY_ID=minioadmin"
      - "S3_SECRET_ACCESS_KEY=minioadmin"
      - "S3_REGION=us-east-1"
      - "S3_ENDPOINT=http://minio:9000"
      - "S3_BUCKET=prakerinhub"
      - "S3_USE_PATH_STYLE_ENDPOINT=false"
      - # Gotenberg (Required)
      - "GOTENBERG_URL=http://gotenberg:3000"
    depends_on:
      - postgres
      - minio
    networks:
      - prakerin_hub_network

  postgres:
    image: postgres:17-alpine
    restart: unless-stopped
    container_name: prakerinhub-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: prakerin-hub
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - prakerin_hub_network

  minio:
    image: minio/minio
    container_name: prakerinhub-minio
    restart: unless-stopped
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_data:/data
    networks:
      - prakerin_hub_network

  gotenberg:
    image: gotenberg/gotenberg:8.26.0
    container_name: prakerinhub-gotenberg
    restart: unless-stopped
    networks:
      - prakerin_hub_network

volumes:
  postgres_data:
  minio_data:

networks:
  prakerin_hub_network:
```

Untuk migrasi silahkan jalankan :

```bash
bun ./migrate.js
# Atau
bunx drizzle-kit migrate
```

### Reset Password

Untuk reset password silahkan jalankan :

```bash
bun ./reset-pw.js
```

### Deployment Lainnya

- **Kubernetes**: Gunakan image yang sama (`ghcr.io/tkjskanesga/prakerin-hub`) dan sesuaikan konfigurasi Environment Variables menggunakan ConfigMap/Secret, untuk saat ini belum terlalu didukung, namun dapat berjalan dengan baik.
- **Serverless**: Aplikasi mendukung deployment di Vercel atau penyedia serverless lainnya.

## 📞 Layanan Pengaduan

Jika ada masalah, bisa report atau kirim masalahnya pada [GitHub Issues](https://github.com/tkjskanesga/prakerin-hub/issues).