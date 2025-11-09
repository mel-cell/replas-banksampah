import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  BarChart3,
  Users,
  Building2,
  FileText,
  User,
  LogOut,
} from "lucide-react";
import { useState } from "react";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menu = [
    { path: "", label: "Statistik", icon: BarChart3 }, // index route
    { path: "users", label: "Manajemen User", icon: Users },
    { path: "rooms", label: "Monitoring Room", icon: Building2 },
    { path: "laporan", label: "Laporan Penjualan Sampah", icon: FileText },
    { path: "profile", label: "Profil Admin", icon: User },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Clear token from localStorage
      localStorage.removeItem('token');
      // Navigate to login
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-emerald-600 to-green-700 text-white p-6 space-y-4 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-green-50 flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          Admin Dashboard
        </h2>
        <nav className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === `/dashboard/admin${item.path === "." ? "" : `/${item.path}`}`;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-white/20 shadow-md border-l-4 border-green-200 text-green-50"
                    : "hover:bg-white/10 hover:translate-x-1 text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="mt-6 w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg py-3 text-sm transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </aside>

      {/* Halaman isi */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
