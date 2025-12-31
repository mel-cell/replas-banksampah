import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  BarChart3,
  Users,
  Building2,
  FileText,
  User,
  LogOut,
  ArrowRightLeft,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminLayout() {
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

  const menu = [
    { path: "", label: "Statistik", icon: BarChart3 }, // index route
    { path: "users", label: "Manajemen User", icon: Users },
    { path: "rooms", label: "Monitoring Room", icon: Building2 },
    { path: "conversions", label: "Penukaran Poin", icon: ArrowRightLeft },
    { path: "laporan", label: "Laporan Penjualan", icon: FileText },
    { path: "profile", label: "Profil Admin", icon: User },
  ];

  const isActive = (path: string) => {
    return (
      location.pathname === `/dashboard/admin${path === "." ? "" : `/${path}`}`
    );
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Clear token from localStorage
      localStorage.removeItem("token");
      // Navigate to login
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Mobile Bottom Navigation (Floating Island Style)
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-teal-500 opacity-20 blur-[100px]"></div>

        {/* Header */}
        <header className="relative z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/20 text-white">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  Admin Portal
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Replas Management
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
          <Outlet />
        </main>

        {/* Floating Bottom Navigation */}
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-2 py-2 shadow-2xl shadow-slate-500/10">
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
                        ? "text-teal-600 dark:text-teal-400 -translate-y-1"
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    }`}
                  >
                    {/* Active Indicator Dot */}
                    {active && (
                      <span className="absolute -top-1 w-1 h-1 bg-teal-500 rounded-full shadow-[0_0_8px_2px_rgba(20,184,166,0.4)]"></span>
                    )}

                    <Icon
                      className={`w-6 h-6 ${active ? "fill-teal-500/10 stroke-[2.5px]" : "stroke-2"}`}
                    />
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    );
  }

  // Desktop Layout (Premium Admin Theme)
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-teal-500/20">
      {/* Sidebar - Deep Slate & Teal Accents */}
      <aside className="relative w-72 bg-[#0f172a] text-white p-6 flex flex-col shadow-2xl z-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/40 z-0"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl z-0"></div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-10 pl-2">
            <h2 className="text-2xl font-bold flex items-center gap-3 tracking-tight">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-900/50 text-white">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Replas
              </span>
            </h2>
            <p className="text-xs text-slate-400/80 font-medium ml-[52px] -mt-1 tracking-wider uppercase">
              Admin Console
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
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {/* Active Glow Bar */}
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-400 rounded-r-full shadow-[0_0_12px_rgba(45,212,191,0.6)]"></div>
                  )}

                  <Icon
                    className={`w-5 h-5 transition-transform duration-300 ${active ? "scale-110 text-teal-300" : "group-hover:scale-105"}`}
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
              className="w-full group flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
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

        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
