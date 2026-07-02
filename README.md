# Averion Coffee: Coffee Shop Management System

Tugas Besar Pemrograman Berorientasi Objek **Kelompok 7**

| Bagian | Teknologi | Folder |
|---|---|---|
| Backend (REST API) | Java 17 · Spring Boot (MVC) · MySQL/H2 | [`source/backend/`](source/backend/) |
| Frontend (POS + Dashboard) | React 18 · TypeScript · Vite | [`source/frontend/`](source/frontend/) |

Aplikasi terdiri dari **dua bagian** yang dijalankan bersamaan di **dua terminal** terpisah:
Terminal 1 untuk **Backend** (port `8080`), Terminal 2 untuk **Frontend** (port `5173`).

> Seluruh kode sumber berada di dalam folder [`source/`](source/) (`source/backend` dan `source/frontend`).

---

## Prasyarat

Pasang lebih dulu (cek dengan perintah di kanan):

| Kebutuhan | Versi | Cek versi |
|---|---|---|
| **Git** | terbaru | `git --version` |
| **JDK (Java)** | 17+ | `java -version` |
| **Node.js** | 18+ | `node -v` |
| **npm** | (ikut Node) | `npm -v` |
| **MySQL** | opsional* | `mysql --version` |

> *MySQL opsional. Kalau tidak mau memasang MySQL, jalankan backend dengan **profil H2** (database in-memory) lihat di bawah.

> Perintah `git`, `java`, `node`, dan `npm` sama persis di semua sistem operasi. Yang **berbeda** hanya cara memanggil Maven wrapper di backend (`./mvnw` vs `.\mvnw.cmd`).

---

## 1) Clone Repository

Unduh kode dari GitHub, lalu masuk ke folder project. Perintahnya **sama di semua OS & terminal** (bash, zsh, PowerShell, CMD):

```bash
git clone https://github.com/AphidZ/averion-coffe-management-system.git
cd averion-coffe-management-system
```

Setelah ini kamu berada di **folder project**. Kode ada di `source/backend` dan `source/frontend`.

> **Sudah pernah clone sebelumnya?** Cukup tarik update terbaru dari dalam folder project:
> ```bash
> git pull
> ```

---

## 2) Menjalankan Backend: port 8080

Dari folder project, masuk ke `source/backend`, lalu jalankan sesuai sistem operasi & terminal Anda.

### 🍎 macOS / 🐧 Linux: Terminal (bash / zsh)

```bash
cd source/backend

# Cara cepat tanpa MySQL (database H2 in-memory):
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2

# Atau pakai MySQL (atur password database dulu):
./mvnw spring-boot:run
```

> Jika muncul `permission denied: ./mvnw`, beri izin eksekusi sekali saja:
> ```bash
> chmod +x mvnw
> ```

### 🪟 Windows: PowerShell

```powershell
cd source\backend

# Cara cepat tanpa MySQL (database H2 in-memory):
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=h2"

# Atau pakai MySQL (atur password database dulu):
.\mvnw.cmd spring-boot:run
```

> Tanda kutip pada `"-Dspring-boot.run.profiles=h2"` penting di PowerShell agar argumen tidak terpotong.

### 🪟 Windows: Command Prompt (CMD)

```bat
cd source\backend

REM Cara cepat tanpa MySQL (database H2 in-memory):
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=h2

REM Atau pakai MySQL (atur password database dulu):
mvnw.cmd spring-boot:run
```

### Alternatif: set profil lewat environment variable

Kalau argumen `-D...` bermasalah di terminal Anda, atur profil `h2` lewat env var:

| Terminal | Perintah |
|---|---|
| **bash / zsh** (macOS/Linux) | `SPRING_PROFILES_ACTIVE=h2 ./mvnw spring-boot:run` |
| **PowerShell** (Windows) | `$env:SPRING_PROFILES_ACTIVE="h2"; .\mvnw.cmd spring-boot:run` |
| **CMD** (Windows) | `set SPRING_PROFILES_ACTIVE=h2 && mvnw.cmd spring-boot:run` |

Tunggu hingga log menampilkan aplikasi berjalan di **http://localhost:8080**. Data awal (akun, produk, voucher, dll.) dibuat otomatis saat pertama kali dijalankan.

---

## 3) Menjalankan Frontend: port 5173

Buka **terminal kedua**, dari folder project masuk ke `source/frontend`. Perintahnya **sama untuk semua OS & terminal**:

```bash
cd source/frontend
npm install     # cukup sekali saat pertama kali
npm run dev
```

> Di Windows PowerShell/CMD gunakan `cd source\frontend`.

Buka alamat yang ditampilkan Vite (mis. **http://localhost:5173**). Request `/api/**` otomatis diteruskan ke backend lewat proxy Vite.

---

## Login & Penggunaan Singkat

Login kasir: **`siti_kasir` / `cashier123`**

- Tab **Dashboard** kelola kategori / produk / meja / voucher / user, serta lihat orders & bookings.
- Tab **Menu** alur POS: pilih produk → meja/booking → voucher → bayar Cash/QRIS.

> Catatan: kalau backend tidak berjalan, frontend otomatis fallback ke data mock lokal (read-only) supaya UI tetap bisa dibuka.

---

## Solusi Masalah Umum

| Masalah | Solusi |
|---|---|
| `git` tidak dikenali | Pasang Git dari [git-scm.com](https://git-scm.com), lalu buka ulang terminal. |
| `permission denied: ./mvnw` (macOS/Linux) | Jalankan `chmod +x mvnw` di folder `source/backend`. |
| `mvnw` tidak dikenali (Windows) | Gunakan `.\mvnw.cmd` (PowerShell) atau `mvnw.cmd` (CMD), bukan `./mvnw`. |
| Backend gagal karena MySQL | Jalankan dengan profil H2 (lihat Bagian 2). |
| Port 8080 / 5173 sudah dipakai | Tutup aplikasi lain yang memakai port tersebut, lalu jalankan ulang. |
| `java`/`node`/`npm` tidak dikenali | Pastikan JDK 17+ dan Node.js 18+ terpasang dan ada di PATH. |
