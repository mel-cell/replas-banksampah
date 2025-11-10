import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { User, Building2, FileText, LogOut, Info, ArrowRightLeft } from "lucide-react";
import { useState, useEffect } from "react";

export default function UserDashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Clear token from localStorage
      localStorage.removeItem("token");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menu = [
    { path: "", label: "Profil", icon: User }, // index route
    { path: "scan", label: "Scan QR", icon: Building2 },
    { path: "conversion", label: "Tukar Poin", icon: ArrowRightLeft },
    { path: "info", label: "Cara Penggunaan", icon: Info },
    { path: "history", label: "Riwayat Transaksi", icon: FileText },
  ];

  const isActive = (path: string) => {
    return location.pathname === `/dashboard/user${path === "." ? "" : `/${path}`}`;
  };

  // Mobile Bottom Navigation
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-gradient-to-r from-emerald-600 to-green-700 text-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <h1 className="text-lg font-bold">User Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>

        {/* Bottom Navigation - Icon Only */}
        <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 shadow-lg">
          <div className="flex justify-around items-center">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 min-w-0 flex-1 ${
                    active
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  title={item.label} // Tooltip for accessibility
                >
                  <Icon className={`w-7 h-7 ${active ? "scale-110" : ""}`} />
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    );
  }

  // Desktop Layout (unchanged)
  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-emerald-600 to-green-700 text-white p-6 space-y-4 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-green-50 flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          User Dashboard
        </h2>
        <nav className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200 ${
                  active
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
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </aside>

      {/* Halaman isi */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
