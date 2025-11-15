import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Halaman utama publik
  index("routes/app.tsx"),
  route("about", "routes/about.tsx"),
  route("services", "routes/services.tsx"),
  route("contact", "routes/contact.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("room/banksampah01/", "routes/room/room.tsx"),

  // Dashboard User
  route("dashboard/user", "routes/dashboard/user/layout.tsx", [
    index("routes/dashboard/user/index.tsx"), // halaman utama (profile + wallet poin)
    route("scan", "routes/dashboard/user/scan.tsx"), // halaman scan QR
    route("conversion", "routes/dashboard/user/conversion.tsx"), // halaman tukar poin
    route("info", "routes/dashboard/user/info.tsx"), // panduan cara penggunaan
    route("history", "routes/dashboard/user/history.tsx"), // halaman riwayat transaksi
  ]),

  // Dashboard Admin
  route("dashboard/admin", "routes/dashboard/admin/layout.tsx", [
    index("routes/dashboard/admin/index.tsx"), // statistik semua bagian
    route("users", "routes/dashboard/admin/users.tsx"), // manajemen user
    route("rooms", "routes/dashboard/admin/rooms.tsx"), // monitoring ketersediaan room
    route("conversions", "routes/dashboard/admin/conversions.tsx"), // manajemen penukaran poin
    route("laporan", "routes/dashboard/admin/laporan.tsx"), // laporan penjualan sampah
    route("profile", "routes/dashboard/admin/profile.tsx"), // profile admin
  ]),
] satisfies RouteConfig;
