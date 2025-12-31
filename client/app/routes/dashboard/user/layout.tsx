import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  User,
  Building2,
  FileText,
  LogOut,
  Info,
  ArrowRightLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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
    return (
      location.pathname === `/dashboard/user${path === "." ? "" : `/${path}`}`
    );
  };

  // Mobile Bottom Navigation (Floating Island Style)
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-stone-50 dark:bg-gray-950 relative overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-emerald-500 opacity-20 blur-[100px]"></div>

        {/* Header */}
        <header className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-4 sticky top-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                  User Dashboard
                </h1>
                <p className="text-xs text-emerald-600 font-medium">
                  Replas Bank Sampah
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all active:scale-95 border border-red-100"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 pb-24 relative z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Floating Bottom Navigation */}
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl px-2 py-2 shadow-2xl shadow-emerald-500/10">
            <div className="flex justify-between items-center relative">
              {menu.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 relative group flex-1 ${
                      active
                        ? "text-emerald-600 dark:text-emerald-400 -translate-y-1"
                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    }`}
                  >
                    {/* Active Indicator Dot */}
                    {active && (
                      <span className="absolute -top-1 w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_8px_2px_rgba(16,185,129,0.4)]"></span>
                    )}

                    <Icon
                      className={`w-6 h-6 ${active ? "fill-emerald-500/10 stroke-[2.5px]" : "stroke-2"}`}
                    />
                    <span
                      className={`text-[10px] font-medium mt-1 transition-all duration-300 ${active ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 hidden"}`}
                    >
                      {/* Optional: Show label only if active or keep hidden for minimalism */}
                      {/* {item.label.split(' ')[0]} */}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    );
  }

  // Desktop Layout (Premium)
  return (
    <div className="flex h-screen bg-stone-50 dark:bg-gray-950 font-sans selection:bg-emerald-500/20">
      {/* Sidebar - Glassmorphism & Dark Green */}
      <aside className="relative w-72 bg-[#0a2f1c] text-white p-6 flex flex-col shadow-2xl z-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/40 z-0"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl z-0"></div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-10 pl-2">
            <h2 className="text-2xl font-bold flex items-center gap-3 tracking-tight">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/50 text-white">
                <User className="w-5 h-5" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-200">
                Replas
              </span>
            </h2>
            <p className="text-xs text-emerald-400/80 font-medium ml-[52px] -mt-1 tracking-wider uppercase">
              User Portal
            </p>
          </div>

          <nav className="space-y-1.5 flex-1">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-3.5 rounded-xl px-4 py-3.5 transition-all duration-300 relative overflow-hidden ${
                    active
                      ? "bg-white/10 text-white shadow-lg shadow-black/10 border border-white/5"
                      : "text-emerald-100/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {/* Active Glow Bar */}
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 rounded-r-full shadow-[0_0_12px_rgba(52,211,153,0.6)]"></div>
                  )}

                  <Icon
                    className={`w-5 h-5 transition-transform duration-300 ${active ? "scale-110 text-emerald-300" : "group-hover:scale-105"}`}
                  />
                  <span className="font-medium tracking-wide text-sm">
                    {item.label}
                  </span>

                  {/* Hover shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full group flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">
                {isLoggingOut ? "Logging out..." : "Sign Out"}
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Halaman isi */}
      <main className="flex-1 overflow-y-auto relative z-10">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent dark:from-gray-900 pointer-events-none opacity-50"></div>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
