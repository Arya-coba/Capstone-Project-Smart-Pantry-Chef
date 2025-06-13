# Smart Pantry Chef

## 🚀 Panduan Menjalankan Aplikasi

### Prasyarat
- Node.js (versi 16 atau lebih baru)
- npm (bawaan Node.js) atau Yarn
- Git (untuk mengklon repository)

### 1. Mengklon Repository
```bash
git clone <repository-url>
cd "CAPSTONE PROJECT SMAR PANTRY CHEF"
```

### 2. Menjalankan Backend

#### a. Persiapan
1. Buka terminal dan masuk ke direktori backend:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Salin file .env.example menjadi .env:
   ```bash
   cp .env.example .env
   ```

4. Sesuaikan konfigurasi di file .env sesuai kebutuhan:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/smartpantry
   JWT_SECRET=rahasia_anda
   ```

#### b. Menjalankan Server
- Mode pengembangan (dengan auto-reload):
  ```bash
  npm run dev
  ```

- Mode produksi:
  ```bash
  npm start
  ```

- Server backend akan berjalan di: http://localhost:5000
- Untuk memeriksa apakah backend berjalan dengan baik, buka:
  ```
  http://localhost:5000/api/health
  ```

### 3. Menjalankan Frontend

#### a. Persiapan
1. Buka terminal baru (jangan menutup terminal backend)
2. Masuk ke direktori frontend:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Salin file .env.example menjadi .env:
   ```bash
   cp .env.example .env
   ```

5. Pastikan konfigurasi API_URL di .env mengarah ke backend:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

#### b. Menjalankan Aplikasi
- Mode pengembangan:
  ```bash
  npm start
  ```
  Aplikasi akan terbuka otomatis di browser ke:
  ```
  http://localhost:3000
  ```

- Mode produksi (untuk build):
  ```bash
  npm run build
  ```
  File produksi akan dibuat di folder `build/`

### 4. Mengakses Aplikasi
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Dokumentasi API: http://localhost:5000/api-docs (jika menggunakan Swagger)

### 5. Masalah Umum dan Solusi

#### Backend tidak terhubung ke database
- Pastikan MongoDB berjalan
- Periksa koneksi string di file .env

#### Error saat install dependencies
- Hapus folder node_modules dan file package-lock.json, lalu jalankan `npm install` lagi
- Pastikan versi Node.js sesuai

#### Port sudah digunakan
- Ubah port di file .env
- Atau hentikan proses yang menggunakan port tersebut

### 6. Perintah Berguna Lainnya

#### Membersihkan cache npm
```bash
npm cache clean --force
```

#### Melihat proses yang berjalan di port tertentu (Windows)
```bash
netstat -ano | findstr :<port>
taskkill /PID <PID> /F
```

#### Melihat log aplikasi
- Backend: Periksa output di terminal
- Frontend: Gunakan browser dev tools (F12)

### 7. Arsitektur Aplikasi (MVP)

Smart Pantry Chef diorganisir menggunakan pola **Model-View-Presenter** agar kode terstruktur dan mudah dipelihara.

| Layer | Berkas / Direktori | Peran |
|-------|--------------------|-------|
| **Model** | `backend/src/models` (Mongoose schemas), `ML micro-service` | Menyimpan & memproses data (user, resep, deteksi bahan). |
| **View** | `frontend/src/pages` & `frontend/src/components` | Antarmuka React yang dirender di browser. |
| **Presenter** | `frontend/src/contexts` (state & API hooks), `backend/src/controllers`, `routes` | Menjembatani Model ↔ View: menangani logika bisnis, pemanggilan API, translate proxy. |

Alur Singkat:
1. View (React component) memicu aksi (mis. cari resep) → Presenter FE memanggil REST API.
2. Presenter BE (`controller`) memproses request, berinteraksi dengan Model/ML/API eksternal.
3. Response dikirim kembali; Presenter FE memperbarui state dan View merender hasil.

Diagram sederhana:
```
React View  <──presenter──>  REST API  <──controller──>  Model/DB
                                 │
                                 └──>  ML Service / LibreTranslate
```

Dengan pembagian ini, setiap layer dapat diuji dan dikembangkan secara terpisah.