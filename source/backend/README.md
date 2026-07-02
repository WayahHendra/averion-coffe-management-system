# ☕ Averion Coffee — Backend (REST API)

Tugas Besar Pemrograman Berorientasi Objek — **Kelompok 7**

Backend murni (REST API) berbasis **Java 17 + Spring Boot (arsitektur MVC)**, terhubung ke
database **MySQL** (atau H2 untuk demo cepat). Frontend-nya adalah aplikasi React di
folder `../frontend` — bentuk JSON API ini dibuat persis sama dengan tipe data frontend
(snake_case, pajak 12%, role SuperAdmin–Kitchen).

## Cara Menjalankan

### Opsi A — MySQL (default)
1. Pastikan MySQL berjalan di `localhost:3306`, lalu sesuaikan username/password di
   [`src/main/resources/application.properties`](src/main/resources/application.properties).
   Database `averion_pos` dibuat otomatis.
2. ```bash
   ./mvnw spring-boot:run
   ```

### Opsi B — H2 (tanpa install apa pun)
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
```
Data tersimpan di folder `data/` (console: `http://localhost:8080/h2-console`,
JDBC URL `jdbc:h2:file:./data/averion`, user `sa`).

API berjalan di **http://localhost:8080/api**. Saat database kosong, seluruh data awal
(produk, kategori, meja, voucher, user, contoh order/booking) di-seed otomatis dari
`src/main/resources/seed/*.json` — file yang sama dengan mock data frontend.

## Akun Demo

| Role | Username | Password |
|---|---|---|
| Cashier | `siti_kasir` | `cashier123` |
| Cashier | `rina_bdg` | `cashier123` |
| SuperAdmin | `superadmin` | `hashed_password` |
| TenantOwner | `buditenant` | `hashed_password` |
| BranchManager | `andi_jkt` | `hashed_password` |
| Kitchen | `chef_juna` | `hashed_password` |

Password di-hash BCrypt di database; login menerima username atau email.

## Endpoint Utama

| Method & Path | Fungsi |
|---|---|
| `POST /api/auth/login` | Login (`{identifier, password}` → `{success, data, permissions}`) |
| `GET /api/bootstrap` | Semua data awal sekali muat (products, categories, tables, vouchers, users, orders, bookings, roles) |
| `GET/POST/PUT/DELETE /api/categories[/{id}]` | Kelola kategori |
| `GET/POST/PUT/DELETE /api/products[/{id}]` | Kelola produk |
| `GET/POST/PUT/DELETE /api/tables[/{id}]` | Kelola meja |
| `GET/POST /api/vouchers`, `DELETE /api/vouchers/{code}` | Kelola voucher |
| `GET/POST/PUT/DELETE /api/users[/{id}]`, `GET /api/roles` | Manajemen user & role |
| `GET/POST /api/orders` | Order POS (server menghitung subtotal, diskon voucher, pajak 12%, total; meja jadi `occupied`; `sold_count` produk bertambah) |
| `GET/POST /api/bookings` | Reservasi + pre-order (meja jadi `reserved`) |

## Arsitektur MVC

```
src/main/java/com/averion/backend
├── model/        # Entity JPA: Category, Product, CoffeeTable, Voucher, User,
│                 # Order, OrderItem, Booking, BookingItem
├── repository/   # Spring Data JPA (akses database)
├── service/      # Logika bisnis: AuthService, CatalogService, OrderService,
│                 # BookingService, UserService, RoleCatalog
├── controller/   # REST controller per modul + ApiExceptionHandler
├── dto/          # Bentuk request body (OrderRequest, BookingRequest)
├── config/       # CorsConfig (izin dev server Vite), DataSeeder
└── util/         # Json (kolom JSON mentah: sizes, sugar_levels)
```

Alur request: **React (View) → Controller → Service → Repository → Database**.
Catatan teknis: Spring Boot 4 memakai Jackson 3 (`tools.jackson.*`), dan field JSON
otomatis snake_case via `spring.jackson.property-naming-strategy=SNAKE_CASE`.

## Pembagian Modul (sesuai proposal)

1. **Manajemen User & Otentikasi** — `AuthController`, `AuthService`, `UserService`, `RoleCatalog`
2. **Kelola Kategori & Produk** — `CatalogController`, `CatalogService`
3. **Cart & Order** — `OrderController`, `OrderService` (cart di sisi frontend POS)
4. **Booking & Pilih Meja** — `BookingService`, entity `Booking`/`CoffeeTable`
5. **Pembayaran & Konfirmasi** — alur pembayaran POS di `OrderService` + `PaymentModal` frontend
